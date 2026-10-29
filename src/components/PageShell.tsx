import { useEffect, useRef, useState, type ReactNode } from 'react';
import { ArrowLeft } from 'lucide-react';
import { href } from '../lib/router';
import Glyph, { type GlyphName } from './Glyph';

export type JumpItem = { id: string; label: string };

type PageShellProps = {
  path: string;
  title: ReactNode;
  intro?: ReactNode;
  /** Short data line under the introduction, e.g. "4 sections · 31 resources". */
  meta?: string;
  jump?: JumpItem[];
  back?: { label: string; path: string; section?: string };
  children: ReactNode;
};

/** Inner-page frame: header, optional section jump bar, content. */
export default function PageShell({ path, title, intro, meta, jump, back, children }: PageShellProps) {
  return (
    <main id="main" className="relative z-10 mx-auto w-full max-w-6xl px-5 pt-32 sm:px-8 sm:pt-44">
      {back && (
        <a
          href={href(back.path, back.section)}
          className="t-mono group mb-10 inline-flex items-center gap-2 transition-colors hover:text-white"
        >
          <ArrowLeft size={14} strokeWidth={1.5} aria-hidden="true" className="transition-transform duration-500 group-hover:-translate-x-1" />
          {back.label}
        </a>
      )}

      <header className="max-w-4xl">
        <h1 tabIndex={-1} data-page-title className="t-title text-white outline-none">
          {title}
        </h1>
        {intro && <div className="t-lede mt-7 max-w-[42rem]">{intro}</div>}
        {meta && <p className="t-mono mt-8">{meta}</p>}
      </header>

      {jump && <JumpNav path={path} items={jump} />}

      <div className="mt-16 sm:mt-24">{children}</div>
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
    <nav ref={barRef} aria-label="On this page" className={`${stuck ? 'jump-bar' : ''} sticky top-[4.25rem] z-30 -mx-5 mt-12 px-5 py-3 sm:top-[4.75rem] sm:mx-0 sm:px-0`}>
      <ul className="no-scrollbar flex gap-2 overflow-x-auto">
        {items.map((item) => (
          <li key={item.id} className="shrink-0">
            <button
              type="button"
              onClick={() => jumpTo(item.id)}
              aria-current={active === item.id ? 'true' : undefined}
              className={`glass-button px-4 py-2 font-mono text-xs uppercase tracking-[0.06em] ${active === item.id ? '' : 'text-white/70 hover:text-white'}`}
            >
              {item.label}
            </button>
          </li>
        ))}
      </ul>
    </nav>
  );
}

export function SectionHeading({ id, title, intro, glyph }: { id?: string; title: string; intro?: string; glyph?: GlyphName }) {
  return (
    <div className="mb-10 max-w-2xl">
      {glyph && <Glyph name={glyph} className="mb-7 text-white/55" />}
      <h2 id={id} className="t-heading text-white">
        {title}
      </h2>
      {intro && <p className="t-body mt-4">{intro}</p>}
    </div>
  );
}
