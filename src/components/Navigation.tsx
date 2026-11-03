import { useEffect, useLayoutEffect, useRef, useState } from 'react';
import { ArrowUp, Menu, X } from 'lucide-react';
import { MODULES } from '../content/site';
import { href } from '../lib/router';
import { t, useLanguage } from '../lib/i18n';
import { lightUnder } from '../lib/reveal';
import { Logo } from './Brand';
import LanguagePicker from './LanguagePicker';

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

/**
 * Logo at left; the sections in a glass pill at top right, then the language
 * button. On phones, and wherever a language's section names don't fit the
 * pill, they move into a glass menu.
 */
export function TopBar({ path }: { path: string }) {
  const isActive = (target: string) => path === target || path.startsWith(`${target}/`);
  const language = useLanguage();
  const [menuOpen, setMenuOpen] = useState(false);
  const headerRef = useRef<HTMLElement>(null);
  const logoRef = useRef<HTMLDivElement>(null);
  const navRef = useRef<HTMLElement>(null);
  const toolsRef = useRef<HTMLDivElement>(null);
  const listRef = useRef<HTMLUListElement>(null);
  const [thumb, setThumb] = useState<{ x: number; w: number } | null>(null);
  const [fits, setFits] = useState(true);

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

  // A glass thumb slides under the current section. The pill, kept laid out
  // even while hidden, is measured against the room beside the logo.
  useLayoutEffect(() => {
    const measure = () => {
      const el = listRef.current?.querySelector<HTMLElement>('a[aria-current="page"]');
      setThumb(el ? { x: el.offsetLeft, w: el.offsetWidth } : null);
      const header = headerRef.current;
      const nav = navRef.current;
      if (!header || !nav || !nav.offsetWidth) return;
      const style = getComputedStyle(header);
      const room = header.clientWidth - parseFloat(style.paddingLeft) - parseFloat(style.paddingRight) - logoRef.current!.offsetWidth - toolsRef.current!.offsetWidth - 48;
      setFits(nav.offsetWidth <= room);
    };
    measure();
    window.addEventListener('resize', measure);
    document.fonts?.ready.then(measure);
    return () => window.removeEventListener('resize', measure);
  }, [path, language]);

  return (
    <header
      ref={headerRef}
      className={`vt-topbar fixed top-0 left-0 right-0 z-[100] flex items-center justify-between py-3 transition-[color,transform] duration-300 ease-out sm:py-4 ${
        light ? 'on-light text-[#111a3d]' : 'text-white'
      } ${hidden && !menuOpen ? '-translate-y-full' : ''}`}
      style={{ paddingInline: 'var(--margin)' }}
    >
      <div ref={logoRef}>
        <Logo />
      </div>

      <nav
        ref={navRef}
        aria-label={t('Main')}
        aria-hidden={fits ? undefined : true}
        className={`glass hidden rounded-full p-1.5 lg:block ${light ? 'border-[#111a3d]/20 bg-[#111a3d]/[0.06]' : ''} ${
          fits ? 'ml-auto mr-2' : 'pointer-events-none invisible absolute'
        }`}
      >
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
                {t(module.title)}
              </a>
            </li>
          ))}
        </ul>
      </nav>

      <div ref={toolsRef} className="flex items-center gap-2">
        <LanguagePicker />
        <button
          type="button"
          onClick={() => setMenuOpen((open) => !open)}
          aria-label={menuOpen ? t('Close menu') : t('Open menu')}
          aria-expanded={menuOpen}
          aria-controls="mobile-menu"
          className={`glass-button h-10 w-10 ${fits ? 'lg:hidden' : ''}`}
        >
          {menuOpen ? <X size={19} aria-hidden="true" /> : <Menu size={19} aria-hidden="true" />}
        </button>
      </div>

      {menuOpen && (
        <nav id="mobile-menu" aria-label={t('Main')} className={`glass-dark absolute right-4 top-full w-64 rounded-2xl bg-night-900/95 p-2 ${fits ? 'lg:hidden' : ''}`}>
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
                  {t(module.title)}
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
      aria-label={t('Back to top')}
      onClick={() => window.scrollTo({ top: 0, behavior: window.matchMedia('(prefers-reduced-motion: reduce)').matches ? 'auto' : 'smooth' })}
      className={`glass-button fixed bottom-5 right-5 z-[90] h-11 w-11 ${visible ? 'opacity-100' : 'pointer-events-none translate-y-2 opacity-0'}`}
      tabIndex={visible ? 0 : -1}
    >
      <ArrowUp size={18} aria-hidden="true" />
    </button>
  );
}
