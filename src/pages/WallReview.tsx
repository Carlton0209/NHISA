import { useCallback, useEffect, useRef, useState, type FormEvent } from 'react';
import { Check, LogOut, RefreshCw, Trash2 } from 'lucide-react';
import PageShell from '../components/PageShell';
import {
  SHARED,
  approve,
  captcha,
  currentOfficer,
  discard,
  reviewQueue,
  sendCode,
  signOut,
  verifyCode,
  type Review,
} from '../lib/wall';

type Officer = { email: string; moderator: boolean };
type Queue = { waiting: Review[]; published: Review[] };

const when = (iso: string | null) =>
  iso ? new Date(iso).toLocaleString('en-US', { month: 'short', day: 'numeric', hour: 'numeric', minute: '2-digit' }) : '';

/**
 * Where officers approve the photos visitors send to the homepage wall. Not in
 * the navigation; officers sign in with a code emailed to them, and only
 * emails listed in wall_moderators (supabase/schema.sql) may review.
 */
export default function WallReview({ path }: { path: string }) {
  return (
    <PageShell
      path={path}
      compact
      title="Photo wall review"
      intro="Photos visitors send to the homepage wall wait here until an officer approves them."
    >
      {SHARED ? (
        <Desk />
      ) : (
        <p className="panel t-body max-w-2xl">The shared photo wall isn’t set up yet. The README explains how to connect it to Supabase.</p>
      )}
    </PageShell>
  );
}

function Desk() {
  const [officer, setOfficer] = useState<Officer | null | undefined>(undefined);
  const [error, setError] = useState('');

  const check = useCallback(() => {
    currentOfficer().then(setOfficer, () => {
      setOfficer(null);
      setError('The review desk couldn’t be reached. Try again in a moment.');
    });
  }, []);
  useEffect(check, [check]);

  if (officer === undefined) return <p className="t-body">Checking who’s signed in…</p>;
  if (!officer) return <SignIn error={error} onSignedIn={check} />;

  return (
    <div className="space-y-16">
      <div className="flex flex-wrap items-center justify-between gap-4">
        <p className="t-body">
          Signed in as <span className="font-medium text-white">{officer.email}</span>
        </p>
        <button
          type="button"
          onClick={async () => {
            await signOut();
            setOfficer(null);
          }}
          className="glass-button px-5"
        >
          <LogOut size={16} aria-hidden="true" />
          Sign out
        </button>
      </div>
      {officer.moderator ? (
        <Photos />
      ) : (
        <p className="panel t-body max-w-2xl">
          This account isn’t on the list of officers who review photos. An admin can add it in Supabase (see the README).
        </p>
      )}
    </div>
  );
}

function SignIn({ error: outer, onSignedIn }: { error: string; onSignedIn: () => void }) {
  const [email, setEmail] = useState('');
  const [code, setCode] = useState('');
  const [sentTo, setSentTo] = useState('');
  const [busy, setBusy] = useState(false);
  const [error, setError] = useState('');
  const box = useRef<HTMLDivElement>(null);
  const check = useRef<ReturnType<typeof captcha> | null>(null);

  // A fresh captcha for each code request; tokens work once.
  const newCheck = () => {
    check.current?.cancel();
    check.current = sentTo ? null : captcha(box.current!);
  };
  useEffect(() => {
    newCheck();
    return () => check.current?.cancel();
    // Only when switching between the email and code steps.
  }, [sentTo]);

  const requestCode = async (event: FormEvent) => {
    event.preventDefault();
    setBusy(true);
    setError('');
    const address = email.trim().toLowerCase();
    try {
      await sendCode(address, await check.current?.token);
      setSentTo(address);
    } catch {
      setError('No code could be sent. Check the address: only officers added in Supabase can sign in.');
      newCheck();
    } finally {
      setBusy(false);
    }
  };

  const enterCode = async (event: FormEvent) => {
    event.preventDefault();
    setBusy(true);
    setError('');
    try {
      await verifyCode(sentTo, code.trim());
      onSignedIn();
    } catch {
      setError('That code didn’t work. Check it, or ask for a new one.');
      setBusy(false);
    }
  };

  const field = 'mt-2 block w-full rounded-xl border border-white/15 bg-[var(--surface)] px-4 py-3 text-white placeholder:text-white/40';
  const message = error || outer;

  return sentTo ? (
    <form onSubmit={enterCode} className="max-w-md space-y-5">
      <label className="block">
        <span className="t-body">Enter the code emailed to {sentTo}</span>
        <input
          value={code}
          onChange={(event) => setCode(event.target.value)}
          inputMode="numeric"
          autoComplete="one-time-code"
          required
          autoFocus
          className={`${field} tnum tracking-[0.3em]`}
        />
      </label>
      {message && <p role="alert" className="text-[#ffc2b5]">{message}</p>}
      <div className="flex flex-wrap items-center gap-4">
        <button type="submit" disabled={busy} className="glass-button px-6">
          {busy ? 'Signing in…' : 'Sign in'}
        </button>
        <button type="button" onClick={() => setSentTo('')} className="t-meta underline underline-offset-4 hover:text-white">
          Use a different email
        </button>
      </div>
    </form>
  ) : (
    <form onSubmit={requestCode} className="max-w-md space-y-5">
      <label className="block">
        <span className="t-body">Your officer email</span>
        <input type="email" value={email} onChange={(event) => setEmail(event.target.value)} autoComplete="email" required className={field} />
      </label>
      <div ref={box} className="empty:hidden" />
      {message && <p role="alert" className="text-[#ffc2b5]">{message}</p>}
      <button type="submit" disabled={busy} className="glass-button px-6">
        {busy ? 'Sending…' : 'Email me a code'}
      </button>
    </form>
  );
}

function Photos() {
  const [queue, setQueue] = useState<Queue | null>(null);
  const [error, setError] = useState('');
  const [working, setWorking] = useState<string | null>(null);

  const refresh = useCallback(async () => {
    try {
      setQueue(await reviewQueue());
      setError('');
    } catch {
      setError('The photos couldn’t be loaded. Try again.');
    }
  }, []);
  useEffect(() => {
    refresh();
  }, [refresh]);

  const act = async (photo: Review, action: 'approve' | 'discard') => {
    const question = photo.status === 'approved' ? 'Take this photo off the wall? It will be deleted.' : 'Turn this photo down? It will be deleted.';
    if (action === 'discard' && !window.confirm(question)) return;
    setWorking(photo.id);
    try {
      await (action === 'approve' ? approve(photo) : discard(photo));
      await refresh();
    } catch {
      setError(action === 'approve' ? 'That photo couldn’t be approved. Try again.' : 'That photo couldn’t be removed. Try again.');
    } finally {
      setWorking(null);
    }
  };

  if (!queue) return <p className="t-body">{error || 'Loading photos…'}</p>;

  const grid = 'grid gap-4 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4';
  const card = (photo: Review, label: string, actions: JSX.Element) => (
    <li key={photo.id} className="flex flex-col overflow-hidden rounded-[1.25rem] bg-[var(--surface)]">
      <a href={photo.url} target="_blank" rel="noopener noreferrer" className="block bg-black/30">
        <img src={photo.url} alt="A photo a visitor sent" loading="lazy" className="aspect-[4/3] w-full object-contain" />
      </a>
      <div className="flex flex-1 flex-col gap-4 p-5">
        <p className="t-meta">{label}</p>
        <div className="mt-auto flex flex-wrap gap-2">{actions}</div>
      </div>
    </li>
  );

  return (
    <div className="space-y-16">
      {error && <p role="alert" className="text-[#ffc2b5]">{error}</p>}
      <section aria-labelledby="waiting-title">
        <div className="mb-6 flex flex-wrap items-center justify-between gap-4">
          <h2 id="waiting-title" className="t-heading">
            Waiting <span className="tnum text-white/50">{queue.waiting.length}</span>
          </h2>
          <button type="button" onClick={refresh} className="glass-button px-5">
            <RefreshCw size={16} aria-hidden="true" />
            Refresh
          </button>
        </div>
        {queue.waiting.length ? (
          <ul className={grid}>
            {queue.waiting.map((photo) =>
              card(
                photo,
                `Sent ${when(photo.created_at)}`,
                <>
                  <button type="button" disabled={working === photo.id} onClick={() => act(photo, 'approve')} className="glass-button px-4">
                    <Check size={16} aria-hidden="true" />
                    Approve
                  </button>
                  <button type="button" disabled={working === photo.id} onClick={() => act(photo, 'discard')} className="glass-button px-4 text-white/80">
                    <Trash2 size={15} aria-hidden="true" />
                    Turn down
                  </button>
                </>,
              ),
            )}
          </ul>
        ) : (
          <p className="panel t-body max-w-2xl">Nothing is waiting.</p>
        )}
      </section>

      <section aria-labelledby="published-title">
        <h2 id="published-title" className="t-heading mb-3">
          On the wall <span className="tnum text-white/50">{queue.published.length}</span>
        </h2>
        <p className="t-body mb-6 max-w-[60ch]">The homepage shows the newest eight, alongside the festival photos.</p>
        {queue.published.length ? (
          <ul className={grid}>
            {queue.published.map((photo) =>
              card(
                photo,
                `Approved ${when(photo.approved_at)}`,
                <button type="button" disabled={working === photo.id} onClick={() => act(photo, 'discard')} className="glass-button px-4 text-white/80">
                  <Trash2 size={15} aria-hidden="true" />
                  Take down
                </button>,
              ),
            )}
          </ul>
        ) : (
          <p className="panel t-body max-w-2xl">No visitor photos are on the wall yet.</p>
        )}
      </section>
    </div>
  );
}
