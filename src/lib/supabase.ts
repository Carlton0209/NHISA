import type { SupabaseClient } from '@supabase/supabase-js';

/**
 * The connection the shared photo wall and the comments use: the Supabase
 * project set up by supabase/schema.sql and supabase/comments.sql. Without the
 * VITE_SUPABASE_* settings (SHARED is false) both keep visitors' additions in
 * their own browser instead.
 *
 * Reading is a plain request; the Supabase client only loads when someone
 * sends something, checks on it, or reviews.
 */

export const PROJECT = (import.meta.env.VITE_SUPABASE_URL ?? '').replace(/\/+$/, '');
export const KEY = import.meta.env.VITE_SUPABASE_ANON_KEY ?? '';
const CAPTCHA_KEY = import.meta.env.VITE_TURNSTILE_SITE_KEY ?? '';
// Named for the photo wall, which came first; renaming it would sign visitors out.
const AUTH_KEY = 'nhisa.wall-auth';

export const SHARED = Boolean(PROJECT && KEY);

/** A public read of `table` with the publishable key. `query` is PostgREST's, e.g. "select=id&limit=5". */
export async function read<T>(table: string, query: string): Promise<T[]> {
  const res = await fetch(`${PROJECT}/rest/v1/${table}?${query}`, { headers: { apikey: KEY } });
  if (!res.ok) throw new Error(`${table}: ${res.status}`);
  return res.json();
}

let client: Promise<SupabaseClient> | undefined;
export function supabase() {
  client ??= import('@supabase/supabase-js').then(({ createClient }) =>
    // The site's own routes live in the URL hash, so the client must not read sessions from it.
    createClient(PROJECT, KEY, { auth: { storageKey: AUTH_KEY, detectSessionInUrl: false } }),
  );
  return client;
}

export async function currentUser(sb: SupabaseClient) {
  const { data } = await sb.auth.getSession();
  return data.session?.user ?? null;
}

/** The visitor signed in here, signing them in anonymously first if they aren't. */
export async function visitor(sb: SupabaseClient, captchaToken?: string) {
  const user = await currentUser(sb);
  if (user) return user;
  const { data, error } = await sb.auth.signInAnonymously({ options: { captchaToken } });
  if (error || !data.user) throw new Error(error?.message ?? 'Anonymous sign-in failed');
  return data.user;
}

/** Whether this browser has a session already, so sending something needs no captcha. */
export function hasSession() {
  try {
    return Boolean(localStorage.getItem(AUTH_KEY));
  } catch {
    return false;
  }
}

// ---------- Captcha (Cloudflare Turnstile) ----------

type Turnstile = { render(el: HTMLElement, options: Record<string, unknown>): string; remove(id: string): void };
declare global {
  interface Window {
    turnstile?: Turnstile;
  }
}

let script: Promise<Turnstile> | undefined;
function loadTurnstile() {
  script ??= new Promise<Turnstile>((resolve, reject) => {
    const tag = document.createElement('script');
    tag.src = 'https://challenges.cloudflare.com/turnstile/v0/api.js?render=explicit';
    tag.async = true;
    tag.onload = () => (window.turnstile ? resolve(window.turnstile) : reject(new Error('Turnstile missing')));
    tag.onerror = () => {
      script = undefined;
      reject(new Error('Turnstile failed to load'));
    };
    document.head.append(tag);
  });
  return script;
}

/**
 * Run Cloudflare's check in `container`, which only shows itself when it needs
 * the visitor. `token` resolves with the one-time token (undefined when no
 * captcha is set up); `cancel` takes the check away.
 */
export function captcha(container: HTMLElement): { token: Promise<string | undefined>; cancel: () => void } {
  if (!CAPTCHA_KEY) return { token: Promise.resolve(undefined), cancel: () => {} };
  let widget: string | undefined;
  let cancelled = false;
  const token = loadTurnstile().then(
    (turnstile) =>
      new Promise<string>((resolve, reject) => {
        if (cancelled) return reject(new Error('cancelled'));
        widget = turnstile.render(container, {
          sitekey: CAPTCHA_KEY,
          appearance: 'interaction-only',
          theme: 'dark',
          callback: resolve,
          'error-callback': () => reject(new Error('captcha')),
          'expired-callback': () => reject(new Error('captcha expired')),
        });
      }),
  );
  token.catch(() => {});
  return {
    token,
    cancel: () => {
      cancelled = true;
      if (widget) window.turnstile?.remove(widget);
    },
  };
}
