import { useEffect, useState } from 'react';
import { ArrowUp, BriefcaseBusiness, GraduationCap, Home, Info, Library, Users, type LucideIcon } from 'lucide-react';
import { MODULES } from '../content/site';
import { href } from '../lib/router';

const ICONS: Record<string, LucideIcon> = {
  campus: GraduationCap,
  'career-hub': BriefcaseBusiness,
  'career-access': Library,
  alumni: Users,
  about: Info,
};

export function Logo({ className = '' }: { className?: string }) {
  return (
    <a href={href('/')} className={`flex items-center gap-2 rounded-full focus-visible:outline-offset-4 ${className}`}>
      <LogoMark size={26} />
      <span className="text-white text-2xl font-playfair italic">NHISA</span>
    </a>
  );
}

function LogoMark({ size }: { size: number }) {
  return (
    <svg width={size} height={size} viewBox="0 0 256 256" fill="#ffffff" aria-hidden="true">
      <path d="M 256 256 L 128 256 L 0 128 L 128 128 Z M 256 128 L 128 128 L 0 0 L 128 0 Z" />
    </svg>
  );
}

function useScrolled(threshold: number) {
  const [scrolled, setScrolled] = useState(false);
  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > threshold);
    onScroll();
    window.addEventListener('scroll', onScroll, { passive: true });
    return () => window.removeEventListener('scroll', onScroll);
  }, [threshold]);
  return scrolled;
}

/** Logo and the one call to action; the sections live in the bottom bar. */
export function TopBar() {
  const scrolled = useScrolled(8);
  return (
    <header
      className={`fixed top-0 left-0 right-0 z-[100] flex items-center justify-between px-4 py-3 sm:px-6 sm:py-4 transition-colors duration-300 ${
        scrolled ? 'bg-night-950/70 backdrop-blur-md border-b border-white/[0.06]' : ''
      }`}
    >
      <Logo />
      <a href={href('/about', 'get-involved')} className="glass-button px-5 py-2.5">
        Get involved
      </a>
    </header>
  );
}

/** Always-visible section bar, after the one on Awwwards. */
export function BottomNav({ path }: { path: string }) {
  const isActive = (target: string) => path === target || path.startsWith(`${target}/`);

  return (
    <nav
      aria-label="Main"
      className="glass-dark fixed bottom-3 left-3 right-3 z-[100] rounded-[1.4rem] p-1.5 md:bottom-5 md:left-1/2 md:right-auto md:-translate-x-1/2 md:rounded-full"
    >
      <ul className="flex items-center gap-0.5 md:gap-1">
        <li className="min-w-0 flex-1 md:hidden">
          <a
            href={href('/')}
            aria-current={path === '/' ? 'page' : undefined}
            className="flex w-full flex-col items-center gap-1 rounded-2xl py-2 text-[0.68rem] font-medium text-white/65 aria-[current=page]:bg-white/[0.14] aria-[current=page]:text-white"
          >
            <Home size={18} aria-hidden="true" />
            Home
          </a>
        </li>
        <li className="hidden md:block">
          <a href={href('/')} aria-label="Home" aria-current={path === '/' ? 'page' : undefined} className="glass-button h-10 w-10">
            <LogoMark size={16} />
          </a>
        </li>
        {MODULES.map((module) => {
          const Icon = ICONS[module.id];
          const active = isActive(module.path);
          return (
            <li key={module.id} className="min-w-0 flex-1 md:flex-none">
              <a
                href={href(module.path)}
                aria-current={active ? 'page' : undefined}
                className={`flex w-full flex-col items-center gap-1 rounded-2xl py-2 text-[0.68rem] font-medium transition-colors md:w-auto md:flex-row md:rounded-full md:px-4 md:py-2.5 md:text-sm ${
                  active ? 'bg-white/[0.16] text-white shadow-[inset_0_1px_0_rgb(255_255_255/0.2)]' : 'text-white/65 hover:bg-white/[0.08] hover:text-white'
                }`}
              >
                <Icon size={18} className="md:hidden" aria-hidden="true" />
                <span className="md:hidden">{module.short}</span>
                <span className="hidden whitespace-nowrap md:inline">{module.title}</span>
              </a>
            </li>
          );
        })}
      </ul>
    </nav>
  );
}

export function BackToTop() {
  const visible = useScrolled(700);
  return (
    <button
      type="button"
      aria-label="Back to top"
      onClick={() => window.scrollTo({ top: 0, behavior: window.matchMedia('(prefers-reduced-motion: reduce)').matches ? 'auto' : 'smooth' })}
      className={`glass-button fixed bottom-[5.75rem] right-3 z-[90] h-11 w-11 md:bottom-5 md:left-5 md:right-auto ${
        visible ? 'opacity-100' : 'pointer-events-none opacity-0'
      }`}
      tabIndex={visible ? 0 : -1}
    >
      <ArrowUp size={18} aria-hidden="true" />
    </button>
  );
}
