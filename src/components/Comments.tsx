import { useEffect, useRef, useState, type FormEvent } from 'react';
import { Trash2 } from 'lucide-react';
import {
  MAX_BODY,
  MAX_NAME,
  SHARED,
  CommentError,
  captcha,
  deleteComment,
  hasSession,
  latestComments,
  postComment,
  type Comment,
} from '../lib/comments';
import { locale, t } from '../lib/i18n';

const KEY = 'nhisa.comments.v1';
const PAGE = 10;

/** What this browser remembers: the name last used, the comments it posted, and (without Supabase) the comments themselves. */
type Saved = { name: string; mine: string[]; local: Comment[] };

function load(): Saved {
  try {
    const saved = JSON.parse(localStorage.getItem(KEY) ?? '{}');
    return { name: saved.name ?? '', mine: saved.mine ?? [], local: saved.local ?? [] };
  } catch {
    return { name: '', mine: [], local: [] };
  }
}

function store(saved: Saved) {
  try {
    localStorage.setItem(KEY, JSON.stringify(saved));
  } catch {
    // Private windows may refuse; the comment itself is already posted.
  }
}

/** "Just now", "5 min ago", "3 hr ago", then the date. */
function when(iso: string) {
  const minutes = Math.floor((Date.now() - Date.parse(iso)) / 60000);
  if (minutes < 1) return t('Just now');
  if (minutes < 60) return t('{n} min ago', { n: minutes });
  if (minutes < 24 * 60) return t('{n} hr ago', { n: Math.floor(minutes / 60) });
  const date = new Date(iso);
  const year = date.getFullYear() !== new Date().getFullYear() ? { year: 'numeric' as const } : {};
  return date.toLocaleDateString(locale(), { month: 'short', day: 'numeric', ...year });
}

const merge = (list: Comment[], more: Comment[]) => [...list, ...more.filter((c) => !list.some((d) => d.id === c.id))];

/**
 * The comments at the bottom of the homepage: anyone can read them and post
 * one. With Supabase connected (lib/comments) they're shared with everyone;
 * without it they stay in this browser.
 */
export default function Comments() {
  const [saved, setSaved] = useState(load);
  const [comments, setComments] = useState<Comment[] | null>(SHARED ? null : saved.local);
  const [more, setMore] = useState(false);
  const [loadError, setLoadError] = useState('');
  const [name, setName] = useState(saved.name);
  const [body, setBody] = useState('');
  const [busy, setBusy] = useState(false);
  const [note, setNote] = useState('');
  const box = useRef<HTMLDivElement>(null);

  const save = (next: Partial<Saved>) =>
    setSaved((current) => {
      const merged = { ...current, ...next };
      store(merged);
      return merged;
    });

  const page = async (offset: number) => {
    try {
      const rows = await latestComments(PAGE + 1, offset);
      setComments((list) => merge(offset ? list ?? [] : [], rows.slice(0, PAGE)));
      setMore(rows.length > PAGE);
      setLoadError('');
    } catch {
      setLoadError(t('Comments couldn’t be loaded right now.'));
      setComments((list) => list ?? []);
    }
  };

  useEffect(() => {
    if (SHARED) page(0);
  }, []);

  const post = async (event: FormEvent) => {
    event.preventDefault();
    const text = body.trim();
    if (!text || busy) return;
    const author = name.trim().slice(0, MAX_NAME);
    setBusy(true);
    setNote('');
    // A visitor's first post signs them in, behind Cloudflare's check.
    const check = SHARED && !hasSession() ? captcha(box.current!) : null;
    try {
      const comment = SHARED
        ? await postComment(author, text, await check?.token)
        : { id: crypto.randomUUID(), name: author, body: text, created_at: new Date().toISOString() };
      setComments((list) => [comment, ...(list ?? [])]);
      save({ name: author, mine: [...saved.mine, comment.id], ...(SHARED ? {} : { local: [comment, ...saved.local] }) });
      setBody('');
      setNote(SHARED ? t('Posted. Everyone can see it now.') : t('Posted on this device.'));
    } catch (error) {
      setNote(
        error instanceof CommentError && error.reason === 'busy'
          ? t('That’s a lot of comments at once. Try again in a few minutes.')
          : t('Your comment couldn’t be posted. Try again.'),
      );
    } finally {
      check?.cancel();
      setBusy(false);
    }
  };

  const remove = async (comment: Comment) => {
    if (!window.confirm(t('Delete your comment?'))) return;
    try {
      if (SHARED) await deleteComment(comment.id);
      setComments((list) => list?.filter((c) => c.id !== comment.id) ?? null);
      save({ mine: saved.mine.filter((id) => id !== comment.id), local: saved.local.filter((c) => c.id !== comment.id) });
    } catch {
      setNote(t('That comment couldn’t be deleted. Try again.'));
    }
  };

  const field =
    'mt-2 block w-full rounded-xl border border-white/15 bg-[var(--surface)] px-4 py-3 text-white transition-[border-color] placeholder:text-white/40 hover:border-white/30';

  return (
    <section id="comments" aria-labelledby="comments-title" className="frame grid gap-14 py-20 md:py-28 lg:grid-cols-12 lg:gap-8" data-ink="dark">
      <div className="lg:sticky lg:top-28 lg:col-span-5 lg:self-start">
        <h2 id="comments-title" data-reveal className="t-heading">
          {t('Say hello.')}
        </h2>
        <p data-reveal="2" className="t-body mt-5 max-w-[40ch] text-white/80">
          {t('A question, a tip, a hello to the next class.')}
          {SHARED && ` ${t('Everyone who visits can read it.')}`}
        </p>

        <form onSubmit={post} className="mt-10 max-w-xl space-y-5">
          <label className="block">
            <span className="t-meta">{t('Name (optional)')}</span>
            <input
              value={name}
              onChange={(event) => setName(event.target.value)}
              maxLength={MAX_NAME}
              autoComplete="nickname"
              placeholder={t('Anonymous')}
              className={field}
            />
          </label>
          <label className="block">
            <span className="t-meta">{t('Comment')}</span>
            <textarea
              value={body}
              onChange={(event) => setBody(event.target.value)}
              maxLength={MAX_BODY}
              rows={4}
              required
              className={`${field} min-h-[8rem] resize-y`}
            />
          </label>
          <div ref={box} className="empty:hidden" />
          <div className="flex items-center justify-between gap-4">
            <p className={`t-meta tnum ${body.length > MAX_BODY - 50 ? '' : 'invisible'}`} aria-hidden="true">
              {t('{n} left', { n: MAX_BODY - body.length })}
            </p>
            <button type="submit" disabled={busy || !body.trim()} className="glass-button px-7">
              {busy ? t('Posting…') : t('Post')}
            </button>
          </div>
          <p className="t-meta" aria-live="polite">
            {note || (SHARED ? t('Be kind: officers take down comments that don’t belong.') : t('Comments stay on this device for now.'))}
          </p>
        </form>
      </div>

      <div className="lg:col-span-6 lg:col-start-7">
        <h3 className="sr-only">{t('Comments')}</h3>
        {loadError && <p className="t-meta mb-6">{loadError}</p>}
        {comments === null ? (
          <p className="t-meta">{t('Loading comments…')}</p>
        ) : comments.length ? (
          <ul className="border-t border-white/10">
            {comments.map((comment) => (
              <li key={comment.id} className="group border-b border-white/10 py-6">
                <div className="flex items-baseline justify-between gap-4">
                  <p className="min-w-0 truncate font-medium">{comment.name || t('Anonymous')}</p>
                  <div className="flex shrink-0 items-center gap-3">
                    <time dateTime={comment.created_at} title={new Date(comment.created_at).toLocaleString(locale())} className="t-meta tnum">
                      {when(comment.created_at)}
                    </time>
                    {saved.mine.includes(comment.id) && (
                      <button
                        type="button"
                        onClick={() => remove(comment)}
                        aria-label={t('Delete your comment')}
                        title={t('Delete your comment')}
                        className="grid h-8 w-8 place-items-center rounded-full text-white/55 transition-colors hover:bg-white/10 hover:text-white"
                      >
                        <Trash2 size={15} aria-hidden="true" />
                      </button>
                    )}
                  </div>
                </div>
                <p className="t-body mt-2 whitespace-pre-line text-white/85 [overflow-wrap:anywhere]">{comment.body}</p>
              </li>
            ))}
          </ul>
        ) : (
          !loadError && <p className="t-body text-white/70">{t('No comments yet. Be the first to say hello.')}</p>
        )}
        {more && (
          <button type="button" onClick={() => page(comments?.length ?? 0)} className="glass-button mt-8 px-6">
            {t('Show more')}
          </button>
        )}
      </div>
    </section>
  );
}
