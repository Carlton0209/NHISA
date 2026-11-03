import { href } from '../lib/router';
import { t } from '../lib/i18n';

// The Block S, traced from Syracuse University's artwork (986 x 1358), as a CSS clip-path
// for cutting a photograph to its shape.
export const BLOCK_S_CLIP = 'polygon(18.97% 0.00%, 0.00% 13.70%, 0.00% 46.69%, 18.15% 60.01%, 65.92% 60.01%, 65.92% 79.23%, 34.38% 79.23%, 34.38% 68.26%, 0.00% 68.26%, 0.00% 86.30%, 18.97% 100.00%, 80.32% 100.00%, 100.00% 86.30%, 100.00% 53.24%, 81.74% 39.91%, 34.38% 39.91%, 34.38% 20.77%, 65.92% 20.77%, 65.92% 31.66%, 100.00% 31.66%, 100.00% 13.70%, 80.32% 0.00%)';

// The Ring by Ring lockup, copied from brand/logo/nhisa-horizontal-reversed.svg
// (made by brand/source/build_logo.py). Regenerate it there rather than editing these by hand.
const VIEWBOX = { x: 24, y: 65, w: 523, h: 128 };
const RINGS_BEFORE =
  'M72.86 191 V139.83 A25.98 25.98 0 0 1 124.81 139.83 V191 H111.23 V139.83 A12.4 12.4 0 0 0 86.43 139.83 V191 Z M48.55 191 V139.83 A50.28 50.28 0 0 1 149.11 139.83 V191 H135.54 V139.83 A36.7 36.7 0 0 0 62.13 139.83 V191 Z';
const RING_OURS =
  'M24.25 191 V139.83 A74.59 74.59 0 0 1 163.43 102.54 A6.79 6.79 0 0 1 151.67 109.33 A61.01 61.01 0 0 0 37.82 139.83 V191 Z';
const WORDMARK: { x: number; d: string; evenodd?: boolean }[] = [
  { x: 197.1, d: 'M0 0 L17.16 0 L50.8 58.26 L50.8 0 L65.66 0 L65.66 84 L48.5 84 L14.86 25.74 L14.86 84 L0 84 Z' },
  { x: 282.36, d: 'M0 0 L14.86 0 L14.86 33.6 L49.82 33.6 L49.82 0 L64.68 0 L64.68 84 L49.82 84 L49.82 46.43 L14.86 46.43 L14.86 84 L0 84 Z' },
  { x: 366.64, d: 'M0 0 L14.86 0 L14.86 84 L0 84 Z' },
  { x: 398.3, d: 'M55.98 9.94 A29.1 24.18 0 1 0 31.3 46.94 A16.43 12.83 0 1 1 17.36 66.56 L4.76 73.36 A31.3 25.66 0 1 0 31.3 34.1 A14.24 11.35 0 1 1 43.37 16.74 Z' },
  { x: 469.29, d: 'M30.73 0 L46.55 0 L77.28 84 L61.46 84 L55.31 67.2 L21.97 67.2 L15.82 84 L0 84 Z M38.64 21.63 L50.62 54.37 L26.66 54.37 Z', evenodd: true },
];

/**
 * NHISA lockup: the archway every class adds a ring to, beside the wordmark. It takes the ink of
 * whatever it sits on; the open ring, the class here now, takes the accent on dark grounds.
 */
export function Logo({ height = 28, className = '' }: { height?: number; className?: string }) {
  return (
    <a href={href('/')} aria-label={t('NHISA home')} className={`flex items-center focus-visible:outline-offset-4 ${className}`}>
      <svg
        viewBox={`${VIEWBOX.x} ${VIEWBOX.y} ${VIEWBOX.w} ${VIEWBOX.h}`}
        height={height}
        width={(height * VIEWBOX.w) / VIEWBOX.h}
        className="fill-current"
        aria-hidden="true"
      >
        <path d={RINGS_BEFORE} />
        <path d={RING_OURS} className="logo-ours" />
        {WORDMARK.map((letter) => (
          <path key={letter.x} transform={`translate(${letter.x} 107)`} d={letter.d} fillRule={letter.evenodd ? 'evenodd' : undefined} />
        ))}
      </svg>
    </a>
  );
}
