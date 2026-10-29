import type { ReactNode } from 'react';
import { Plus } from 'lucide-react';
import { href } from '../lib/router';

const COLS = 16;
const ROWS = 12;

type Pixel = { col: number; row: number; delay: number; tone: string };

// Deterministic scatter, so the pattern is stable across renders.
function scatter(seed: number): Pixel[] {
  let state = seed;
  const random = () => (state = (state * 16807) % 2147483647) / 2147483647;
  const pixels: Pixel[] = [];
  for (let row = 0; row < ROWS; row++) {
    for (let col = 0; col < COLS; col++) {
      if (random() > 0.3) continue;
      const roll = random();
      pixels.push({
        col,
        row,
        delay: Math.round(random() * 520),
        tone: roll < 0.12 ? '#aab3ff' : roll < 0.55 ? '#f4f6fa' : '#03060b',
      });
    }
  }
  return pixels;
}

type PixelCardProps = {
  path: string;
  title: string;
  subtitle: string;
  meta: string;
  seed: number;
  children: ReactNode;
};

/** Case-study style tile: on hover a grid of pixels flickers across the artwork. */
export default function PixelCard({ path, title, subtitle, meta, seed, children }: PixelCardProps) {
  return (
    <a href={href(path)} className="pixel-card group relative block aspect-[4/3] overflow-hidden bg-night-800">
      <div className="pixel-art absolute inset-0">{children}</div>
      <div className="pixel-grid absolute inset-0" aria-hidden="true">
        {scatter(seed).map((pixel) => (
          <span
            key={`${pixel.col}-${pixel.row}`}
            className="pixel"
            style={{
              left: `${(pixel.col / COLS) * 100}%`,
              top: `${(pixel.row / ROWS) * 100}%`,
              width: `${100 / COLS}%`,
              height: `${100 / ROWS}%`,
              background: pixel.tone,
              animationDelay: `${pixel.delay}ms`,
            }}
          />
        ))}
      </div>
      <span className="absolute right-4 top-4 flex h-7 w-7 items-center justify-center border border-white/50 text-white/80 transition-colors group-hover:border-white group-hover:text-white" aria-hidden="true">
        <Plus size={14} />
      </span>
      <span className="absolute bottom-0 left-0 w-[min(100%,20rem)] bg-white px-5 py-4 text-night-900">
        <span className="block text-2xl font-medium tracking-tight">{title}</span>
        <span className="mt-2 flex items-center justify-between gap-4 text-xs text-night-900/60">
          <span>{subtitle}</span>
          <span className="font-medium text-night-900">{meta}</span>
        </span>
      </span>
    </a>
  );
}

const screen = 'rgba(255,255,255,0.08)';
const faint = 'rgba(255,255,255,0.16)';

function SignatureLines({ x, y, scale = 1 }: { x: number; y: number; scale?: number }) {
  return (
    <g transform={`translate(${x} ${y}) scale(${scale})`}>
      <rect width="34" height="1.5" fill={faint} />
      <rect y="8" width="78" height="7" rx="1.5" fill="rgba(255,255,255,0.88)" />
      <rect y="21" width="112" height="5" rx="1.5" fill="#aab3ff" />
      <rect y="31" width="132" height="4" rx="1.5" fill="rgba(255,255,255,0.4)" />
      <rect y="40" width="104" height="4" rx="1.5" fill="rgba(255,255,255,0.4)" />
      <rect y="49" width="70" height="4" rx="1.5" fill="rgba(120,170,255,0.75)" />
    </g>
  );
}

export function LaptopArt() {
  return (
    <svg viewBox="0 0 400 300" className="h-full w-full" preserveAspectRatio="xMidYMid slice" aria-hidden="true">
      <defs>
        <radialGradient id="laptop-glow" cx="0.5" cy="0.45" r="0.6">
          <stop offset="0" stopColor="#1c2246" />
          <stop offset="1" stopColor="#0a111c" />
        </radialGradient>
      </defs>
      <rect width="400" height="300" fill="url(#laptop-glow)" />
      <g stroke="rgba(255,255,255,0.05)">
        {Array.from({ length: 9 }, (_, i) => <line key={i} x1={i * 50} y1="0" x2={i * 50} y2="300" />)}
      </g>
      {/* Kept clear of the label that covers the lower-left corner. */}
      <g transform="translate(48 -5) scale(0.86)">
      <rect x="78" y="46" width="244" height="154" rx="9" fill="#0c1522" stroke="rgba(255,255,255,0.35)" />
      <rect x="90" y="58" width="220" height="10" rx="3" fill={screen} />
      <rect x="90" y="76" width="96" height="5" rx="2" fill={faint} />
      <rect x="90" y="90" width="196" height="4" rx="2" fill={screen} />
      <rect x="90" y="99" width="210" height="4" rx="2" fill={screen} />
      <rect x="90" y="108" width="150" height="4" rx="2" fill={screen} />
      <SignatureLines x={90} y={126} />
      <path d="M58 200 H342 L362 216 Q364 222 356 222 H44 Q36 222 38 216 Z" fill="#111c2c" stroke="rgba(255,255,255,0.35)" />
      <rect x="178" y="204" width="44" height="4" rx="2" fill={faint} />
      </g>
    </svg>
  );
}

export function PhoneArt() {
  return (
    <svg viewBox="0 0 400 300" className="h-full w-full" preserveAspectRatio="xMidYMid slice" aria-hidden="true">
      <defs>
        <radialGradient id="phone-glow" cx="0.55" cy="0.4" r="0.6">
          <stop offset="0" stopColor="#251f42" />
          <stop offset="1" stopColor="#0a0f18" />
        </radialGradient>
      </defs>
      <rect width="400" height="300" fill="url(#phone-glow)" />
      <g stroke="rgba(255,255,255,0.05)">
        {Array.from({ length: 7 }, (_, i) => <line key={i} x1="0" y1={i * 50} x2="400" y2={i * 50} />)}
      </g>
      <g transform="translate(94 1) scale(0.78)">
      <rect x="138" y="26" width="124" height="248" rx="20" fill="#0c1522" stroke="rgba(255,255,255,0.35)" />
      <rect x="182" y="36" width="36" height="7" rx="3.5" fill={faint} />
      <rect x="152" y="56" width="22" height="22" rx="11" fill={faint} />
      <rect x="182" y="61" width="60" height="5" rx="2" fill={faint} />
      <rect x="182" y="70" width="40" height="4" rx="2" fill={screen} />
      <rect x="152" y="92" width="96" height="4" rx="2" fill={screen} />
      <rect x="152" y="101" width="88" height="4" rx="2" fill={screen} />
      <rect x="152" y="110" width="64" height="4" rx="2" fill={screen} />
      <SignatureLines x={152} y={128} scale={0.7} />
      <rect x="152" y="236" width="96" height="22" rx="11" fill="rgba(170,179,255,0.85)" />
      </g>
    </svg>
  );
}
