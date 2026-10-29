import { href } from '../lib/router';

/** Syracuse University orange, the Block S's official colour. */
export const SU_ORANGE = '#F76900';

// The Block S, traced from the university's artwork (986 x 1358).
const BLOCK_S =
  '187,0 0,186 0,634 179,815 650,815 650,1076 339,1076 339,927 0,927 0,1172 187,1358 792,1358 986,1172 986,723 806,542 339,542 339,282 650,282 650,430 986,430 986,186 792,0';

/** The Block S as a CSS clip-path, for cutting a photograph to its shape. */
export const BLOCK_S_CLIP = 'polygon(18.97% 0.00%, 0.00% 13.70%, 0.00% 46.69%, 18.15% 60.01%, 65.92% 60.01%, 65.92% 79.23%, 34.38% 79.23%, 34.38% 68.26%, 0.00% 68.26%, 0.00% 86.30%, 18.97% 100.00%, 80.32% 100.00%, 100.00% 86.30%, 100.00% 53.24%, 81.74% 39.91%, 34.38% 39.91%, 34.38% 20.77%, 65.92% 20.77%, 65.92% 31.66%, 100.00% 31.66%, 100.00% 13.70%, 80.32% 0.00%)';

export function BlockS({ height = 24, color = SU_ORANGE, className = '' }: { height?: number; color?: string; className?: string }) {
  return (
    <svg viewBox="0 0 986 1358" height={height} width={(height * 986) / 1358} className={className} aria-hidden="true">
      <polygon points={BLOCK_S} fill={color} />
    </svg>
  );
}

/** NHISA lockup: the Block S beside the wordmark. */
export function Logo({ className = '' }: { className?: string }) {
  return (
    <a href={href('/')} aria-label="NHISA home" className={`group flex items-center gap-2.5 focus-visible:outline-offset-4 ${className}`}>
      <BlockS height={26} className="transition-transform duration-500 group-hover:-rotate-6" />
      <span className="text-[1.25rem] font-bold tracking-[0.04em]">NHISA</span>
    </a>
  );
}
