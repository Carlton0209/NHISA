import { useEffect, useRef, useState } from 'react';
import { ArrowRight, ChevronLeft, ChevronRight } from 'lucide-react';
import { MODULES } from '../content/site';
import { href } from '../lib/router';
import ModuleArt from './ModuleArt';

/** Flip-through module cards, after Quizlet's feature carousel. */
export default function ModuleCarousel() {
  const trackRef = useRef<HTMLUListElement>(null);
  const [edges, setEdges] = useState({ start: true, end: false });

  useEffect(() => {
    const track = trackRef.current;
    if (!track) return;
    const update = () =>
      setEdges({ start: track.scrollLeft < 8, end: track.scrollLeft + track.clientWidth > track.scrollWidth - 8 });
    update();
    track.addEventListener('scroll', update, { passive: true });
    window.addEventListener('resize', update);
    return () => {
      track.removeEventListener('scroll', update);
      window.removeEventListener('resize', update);
    };
  }, []);

  const page = (direction: 1 | -1) => {
    const track = trackRef.current;
    const card = track?.firstElementChild as HTMLElement | null;
    if (!track || !card) return;
    const reduced = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
    track.scrollBy({ left: direction * (card.offsetWidth + 16), behavior: reduced ? 'auto' : 'smooth' });
  };

  return (
    <div>
      <ul ref={trackRef} className="no-scrollbar -mx-5 flex snap-x snap-mandatory gap-4 overflow-x-auto scroll-px-5 px-5 pb-2 sm:-mx-8 sm:scroll-px-8 sm:px-8">
        {MODULES.map((module, index) => (
          <li key={module.id} className="shrink-0 snap-start">
            <a
              href={href(module.path)}
              className={`tone-${module.tone} tone-card group flex aspect-[4/5] w-[76vw] max-w-[19rem] flex-col rounded-[1.75rem] p-6 transition-transform duration-300 hover:-translate-y-1 sm:w-[19rem]`}
            >
              <span className="text-xs font-semibold uppercase tracking-[0.18em] opacity-60">{String(index + 1).padStart(2, '0')}</span>
              <span className="mt-2 text-2xl font-bold tracking-tight">{module.title}</span>
              <span className="mt-2 text-sm leading-relaxed opacity-75">{module.summary}</span>
              <span className="mt-auto block h-[42%] rounded-2xl bg-white/50 p-3">
                <ModuleArt id={module.id} />
              </span>
              <span className="mt-4 flex items-center gap-2 text-sm font-semibold">
                Open
                <ArrowRight size={16} aria-hidden="true" className="transition-transform group-hover:translate-x-1" />
              </span>
            </a>
          </li>
        ))}
      </ul>
      <div className="mt-5 flex justify-end gap-2">
        <button type="button" onClick={() => page(-1)} disabled={edges.start} aria-label="Previous modules" className="glass-button h-11 w-11">
          <ChevronLeft size={18} aria-hidden="true" />
        </button>
        <button type="button" onClick={() => page(1)} disabled={edges.end} aria-label="Next modules" className="glass-button h-11 w-11">
          <ChevronRight size={18} aria-hidden="true" />
        </button>
      </div>
    </div>
  );
}
