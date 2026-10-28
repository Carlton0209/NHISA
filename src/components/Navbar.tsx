import { useEffect, useState } from 'react';
import { Menu, X } from 'lucide-react';
import { href } from '../lib/router';

export const NAV_ITEMS = [
  { label: 'School Experience', path: '/school' },
  { label: 'Visa', path: '/visa' },
  { label: 'Job Knowledge', path: '/job' },
  { label: 'Photo Wall', path: '/photo-wall' },
  { label: 'Community', path: '/community' },
];

export default function Navbar({ route }: { route: string }) {
  const [menuOpen, setMenuOpen] = useState(false);
  const [scrolled, setScrolled] = useState(false);
  const isHome = route === '/';
  const isActive = (path: string) => route === path || route.startsWith(`${path}/`);

  useEffect(() => setMenuOpen(false), [route]);

  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 8);
    onScroll();
    window.addEventListener('scroll', onScroll, { passive: true });
    return () => window.removeEventListener('scroll', onScroll);
  }, []);

  return (
    <nav
      className={`fixed top-0 left-0 right-0 z-[100] flex items-center justify-between p-4 sm:p-5 transition-colors duration-300 ${
        !isHome && scrolled ? 'bg-[#04070c]/75 backdrop-blur-md border-b border-white/[0.06]' : ''
      }`}
    >
      <a href={href('/')} className="flex items-center gap-2 rounded-full focus-visible:outline-offset-4">
        <svg width="26" height="26" viewBox="0 0 256 256" fill="#ffffff" aria-hidden="true">
          <path d="M 256 256 L 128 256 L 0 128 L 128 128 Z M 256 128 L 128 128 L 0 0 L 128 0 Z" />
        </svg>
        <span className="text-white text-2xl font-playfair italic">NHISA</span>
      </a>

      <div className="hidden md:flex bg-white/[0.12] backdrop-blur-md border border-white/20 rounded-full px-2 py-2 items-center gap-1">
        {NAV_ITEMS.map((item) => (
          <a
            key={item.path}
            href={href(item.path)}
            aria-current={isActive(item.path) ? 'page' : undefined}
            className={`px-3 lg:px-4 py-1.5 rounded-full text-sm font-medium transition-colors ${
              isActive(item.path) ? 'text-white bg-white/[0.16]' : 'text-white/75 hover:bg-white/[0.12] hover:text-white'
            }`}
          >
            {item.label}
          </a>
        ))}
      </div>

      <button
        type="button"
        onClick={() => setMenuOpen((open) => !open)}
        aria-label={menuOpen ? 'Close menu' : 'Open menu'}
        aria-expanded={menuOpen}
        className="md:hidden flex items-center justify-center w-10 h-10 rounded-full bg-white/[0.14] backdrop-blur-md border border-white/25 text-white"
      >
        {menuOpen ? <X size={20} /> : <Menu size={20} />}
      </button>

      {menuOpen && (
        <div className="md:hidden absolute top-full right-4 w-60 bg-[#060b14]/90 backdrop-blur-md border border-white/15 rounded-2xl p-2 flex flex-col gap-1">
          {NAV_ITEMS.map((item) => (
            <a
              key={item.path}
              href={href(item.path)}
              aria-current={isActive(item.path) ? 'page' : undefined}
              className={`px-4 py-2.5 rounded-xl text-sm font-medium transition-colors ${
                isActive(item.path) ? 'text-white bg-white/[0.12]' : 'text-white/80 hover:bg-white/[0.1] hover:text-white'
              }`}
            >
              {item.label}
            </a>
          ))}
        </div>
      )}
    </nav>
  );
}
