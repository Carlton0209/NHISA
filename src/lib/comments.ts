import { read, supabase, visitor } from './supabase';

export { SHARED, captcha, hasSession } from './supabase';

/**
 * The comments at the bottom of the homepage, from the table set up by
 * supabase/comments.sql. They go up for everyone as soon as they're posted;
 * officers take down any that don't belong from the review desk.
 */

const COLUMNS = 'id,name,body,created_at';

/** supabase/comments.sql enforces these. */
export const MAX_NAME = 40;
export const MAX_BODY = 500;

export type Comment = { id: string; name: string; body: string; created_at: string };

/** `busy`: the visitor posted the most comments allowed in ten minutes. `failed`: anything else. */
export class CommentError extends Error {
  constructor(
    readonly reason: 'busy' | 'failed',
    message: string = reason,
  ) {
    super(message);
  }
}

/** Newest first, `limit` of them after skipping `offset`. */
export function latestComments(limit: number, offset = 0): Promise<Comment[]> {
  return read<Comment>('comments', `select=${COLUMNS}&order=created_at.desc&limit=${limit}&offset=${offset}`).catch((error) => {
    throw new CommentError('failed', error.message);
  });
}

/** Sign this visitor in if needed, then post their comment for everyone. */
export async function postComment(name: string, body: string, captchaToken?: string): Promise<Comment> {
  const sb = await supabase();
  await visitor(sb, captchaToken).catch((error) => {
    throw new CommentError('failed', error.message);
  });
  const { data, error } = await sb.from('comments').insert({ name, body }).select(COLUMNS).single();
  // Row-level security refuses the row once a visitor has posted five in ten minutes.
  if (error) throw new CommentError(error.code === '42501' ? 'busy' : 'failed', error.message);
  return data as Comment;
}

/** Delete a comment: a visitor their own, an officer any. */
export async function deleteComment(id: string) {
  const sb = await supabase();
  const { data, error } = await sb.from('comments').delete().eq('id', id).select('id');
  if (error || !data?.length) throw new CommentError('failed', error?.message ?? 'This session can’t delete that comment');
}
