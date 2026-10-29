import { useEffect, useRef, useState, type ReactNode } from 'react';
import { ArrowLeft } from 'lucide-react';
import { href } from '../lib/router';
import { chapterFor } from '../content/site';
import { HEADER_PHOTOS, PHOTOS } from '../content/photos';

export type JumpItem = { id: string; label: string };

type PageShellProps = {
  path: string;
  title: ReactNode;
  intro?: ReactNode;
  /** Short data line under the introduction, e.g. "4 sections · 31 resources". */
  meta?: string;
  jump?: JumpItem[];
  back?: { label: string; path: string; section?: string };
  /** A short header with no photograph, for tool pages where the content is the point. */
  compact?: boolean;
  children: ReactNode;
};

/**
 * Inner-page frame. The header is a full-width field in the module's chapter
 * colour, the same field the homepage gives it; the content follows on the
 * page ground.
 */
export default function PageShell({ path, title, intro, meta, jump, back, compact = false, children }: PageShellProps) {
  const chapter = chapterFor(path);
  const light = chapter?.light ?? false;
  const photo = !compact && chapter && HEADER_PHOTOS[chapter.id] ? PHOTOS[HEADER_PHOTOS[chapter.id]] : null;
  return (
    <main id="main" className="relative z-10">
      <header
        data-ink={light ? 'light' : 'dark'}
        className={`${chapter?.field ?? ''} ${light ? 'on-light' : ''} grid items-end gap-10 pt-28 lg:grid-cols-12 ${compact ? 'pb-10 md:pb-12' : 'min-h-[78svh] pb-12 md:pb-16'}`}
        style={{ paddingInline: 'var(--margin)' }}
      >
        <div className="flex flex-col lg:col-span-7">
          {back && (
            <nav aria-label="Breadcrumb" className="mb-10 self-start">
              <a
                href={href(back.path, back.section)}
                className="group inline-flex items-center gap-2 text-[var(--step-small)] font-medium opacity-75 transition-opacity hover:opacity-100"
              >
                <ArrowLeft size={16} aria-hidden="true" className="transition-transform duration-500 group-hover:-translate-x-1" />
                {back.label}
              </a>
            </nav>
          )}
          <h1 tabIndex={-1} data-page-title className={`${compact ? 't-heading' : 't-title'} outline-none`}>
            {title}
          </h1>
          {intro && <div className="t-lede mt-8 max-w-[38rem]">{intro}</div>}
          {meta && <p className="tnum mt-6 text-[var(--step-small)] font-medium">{meta}</p>}
        </div>
        {photo && (
          <div className="pic-in aspect-[4/3] overflow-hidden rounded-[1.25rem] lg:col-span-5 lg:aspect-auto lg:h-[62svh]">
            <img src={photo.src} alt={photo.alt} className="h-full w-full object-cover" style={{ objectPosition: photo.position }} />
          </div>
        )}
      </header>

      <div className="frame">
        {jump && <JumpNav path={path} items={jump} />}
        <div className="pb-8 pt-16 md:pt-24">{children}</div>
      </div>
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
    <nav ref={barRef} aria-label="On this page" className={`jump-sticky sticky z-30 mt-6 py-3 transition-[background-color,top] duration-300 ${stuck ? 'bg-[var(--bg)]' : ''}`}
      style={{ marginInline: 'calc(var(--margin) * -1)', paddingInline: 'var(--margin)' }}>
      <ul className="no-scrollbar flex gap-2 overflow-x-auto">
        {items.map((item) => (
          <li key={item.id} className="shrink-0">
            <button
              type="button"
              onClick={() => jumpTo(item.id)}
              aria-current={active === item.id ? 'true' : undefined}
              className={`glass-button px-4 py-2 ${active === item.id ? '' : 'opacity-75 hover:opacity-100'}`}
            >
              {item.label}
            </button>
          </li>
        ))}
      </ul>
    </nav>
  );
}

export function SectionHeading({ id, title, intro }: { id?: string; title: string; intro?: string }) {
  return (
    <div className="mb-12 max-w-3xl">
      <h2 id={id} data-reveal className="t-heading text-white">
        {title}
      </h2>
      {intro && <p data-reveal="2" className="t-body mt-5">{intro}</p>}
    </div>
  );
}
