import type { ReactNode } from 'react';
import { ArrowLeft } from 'lucide-react';
import FlowLines from './FlowLines';
import { href } from '../lib/router';

export type SubNavItem = { label: string; path: string };

type PageShellProps = {
  route: string;
  eyebrow: string;
  title: ReactNode;
  intro?: ReactNode;
  subnav?: SubNavItem[];
  back?: { label: string; path: string };
  children: ReactNode;
};

/** Inner-page frame: the same night sky as the hero, a header and a section menu. */
export default function PageShell({ route, eyebrow, title, intro, subnav, back, children }: PageShellProps) {
  return (
    <>
      <FlowLines className="flow-lines-fixed" />
      <main id="main" className="relative z-10 mx-auto w-full max-w-6xl px-5 sm:px-8 pt-28 sm:pt-36 pb-24">
        {back && (
          <a
            href={href(back.path)}
            className="mb-8 inline-flex items-center gap-2 text-sm text-white/60 transition-colors hover:text-white"
          >
            <ArrowLeft size={16} aria-hidden="true" />
            {back.label}
          </a>
        )}

        <header className="max-w-3xl">
          <p className="text-xs font-semibold uppercase tracking-[0.2em] text-ember">{eyebrow}</p>
          <h1 tabIndex={-1} data-page-title className="mt-4 font-playfair italic text-white text-[2.6rem] leading-[1.05] sm:text-6xl outline-none">
            {title}
          </h1>
          {intro && <div className="mt-6 text-base sm:text-lg leading-relaxed text-white/70">{intro}</div>}
        </header>

        {subnav && (
          <nav aria-label={`${eyebrow} sections`} className="subnav mt-10 -mx-5 px-5 sm:mx-0 sm:px-0">
            <ul className="flex gap-2 overflow-x-auto pb-2">
              {subnav.map((item) => {
                const active = route === item.path || (item.path.split('/').length > 2 && route.startsWith(`${item.path}/`));
                return (
                  <li key={item.path} className="shrink-0">
                    <a
                      href={href(item.path)}
                      aria-current={active ? 'page' : undefined}
                      className={`block rounded-full border px-4 py-2 text-sm font-medium transition-colors ${
                        active
                          ? 'border-white bg-white text-night-900'
                          : 'border-white/15 text-white/70 hover:border-white/35 hover:text-white'
                      }`}
                    >
                      {item.label}
                    </a>
                  </li>
                );
              })}
            </ul>
          </nav>
        )}

        <div className="mt-14 sm:mt-16">{children}</div>
      </main>

      <footer className="relative z-10 border-t border-white/[0.07]">
        <div className="mx-auto flex w-full max-w-6xl flex-col gap-2 px-5 py-8 text-sm text-white/50 sm:flex-row sm:items-center sm:justify-between sm:px-8">
          <p>
            <span className="font-playfair italic text-white/80">NHISA</span> · Community and career resources for Newhouse
            international students and alumni.
          </p>
          <p>Links marked ↗ open official university and partner sites.</p>
        </div>
      </footer>
    </>
  );
}

export function SectionHeading({ id, number, title, intro }: { id?: string; number?: string; title: string; intro?: string }) {
  return (
    <div className="mb-8 max-w-2xl">
      {number && <p className="mb-3 font-mono text-xs text-white/40">{number}</p>}
      <h2 id={id} className="text-2xl sm:text-3xl font-semibold tracking-tight text-white">
        {title}
      </h2>
      {intro && <p className="mt-3 leading-relaxed text-white/60">{intro}</p>}
    </div>
  );
}
