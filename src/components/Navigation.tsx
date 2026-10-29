import { useEffect, useLayoutEffect, useRef, useState } from 'react';
import { ArrowUp, Menu, X } from 'lucide-react';
import { MODULES } from '../content/site';
import { href } from '../lib/router';
import { lightUnder } from '../lib/reveal';
import { Logo } from './Brand';

/** True once the page has scrolled past `threshold()` pixels. */
function useScrolledPast(threshold: () => number, deps: unknown[] = []) {
  const [past, setPast] = useState(false);
  useEffect(() => {
    const onScroll = () => setPast(window.scrollY > threshold());
    onScroll();
    window.addEventListener('scroll', onScroll, { passive: true });
    window.addEventListener('resize', onScroll);
    return () => {
      window.removeEventListener('scroll', onScroll);
      window.removeEventListener('resize', onScroll);
    };
  }, deps); // eslint-disable-line react-hooks/exhaustive-deps
  return past;
}

/** Logo at left; the sections in a glass pill at top right, a glass menu on phones. */
export function TopBar({ path }: { path: string }) {
  const isActive = (target: string) => path === target || path.startsWith(`${target}/`);
  const [menuOpen, setMenuOpen] = useState(false);
  const listRef = useRef<HTMLUListElement>(null);
  const [thumb, setThumb] = useState<{ x: number; w: number } | null>(null);

  // The bar has no chrome of its own: it takes the ink of the chapter under
  // it, and slides away while reading downwards so it never covers content.
  const [light, setLight] = useState(false);
  const [hidden, setHidden] = useState(false);
  useEffect(() => {
    let last = window.scrollY;
    let raf = 0;
    const update = () => {
      raf = 0;
      const y = window.scrollY;
      setLight(lightUnder(36));
      setHidden(y > 160 && y > last + 4 ? true : y < last - 4 || y <= 160 ? false : hiddenRef.current);
      last = y;
    };
    const onScroll = () => { if (!raf) raf = requestAnimationFrame(update); };
    update();
    window.addEventListener('scroll', onScroll, { passive: true });
    return () => { window.removeEventListener('scroll', onScroll); cancelAnimationFrame(raf); };
  }, [path]);
  const hiddenRef = useRef(hidden);
  hiddenRef.current = hidden;
  // Sticky bars below the header move up while it is away.
  useEffect(() => { document.documentElement.dataset.header = hidden && !menuOpen ? 'hidden' : 'shown'; }, [hidden, menuOpen]);

  useEffect(() => setMenuOpen(false), [path]);

  // A glass thumb slides under the current section.
  useLayoutEffect(() => {
    const measure = () => {
      const el = listRef.current?.querySelector<HTMLElement>('a[aria-current="page"]');
      setThumb(el ? { x: el.offsetLeft, w: el.offsetWidth } : null);
    };
    measure();
    window.addEventListener('resize', measure);
    document.fonts?.ready.then(measure);
    return () => window.removeEventListener('resize', measure);
  }, [path]);

  return (
    <header
      className={`vt-topbar fixed top-0 left-0 right-0 z-[100] flex items-center justify-between py-3 transition-[color,transform] duration-300 ease-out sm:py-4 ${
        light ? 'on-light text-[#111a3d]' : 'text-white'
      } ${hidden && !menuOpen ? '-translate-y-full' : ''}`}
      style={{ paddingInline: 'var(--margin)' }}
    >
      <Logo />

      <nav aria-label="Main" className={`glass hidden rounded-full p-1.5 lg:block ${light ? 'border-[#111a3d]/20 bg-[#111a3d]/[0.06]' : ''}`}>
        <ul ref={listRef} className="relative flex items-center gap-1">
          {thumb && (
            <li
              aria-hidden="true"
              className={`pointer-events-none absolute inset-y-0 left-0 rounded-full border transition-[transform,width] duration-500 ease-[cubic-bezier(0.16,1,0.3,1)] ${light ? 'border-[#111a3d]/25 bg-[#111a3d]/10' : 'border-white/25 bg-white/[0.16]'}`}
              style={{ width: thumb.w, transform: `translateX(${thumb.x}px)` }}
            />
          )}
          {MODULES.map((module) => (
            <li key={module.id}>
              <a
                href={href(module.path)}
                aria-current={isActive(module.path) ? 'page' : undefined}
                className={`relative z-10 block whitespace-nowrap rounded-full px-4 py-2 text-[0.9375rem] font-medium transition-opacity duration-300 ${
                  isActive(module.path) ? '' : 'opacity-70 hover:opacity-100'
                }`}
              >
                {module.title}
              </a>
            </li>
          ))}
        </ul>
      </nav>

      <button
        type="button"
        onClick={() => setMenuOpen((open) => !open)}
        aria-label={menuOpen ? 'Close menu' : 'Open menu'}
        aria-expanded={menuOpen}
        aria-controls="mobile-menu"
        className="glass-button h-10 w-10 lg:hidden"
      >
        {menuOpen ? <X size={19} aria-hidden="true" /> : <Menu size={19} aria-hidden="true" />}
      </button>

      {menuOpen && (
        <nav id="mobile-menu" aria-label="Main" className="glass-dark absolute right-4 top-full w-64 rounded-2xl bg-night-900/95 p-2 lg:hidden">
          <ul className="flex flex-col gap-1">
            {MODULES.map((module) => (
              <li key={module.id}>
                <a
                  href={href(module.path)}
                  aria-current={isActive(module.path) ? 'page' : undefined}
                  className={`block rounded-xl px-4 py-3 text-[0.9375rem] font-medium transition-colors ${
                    isActive(module.path) ? 'bg-white/[0.12] text-white' : 'text-white/75 hover:bg-white/[0.08] hover:text-white'
                  }`}
                >
                  {module.title}
                </a>
              </li>
            ))}
          </ul>
        </nav>
      )}
    </header>
  );
}

export function BackToTop() {
  const visible = useScrolledPast(() => 900);
  return (
    <button
      type="button"
      aria-label="Back to top"
      onClick={() => window.scrollTo({ top: 0, behavior: window.matchMedia('(prefers-reduced-motion: reduce)').matches ? 'auto' : 'smooth' })}
      className={`glass-button fixed bottom-5 right-5 z-[90] h-11 w-11 ${visible ? 'opacity-100' : 'pointer-events-none translate-y-2 opacity-0'}`}
      tabIndex={visible ? 0 : -1}
    >
      <ArrowUp size={18} aria-hidden="true" />
    </button>
  );
}
