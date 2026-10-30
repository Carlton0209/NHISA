/// <reference types="vite/client" />

interface ImportMetaEnv {
  /** The Supabase project behind the shared photo wall, e.g. https://abcd.supabase.co. Unset: photos stay in each browser. */
  readonly VITE_SUPABASE_URL?: string;
  /** That project's public (anon or publishable) key. Safe to publish: access rules in supabase/schema.sql guard the data. */
  readonly VITE_SUPABASE_ANON_KEY?: string;
  /** Cloudflare Turnstile site key, when captcha protection is on in Supabase Auth. */
  readonly VITE_TURNSTILE_SITE_KEY?: string;
}
