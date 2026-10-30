import type { SupabaseClient } from '@supabase/supabase-js';
import type { WallShape } from '../content/photos';

/**
 * The shared half of the photo wall: visitors' photos, approved by an officer,
 * from the Supabase project set up by supabase/schema.sql. Without the
 * VITE_SUPABASE_* settings (SHARED is false) the wall keeps visitors' photos in
 * their own browser instead.
 *
 * Reading the approved photos is a plain request; the Supabase client only
 * loads when someone sends a photo, checks on one, or reviews.
 */

const PROJECT = (import.meta.env.VITE_SUPABASE_URL ?? '').replace(/\/+$/, '');
const KEY = import.meta.env.VITE_SUPABASE_ANON_KEY ?? '';
const CAPTCHA_KEY = import.meta.env.VITE_TURNSTILE_SITE_KEY ?? '';
const AUTH_KEY = 'nhisa.wall-auth';
const COLUMNS = 'id,path,shape,status,created_at,approved_at';

export const SHARED = Boolean(PROJECT && KEY);
/** Visitors may keep at most this many photos waiting; supabase/schema.sql enforces it. */
export const MAX_WAITING = 3;

export type SharedPhoto = {
  id: string;
  path: string;
  shape: WallShape;
  status: 'pending' | 'approved';
  created_at: string;
  approved_at: string | null;
};
/** A photo this browser sent, and the visitor session that sent it. */
export type Sent = { id: string; path: string; user: string };
export type Review = SharedPhoto & { url: string };

/** `full`: the visitor already has the most photos waiting. `failed`: anything else. */
export class WallError extends Error {
  constructor(
    readonly reason: 'full' | 'failed',
    message: string = reason,
  ) {
    super(message);
  }
}

export const publicUrl = (path: string) => `${PROJECT}/storage/v1/object/public/wall/${path}`;

/** The newest approved photos. */
export async function approvedPhotos(limit: number): Promise<SharedPhoto[]> {
  const res = await fetch(`${PROJECT}/rest/v1/wall_photos?select=${COLUMNS}&status=eq.approved&order=approved_at.desc&limit=${limit}`, {
    headers: { apikey: KEY },
  });
  if (!res.ok) throw new WallError('failed', `Photo list: ${res.status}`);
  return res.json();
}

let client: Promise<SupabaseClient> | undefined;
function supabase() {
  client ??= import('@supabase/supabase-js').then(({ createClient }) =>
    // The site's own routes live in the URL hash, so the client must not read sessions from it.
    createClient(PROJECT, KEY, { auth: { storageKey: AUTH_KEY, detectSessionInUrl: false } }),
  );
  return client;
}

async function currentUser(sb: SupabaseClient) {
  const { data } = await sb.auth.getSession();
  return data.session?.user ?? null;
}

/** Whether this browser has a session already, so sending another photo needs no captcha. */
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

// ---------- Visitors ----------

/** Sign this visitor in if needed, then send one photo to wait for approval. */
export async function sendPhoto(photo: Blob, shape: WallShape, captchaToken?: string): Promise<Sent> {
  const sb = await supabase();
  let user = await currentUser(sb);
  if (!user) {
    const { data, error } = await sb.auth.signInAnonymously({ options: { captchaToken } });
    if (error || !data.user) throw new WallError('failed', error?.message);
    user = data.user;
  }
  const id = crypto.randomUUID();
  const path = `${user.id}/${id}.jpg`;
  const waiting = sb.storage.from('wall-waiting');
  const upload = await waiting.upload(path, photo, { contentType: 'image/jpeg' });
  if (upload.error) throw new WallError('failed', upload.error.message);
  const { error } = await sb.from('wall_photos').insert({ id, path, shape });
  if (error) {
    await waiting.remove([path]);
    // Row-level security refuses the row once three are waiting.
    throw new WallError(error.code === '42501' ? 'full' : 'failed', error.message);
  }
  return { id, path, user: user.id };
}

/** The photos `user` sent that still exist, or null when this browser isn't signed in as them. */
export async function ownPhotos(user: string): Promise<SharedPhoto[] | null> {
  if (!hasSession()) return null;
  const sb = await supabase();
  if ((await currentUser(sb))?.id !== user) return null;
  const { data, error } = await sb.from('wall_photos').select(COLUMNS).eq('submitted_by', user);
  if (error) throw new WallError('failed', error.message);
  return data as SharedPhoto[];
}

/** Take a photo off the wall, waiting or approved. */
async function remove(sb: SupabaseClient, photo: { id: string; path: string }) {
  const { error } = await sb.from('wall_photos').delete().eq('id', photo.id);
  if (error) throw new WallError('failed', error.message);
  const results = await Promise.all(['wall', 'wall-waiting'].map((bucket) => sb.storage.from(bucket).remove([photo.path])));
  const failed = results.find((r) => r.error);
  if (failed?.error) throw new WallError('failed', failed.error.message);
}

/** A visitor takes back a photo they sent from this browser. */
export async function withdraw(photo: Sent) {
  const sb = await supabase();
  if ((await currentUser(sb))?.id !== photo.user) throw new WallError('failed', 'Not signed in as the sender');
  await remove(sb, photo);
}

// ---------- Officers ----------

/** Email an officer a sign-in code. Only accounts added in the dashboard get one. */
export async function sendCode(email: string, captchaToken?: string) {
  const sb = await supabase();
  const { error } = await sb.auth.signInWithOtp({ email, options: { shouldCreateUser: false, captchaToken } });
  if (error) throw new WallError('failed', error.message);
}

export async function verifyCode(email: string, token: string) {
  const sb = await supabase();
  const { error } = await sb.auth.verifyOtp({ email, token, type: 'email' });
  if (error) throw new WallError('failed', error.message);
}

/** The officer signed in here, and whether they may review; null when nobody (or only a visitor) is. */
export async function currentOfficer(): Promise<{ email: string; moderator: boolean } | null> {
  if (!hasSession()) return null;
  const sb = await supabase();
  const user = await currentUser(sb);
  if (!user?.email || user.is_anonymous) return null;
  const { data, error } = await sb.rpc('is_wall_moderator');
  if (error) throw new WallError('failed', error.message);
  return { email: user.email, moderator: data === true };
}

export async function signOut() {
  const sb = await supabase();
  await sb.auth.signOut();
}

/** Everything an officer sees: photos waiting (oldest first, with private links) and the ones on the wall (newest first). */
export async function reviewQueue(): Promise<{ waiting: Review[]; published: Review[] }> {
  const sb = await supabase();
  const { data, error } = await sb.from('wall_photos').select(COLUMNS).order('created_at');
  if (error) throw new WallError('failed', error.message);
  const rows = data as SharedPhoto[];
  const waiting = rows.filter((r) => r.status === 'pending');
  const links = new Map<string, string>();
  if (waiting.length) {
    const signed = await sb.storage.from('wall-waiting').createSignedUrls(waiting.map((r) => r.path), 60 * 60);
    if (signed.error) throw new WallError('failed', signed.error.message);
    signed.data.forEach((s) => s.path && s.signedUrl && links.set(s.path, s.signedUrl));
  }
  return {
    waiting: waiting.map((r) => ({ ...r, url: links.get(r.path) ?? '' })),
    published: rows
      .filter((r) => r.status === 'approved')
      .sort((a, b) => (b.approved_at ?? '').localeCompare(a.approved_at ?? ''))
      .map((r) => ({ ...r, url: publicUrl(r.path) })),
  };
}

/** Put a waiting photo on the wall for everyone. */
export async function approve(photo: SharedPhoto) {
  const sb = await supabase();
  const copy = await sb.storage.from('wall-waiting').copy(photo.path, photo.path, { destinationBucket: 'wall' });
  // A retry after a half-finished approval finds the copy already there.
  if (copy.error && !/exist/i.test(copy.error.message)) throw new WallError('failed', copy.error.message);
  const { data, error } = await sb
    .from('wall_photos')
    .update({ status: 'approved', approved_at: new Date().toISOString() })
    .eq('id', photo.id)
    .select('id');
  if (error || !data?.length) {
    await sb.storage.from('wall').remove([photo.path]);
    throw new WallError('failed', error?.message ?? 'This account can’t approve photos');
  }
  await sb.storage.from('wall-waiting').remove([photo.path]);
}

/** Turn a waiting photo down, or take an approved one off the wall. Both delete it for good. */
export async function discard(photo: SharedPhoto) {
  await remove(await supabase(), photo);
}
