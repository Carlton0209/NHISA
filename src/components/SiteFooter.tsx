import { Instagram, Linkedin, Mail } from 'lucide-react';
import { CONTACT, MODULES } from '../content/site';
import { href, newTab } from '../lib/router';
import { Logo } from './Brand';
import CREDITS from '../assets/found/credits.json';

const listed = (values: string[]) => [...new Set(values)].join(' and ');
const CREATORS = listed(CREDITS.map((c) => c.creator));
const LICENSES = listed(CREDITS.map((c) => c.license));

const ABOUT_LINKS = [
  { label: 'Our mission', section: 'mission' },
  { label: 'Our team', section: 'team' },
  { label: 'Get involved', section: 'get-involved' },
  { label: 'Contact us', section: 'contact' },
];

// Roof of the Newhouse building, rising in a wave from left to right.
const ROOF: [number, number][] = [[250, 96], [300, 94], [350, 84], [400, 68], [450, 58], [520, 52]];
const roofAt = (x: number) => {
  const i = ROOF.findIndex(([px]) => px >= x);
  const [x0, y0] = ROOF[Math.max(0, i - 1)];
  const [x1, y1] = ROOF[i];
  return x1 === x0 ? y1 : y0 + ((x - x0) / (x1 - x0)) * (y1 - y0);
};

/** Catmull-Rom curve through the points, as SVG cubic segments (after the first point). */
function smoothThrough(points: [number, number][]) {
  return points.slice(1).map((p2, i) => {
    const p1 = points[i];
    const p0 = points[i - 1] ?? p1;
    const p3 = points[i + 2] ?? p2;
    const c1 = [p1[0] + (p2[0] - p0[0]) / 6, p1[1] + (p2[1] - p0[1]) / 6];
    const c2 = [p2[0] - (p3[0] - p1[0]) / 6, p2[1] - (p3[1] - p1[1]) / 6];
    return `C${c1[0]} ${c1[1]} ${c2[0]} ${c2[1]} ${p2[0]} ${p2[1]}`;
  }).join(' ');
}

/** Line drawing that stands on the footer's ground line: a student, a tree and the building. */
function FooterArt() {
  const mullions = Array.from({ length: 13 }, (_, i) => 262 + i * 20);
  return (
    <svg viewBox="0 0 540 140" className="h-[72px] w-auto sm:h-[88px]" fill="none" stroke="currentColor" strokeWidth="1.5"
      strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
      {/* Student walking with a backpack and phone */}
      <circle cx="78" cy="52" r="9" />
      <path d="M77 61 L74 98" />
      <rect x="58" y="66" width="12" height="22" rx="4" />
      <path d="M76 70 L90 84 L96 80" />
      <rect x="95" y="72" width="6" height="10" rx="1.5" />
      <path d="M75 72 L66 92" />
      <path d="M74 98 L64 139 M74 98 L88 139" />
      {/* Round tree */}
      <circle cx="170" cy="92" r="19" />
      <path d="M170 111 V139 M170 122 L178 114" />
      {/* Newhouse building: wave roof, glass mullions, podium */}
      <path d={`M250 139 V${ROOF[0][1]} ${smoothThrough(ROOF)} V139`} />
      {mullions.map((x) => <path key={x} d={`M${x} ${roofAt(x) + 5} V112`} opacity="0.55" />)}
      <path d="M250 112 H520" />
      <path d="M300 124 H360 V139" opacity="0.7" />
    </svg>
  );
}

// The wordmark built from five blocks, one per chapter, letters knocked out.
const BLOCKS = [
  { letter: 'N', field: 'var(--campus)', height: '100%' },
  { letter: 'H', field: 'var(--careers)', height: '78%' },
  { letter: 'I', field: 'var(--library)', height: '90%' },
  { letter: 'S', field: 'var(--alumni)', height: '64%' },
  { letter: 'A', field: 'var(--about)', height: '84%' },
];

export default function SiteFooter() {
  const socials = [
    CONTACT.instagram && { label: 'Instagram', url: CONTACT.instagram, Icon: Instagram },
    CONTACT.linkedin && { label: 'LinkedIn', url: CONTACT.linkedin, Icon: Linkedin },
    CONTACT.email && { label: 'Email', url: `mailto:${CONTACT.email}`, Icon: Mail },
  ].filter(Boolean) as { label: string; url: string; Icon: typeof Mail }[];

  return (
    <footer className="relative z-10 pb-10 pt-24" style={{ paddingInline: 'var(--margin)' }} data-ink="dark">
      <div className="flex h-[22svh] items-end gap-1 md:h-[34svh]" aria-hidden="true">
        {BLOCKS.map((block) => (
          <div key={block.letter} className="flex flex-1 items-end justify-center overflow-hidden rounded-[1.25rem]" style={{ background: block.field, height: block.height }}>
            <span className="translate-y-[12%] select-none text-[18vw] font-bold leading-none text-[var(--bg)] md:text-[15vw]">{block.letter}</span>
          </div>
        ))}
      </div>

      <div className="mt-14 grid gap-10 text-[0.9375rem] md:grid-cols-12">
        <div className="md:col-span-4">
          <Logo />
          <p className="mt-4 max-w-xs text-white/75">Newhouse International Student Association</p>
        </div>
        <nav aria-label="Footer" className="grid grid-cols-2 gap-8 md:col-span-5">
          <div>
            <h2 className="font-medium">Explore</h2>
            <ul className="mt-3 space-y-2">
              {MODULES.filter((m) => m.id !== 'about').map((m) => (
                <li key={m.id}><a href={href(m.path)} className="text-white/75 transition-colors hover:text-white">{m.title}</a></li>
              ))}
            </ul>
          </div>
          <div>
            <h2 className="font-medium">About</h2>
            <ul className="mt-3 space-y-2">
              {ABOUT_LINKS.map((link) => (
                <li key={link.section}><a href={href('/about', link.section)} className="text-white/75 transition-colors hover:text-white">{link.label}</a></li>
              ))}
            </ul>
          </div>
        </nav>
        <div className="md:col-span-3">
          <h2 className="font-medium">Connect with NHISA</h2>
          {socials.length ? (
            <ul className="mt-3 flex gap-2">
              {socials.map(({ label, url, Icon }) => (
                <li key={label}>
                  <a href={url} {...newTab(url)} aria-label={label} className="glass-button h-11 w-11">
                    <Icon size={17} aria-hidden="true" />
                  </a>
                </li>
              ))}
            </ul>
          ) : (
            <p className="mt-3 text-white/75">Coming soon.</p>
          )}
        </div>
      </div>

      <div className="mt-12 grid items-end gap-6 text-[var(--step-small)] text-white/70 md:grid-cols-12">
        <div className="max-w-[60ch] space-y-2 md:col-span-8">
          <details className="group">
            <summary className="cursor-pointer list-none [&::-webkit-details-marker]:hidden">
              Campus photographs by {CREATORS} on Wikimedia Commons, {LICENSES}.{' '}
              <span className="font-medium text-white underline decoration-1 underline-offset-4 group-hover:decoration-2">
                <span className="group-open:hidden">Show photo credits</span>
                <span className="hidden group-open:inline">Hide photo credits</span>
              </span>
            </summary>
            <ul className="mt-3 space-y-1.5">
              {CREDITS.map((c) => (
                <li key={c.file}>
                  <a href={c.page} target="_blank" rel="noopener noreferrer" className="underline decoration-white/30 underline-offset-2 hover:text-white">{c.title}</a> by {c.creator}, {c.license}
                </li>
              ))}
            </ul>
          </details>
          <p>© {new Date().getFullYear()} Newhouse International Student Association. Links marked ↗ open official sites.</p>
        </div>
        <div className="flex justify-end text-white/45 md:col-span-4">
          <FooterArt />
        </div>
      </div>
    </footer>
  );
}
