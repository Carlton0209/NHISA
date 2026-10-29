import { href } from '../lib/router';

/** Syracuse University orange, the Block S's official colour. */
export const SU_ORANGE = '#F76900';

// The Block S, traced from the university's artwork (986 x 1358).
const BLOCK_S =
  '187,0 0,186 0,634 179,815 650,815 650,1076 339,1076 339,927 0,927 0,1172 187,1358 792,1358 986,1172 986,723 806,542 339,542 339,282 650,282 650,430 986,430 986,186 792,0';

export function BlockS({ height = 24, color = SU_ORANGE, className = '' }: { height?: number; color?: string; className?: string }) {
  return (
    <svg viewBox="0 0 986 1358" height={height} width={(height * 986) / 1358} className={className} aria-hidden="true">
      <polygon points={BLOCK_S} fill={color} />
    </svg>
  );
}

/** NHISA lockup: the Block S, a hairline, and the wordmark. */
export function Logo({ className = '' }: { className?: string }) {
  return (
    <a href={href('/')} aria-label="NHISA home" className={`group flex items-center gap-3 focus-visible:outline-offset-4 ${className}`}>
      <BlockS height={26} className="transition-transform duration-500 group-hover:-rotate-6" />
      <span className="h-6 w-px bg-white/25" aria-hidden="true" />
      <span className="font-display text-[1.125rem] font-bold tracking-[0.08em] text-white">NHISA</span>
    </a>
  );
}
