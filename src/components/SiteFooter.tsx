import { Instagram, Linkedin, Mail } from 'lucide-react';
import { CONTACT, MODULES } from '../content/site';
import { href, newTab } from '../lib/router';
import { Logo } from './Navigation';

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
    <svg viewBox="0 0 540 140" className="h-[110px] w-auto sm:h-[140px]" fill="none" stroke="currentColor" strokeWidth="1.5"
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

export default function SiteFooter() {
  const socials = [
    CONTACT.instagram && { label: 'Instagram', url: CONTACT.instagram, Icon: Instagram },
    CONTACT.linkedin && { label: 'LinkedIn', url: CONTACT.linkedin, Icon: Linkedin },
    CONTACT.email && { label: 'Email', url: `mailto:${CONTACT.email}`, Icon: Mail },
  ].filter(Boolean) as { label: string; url: string; Icon: typeof Mail }[];

  return (
    <footer className="relative z-10 mt-24 bg-night-800/80 backdrop-blur-sm">
      <div className="mx-auto grid w-full max-w-6xl gap-10 px-5 pt-14 sm:px-8 md:grid-cols-[1.3fr_1fr_1fr_1fr]">
        <div>
          <Logo />
          <p className="mt-4 max-w-xs text-sm leading-relaxed text-white/55">
            A professional community and career resource hub for Newhouse international students and alumni.
          </p>
        </div>
        <div>
          <h2 className="text-sm font-semibold text-white">Explore</h2>
          <ul className="mt-4 space-y-2.5 text-sm">
            {MODULES.filter((m) => m.id !== 'about').map((m) => (
              <li key={m.id}>
                <a href={href(m.path)} className="text-white/60 transition-colors hover:text-white">{m.title}</a>
              </li>
            ))}
          </ul>
        </div>
        <div>
          <h2 className="text-sm font-semibold text-white">About</h2>
          <ul className="mt-4 space-y-2.5 text-sm">
            {ABOUT_LINKS.map((link) => (
              <li key={link.section}>
                <a href={href('/about', link.section)} className="text-white/60 transition-colors hover:text-white">{link.label}</a>
              </li>
            ))}
          </ul>
        </div>
        <div>
          <h2 className="text-sm font-semibold text-white">Connect with <span className="text-accent">NHISA</span></h2>
          {socials.length ? (
            <ul className="mt-4 flex gap-2">
              {socials.map(({ label, url, Icon }) => (
                <li key={label}>
                  <a href={url} {...newTab(url)} aria-label={label} className="glass-button h-10 w-10">
                    <Icon size={17} aria-hidden="true" />
                  </a>
                </li>
              ))}
            </ul>
          ) : (
            <p className="mt-4 text-sm text-white/50">Our social channels are coming soon.</p>
          )}
        </div>
      </div>

      <div className="relative mx-auto mt-6 flex w-full max-w-6xl justify-end px-5 text-accent sm:px-8">
        <FooterArt />
      </div>
      <div className="h-px bg-accent/60" aria-hidden="true" />
      <div className="mx-auto flex w-full max-w-6xl flex-col gap-2 px-5 pb-28 pt-5 text-xs text-white/45 sm:flex-row sm:justify-between sm:px-8 md:pb-24">
        <p>© {new Date().getFullYear()} NHISA · Newhouse international students and alumni</p>
        <p>Links marked ↗ open official university and partner sites.</p>
      </div>
    </footer>
  );
}
