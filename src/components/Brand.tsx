import { href } from '../lib/router';
import { t } from '../lib/i18n';

// The Block S, traced from Syracuse University's artwork (986 x 1358), as a CSS clip-path
// for cutting a photograph to its shape.
export const BLOCK_S_CLIP = 'polygon(18.97% 0.00%, 0.00% 13.70%, 0.00% 46.69%, 18.15% 60.01%, 65.92% 60.01%, 65.92% 79.23%, 34.38% 79.23%, 34.38% 68.26%, 0.00% 68.26%, 0.00% 86.30%, 18.97% 100.00%, 80.32% 100.00%, 100.00% 86.30%, 100.00% 53.24%, 81.74% 39.91%, 34.38% 39.91%, 34.38% 20.77%, 65.92% 20.77%, 65.92% 31.66%, 100.00% 31.66%, 100.00% 13.70%, 80.32% 0.00%)';

// The Shared Stretch symbol: two strokes make one N and run side by side through the middle.
// Drawn on a 256 grid: strokes 35 wide (36 less 3.5 %, as light on dark reads heavier), 20 apart,
// diagonals 30 degrees off vertical, round ends. Scaled into the lockup at 128 tall, centred on the
// wordmark's caps and 40 units clear of its N.
const VIEWBOX = { x: 34, y: 85, w: 513, h: 128 };
const SYMBOL = { x: 16.8, y: 70.23, k: 0.6154, stroke: 35 };
const STROKE_FIRST = 'M46.02 214 V42 L145.32 214';
const STROKE_SECOND = 'M110.68 42 L209.98 214 V42';
// The NHISA wordmark, cap height 84, copied from brand/logo/nhisa-horizontal-reversed.svg
// (made by brand/source/build_logo.py). Regenerate it there rather than editing these by hand.
const WORDMARK: { x: number; d: string; evenodd?: boolean }[] = [
  { x: 197.1, d: 'M0 0 L17.16 0 L50.8 58.26 L50.8 0 L65.66 0 L65.66 84 L48.5 84 L14.86 25.74 L14.86 84 L0 84 Z' },
  { x: 282.36, d: 'M0 0 L14.86 0 L14.86 33.6 L49.82 33.6 L49.82 0 L64.68 0 L64.68 84 L49.82 84 L49.82 46.43 L14.86 46.43 L14.86 84 L0 84 Z' },
  { x: 366.64, d: 'M0 0 L14.86 0 L14.86 84 L0 84 Z' },
  { x: 398.3, d: 'M55.98 9.94 A29.1 24.18 0 1 0 31.3 46.94 A16.43 12.83 0 1 1 17.36 66.56 L4.76 73.36 A31.3 25.66 0 1 0 31.3 34.1 A14.24 11.35 0 1 1 43.37 16.74 Z' },
  { x: 469.29, d: 'M30.73 0 L46.55 0 L77.28 84 L61.46 84 L55.31 67.2 L21.97 67.2 L15.82 84 L0 84 Z M38.64 21.63 L50.62 54.37 L26.66 54.37 Z', evenodd: true },
];

/**
 * NHISA lockup: the Shared Stretch N beside the wordmark. It takes the ink of whatever it sits on;
 * on dark grounds the second stroke takes the accent, so the two paths read side by side.
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
        <g
          transform={`translate(${SYMBOL.x} ${SYMBOL.y}) scale(${SYMBOL.k})`}
          fill="none"
          strokeWidth={SYMBOL.stroke}
          strokeLinecap="round"
          strokeLinejoin="round"
        >
          <path d={STROKE_FIRST} stroke="currentColor" />
          <path d={STROKE_SECOND} className="logo-ours" />
        </g>
        {WORDMARK.map((letter) => (
          <path key={letter.x} transform={`translate(${letter.x} 107)`} d={letter.d} fillRule={letter.evenodd ? 'evenodd' : undefined} />
        ))}
      </svg>
    </a>
  );
}
