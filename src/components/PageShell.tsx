import { useEffect, useRef, useState, type ReactNode } from 'react';
import { ArrowLeft } from 'lucide-react';
import { href } from '../lib/router';

export type JumpItem = { id: string; label: string };

type PageShellProps = {
  path: string;
  eyebrow: string;
  title: ReactNode;
  intro?: ReactNode;
  jump?: JumpItem[];
  back?: { label: string; path: string; section?: string };
  children: ReactNode;
};

/** Inner-page frame: header, optional section jump bar, content. */
export default function PageShell({ path, eyebrow, title, intro, jump, back, children }: PageShellProps) {
  return (
    <main id="main" className="relative z-10 mx-auto w-full max-w-6xl px-5 pt-28 sm:px-8 sm:pt-36">
      {back && (
        <a
          href={href(back.path, back.section)}
          className="mb-8 inline-flex items-center gap-2 text-sm text-white/60 transition-colors hover:text-white"
        >
          <ArrowLeft size={16} aria-hidden="true" />
          {back.label}
        </a>
      )}

      <header className="max-w-3xl">
        <p className="text-xs font-semibold uppercase tracking-[0.2em] text-accent">{eyebrow}</p>
        <h1
          tabIndex={-1}
          data-page-title
          className="mt-4 text-4xl font-bold leading-[1.08] tracking-[-0.03em] text-white outline-none sm:text-6xl"
        >
          {title}
        </h1>
        {intro && <div className="mt-6 text-base leading-relaxed text-white/70 sm:text-lg">{intro}</div>}
      </header>

      {jump && <JumpNav path={path} items={jump} />}

      <div className="mt-14 sm:mt-16">{children}</div>
    </main>
  );
}

/** Pills that jump to sections on a long page, highlighting the one in view. */
function JumpNav({ path, items }: { path: string; items: JumpItem[] }) {
  const [active, setActive] = useState(items[0]?.id);
  const [stuck, setStuck] = useState(false);
  const barRef = useRef<HTMLElement>(null);

  useEffect(() => {
    // The dark band only appears once the bar is pinned under the top bar.
    const onScroll = () => {
      const bar = barRef.current;
      if (bar) setStuck(bar.getBoundingClientRect().top <= parseFloat(getComputedStyle(bar).top) + 1);
    };
    onScroll();
    window.addEventListener('scroll', onScroll, { passive: true });
    return () => window.removeEventListener('scroll', onScroll);
  }, []);

  useEffect(() => {
    const observer = new IntersectionObserver(
      (entries) => {
        const visible = entries.filter((e) => e.isIntersecting).sort((a, b) => a.boundingClientRect.top - b.boundingClientRect.top);
        if (visible[0]) setActive(visible[0].target.id);
      },
      { rootMargin: '-30% 0px -60% 0px' },
    );
    items.forEach((item) => {
      const el = document.getElementById(item.id);
      if (el) observer.observe(el);
    });
    return () => observer.disconnect();
  }, [items]);

  const jumpTo = (id: string) => {
    const reduced = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
    document.getElementById(id)?.scrollIntoView({ behavior: reduced ? 'auto' : 'smooth' });
    // Keep the address shareable without triggering a route change.
    window.history.replaceState(null, '', href(path, id));
    setActive(id);
  };

  return (
    <nav ref={barRef} aria-label="On this page" className={`${stuck ? 'jump-bar' : ''} sticky top-[4.25rem] z-30 -mx-5 mt-10 px-5 py-3 sm:top-[4.75rem] sm:mx-0 sm:px-0`}>
      <ul className="no-scrollbar flex gap-2 overflow-x-auto">
        {items.map((item) => (
          <li key={item.id} className="shrink-0">
            <button
              type="button"
              onClick={() => jumpTo(item.id)}
              aria-current={active === item.id ? 'true' : undefined}
              className={`glass-button px-4 py-2 ${active === item.id ? '' : 'text-white/75 hover:text-white'}`}
            >
              {item.label}
            </button>
          </li>
        ))}
      </ul>
    </nav>
  );
}

export function SectionHeading({ id, label, title, intro }: { id?: string; label?: string; title: string; intro?: string }) {
  return (
    <div className="mb-8 max-w-2xl">
      {label && <p className="mb-3 font-mono text-xs uppercase tracking-[0.16em] text-accent">{label}</p>}
      <h2 id={id} className="text-2xl font-semibold tracking-tight text-white sm:text-3xl">
        {title}
      </h2>
      {intro && <p className="mt-3 leading-relaxed text-white/60">{intro}</p>}
    </div>
  );
}
