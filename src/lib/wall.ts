import type { SupabaseClient } from '@supabase/supabase-js';
import type { WallShape } from '../content/photos';
import { PROJECT, currentUser, hasSession, read, supabase, visitor } from './supabase';

export { SHARED, captcha, hasSession } from './supabase';

/**
 * The shared half of the photo wall: visitors' photos, approved by an officer,
 * from the Supabase project set up by supabase/schema.sql (see ./supabase).
 * Officers sign in here for the review desk, which also looks after comments.
 */

const COLUMNS = 'id,path,shape,status,created_at,approved_at';

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
  return read<SharedPhoto>('wall_photos', `select=${COLUMNS}&status=eq.approved&order=approved_at.desc&limit=${limit}`).catch((error) => {
    throw new WallError('failed', error.message);
  });
}

// ---------- Visitors ----------

/** Sign this visitor in if needed, then send one photo to wait for approval. */
export async function sendPhoto(photo: Blob, shape: WallShape, captchaToken?: string): Promise<Sent> {
  const sb = await supabase();
  const user = await visitor(sb, captchaToken).catch((error) => {
    throw new WallError('failed', error.message);
  });
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
