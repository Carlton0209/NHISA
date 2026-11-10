import { href } from '../lib/router';
import { t } from '../lib/i18n';

// The Block S, traced from Syracuse University's artwork (986 x 1358), as a CSS clip-path
// for cutting a photograph to its shape.
export const BLOCK_S_CLIP = 'polygon(18.97% 0.00%, 0.00% 13.70%, 0.00% 46.69%, 18.15% 60.01%, 65.92% 60.01%, 65.92% 79.23%, 34.38% 79.23%, 34.38% 68.26%, 0.00% 68.26%, 0.00% 86.30%, 18.97% 100.00%, 80.32% 100.00%, 100.00% 86.30%, 100.00% 53.24%, 81.74% 39.91%, 34.38% 39.91%, 34.38% 20.77%, 65.92% 20.77%, 65.92% 31.66%, 100.00% 31.66%, 100.00% 13.70%, 80.32% 0.00%)';

// The Shared Stretch lockup, copied from brand/logo/nhisa-horizontal-reversed.svg
// (made by brand/source/build_logo.py). Regenerate it there rather than editing these by hand.
const VIEWBOX = { x: 24, y: 64, w: 517, h: 128 };
const STROKE_FIRST =
  'M45.77 180.92 L45.77 75.08 A10.69 10.69 0 0 0 24.39 75.08 L24.39 180.92 A10.69 10.69 0 0 0 45.77 180.92 Z M25.82 80.42 L86.93 186.27 A10.69 10.69 0 0 0 105.44 175.58 L44.33 69.73 A10.69 10.69 0 0 0 25.82 80.42 Z';
const STROKE_SECOND =
  'M65.61 80.42 L126.72 186.27 A10.69 10.69 0 0 0 145.24 175.58 L84.13 69.73 A10.69 10.69 0 0 0 65.61 80.42 Z M146.67 180.92 L146.67 75.08 A10.69 10.69 0 0 0 125.29 75.08 L125.29 180.92 A10.69 10.69 0 0 0 146.67 180.92 Z';
const WORDMARK: { x: number; d: string; evenodd?: boolean }[] = [
  { x: 191.36, d: 'M0 0 L17.16 0 L50.8 58.26 L50.8 0 L65.66 0 L65.66 84 L48.5 84 L14.86 25.74 L14.86 84 L0 84 Z' },
  { x: 276.62, d: 'M0 0 L14.86 0 L14.86 33.6 L49.82 33.6 L49.82 0 L64.68 0 L64.68 84 L49.82 84 L49.82 46.43 L14.86 46.43 L14.86 84 L0 84 Z' },
  { x: 360.9, d: 'M0 0 L14.86 0 L14.86 84 L0 84 Z' },
  { x: 392.56, d: 'M55.98 9.94 A29.1 24.18 0 1 0 31.3 46.94 A16.43 12.83 0 1 1 17.36 66.56 L4.76 73.36 A31.3 25.66 0 1 0 31.3 34.1 A14.24 11.35 0 1 1 43.37 16.74 Z' },
  { x: 463.55, d: 'M30.73 0 L46.55 0 L77.28 84 L61.46 84 L55.31 67.2 L21.97 67.2 L15.82 84 L0 84 Z M38.64 21.63 L50.62 54.37 L26.66 54.37 Z', evenodd: true },
];

/**
 * NHISA lockup: the Shared Stretch N beside the wordmark, in black and white only: white on dark
 * grounds, black on light ones.
 */
export function Logo({ height = 28, className = '' }: { height?: number; className?: string }) {
  return (
    <a href={href('/')} aria-label={t('NHISA home')} className={`flex items-center focus-visible:outline-offset-4 ${className}`}>
      <svg
        viewBox={`${VIEWBOX.x} ${VIEWBOX.y} ${VIEWBOX.w} ${VIEWBOX.h}`}
        height={height}
        width={(height * VIEWBOX.w) / VIEWBOX.h}
        className="nhisa-logo"
        aria-hidden="true"
      >
        <path d={STROKE_FIRST} />
        <path d={STROKE_SECOND} />
        {WORDMARK.map((letter) => (
          <path key={letter.x} transform={`translate(${letter.x} 86)`} d={letter.d} fillRule={letter.evenodd ? 'evenodd' : undefined} />
        ))}
      </svg>
    </a>
  );
}
