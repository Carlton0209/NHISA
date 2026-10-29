import { useEffect, useRef, useState } from 'react';
import { ArrowRight, ChevronLeft, ChevronRight } from 'lucide-react';
import { ALUMNI_SECTIONS } from '../content/alumni';
import { CAMPUS_SECTIONS } from '../content/campus';
import { CAREER_STEPS } from '../content/careerHub';
import { RESOURCES } from '../content/resources';
import { MODULES } from '../content/site';
import type { Resource } from '../content/types';
import { href } from '../lib/router';

const byCategory = Object.values(RESOURCES as Record<string, Resource>).reduce<Record<string, number>>((counts, r) => {
  counts[r.category] = (counts[r.category] ?? 0) + 1;
  return counts;
}, {});

// What each card previews: the module's real sections, not placeholder shapes.
const PREVIEW: Record<string, { label: string; detail?: string }[]> = {
  campus: CAMPUS_SECTIONS.map((s) => ({ label: s.title })),
  'career-hub': CAREER_STEPS.map((s, i) => ({ label: s.title, detail: `Step ${i + 1}` })),
  'career-access': ['Job & internship search', 'International students', 'Guides & toolkits', 'AI & practice tools'].map((c) => ({
    label: c,
    detail: String(byCategory[c] ?? 0),
  })),
  alumni: ALUMNI_SECTIONS.map((s) => ({ label: s.label })),
  about: ['Our mission', 'Our team', 'Get involved', 'Contact us'].map((label) => ({ label })),
};

/** Flip-through module cards, after Quizlet's feature carousel. Drag, scroll or use the arrows. */
export default function ModuleCarousel() {
  const trackRef = useRef<HTMLUListElement>(null);
  const [edges, setEdges] = useState({ start: true, end: false });

  useEffect(() => {
    const track = trackRef.current;
    if (!track) return;
    const update = () =>
      setEdges({ start: track.scrollLeft < 8, end: track.scrollLeft + track.clientWidth > track.scrollWidth - 8 });

    // Mouse drag scrolls the track; a drag never counts as a click on a card.
    let drag: { x: number; left: number; moved: boolean } | null = null;
    const onDown = (event: PointerEvent) => {
      if (event.pointerType !== 'mouse' || event.button !== 0) return;
      drag = { x: event.clientX, left: track.scrollLeft, moved: false };
    };
    const onMove = (event: PointerEvent) => {
      if (!drag) return;
      const dx = event.clientX - drag.x;
      if (!drag.moved && Math.abs(dx) > 5) {
        drag.moved = true;
        track.classList.add('is-dragging');
      }
      if (drag.moved) track.scrollLeft = drag.left - dx;
    };
    const onUp = () => {
      if (drag?.moved) {
        const suppress = (e: Event) => {
          e.preventDefault();
          e.stopPropagation();
        };
        track.addEventListener('click', suppress, { capture: true, once: true });
        setTimeout(() => track.removeEventListener('click', suppress, { capture: true }), 0);
      }
      drag = null;
      track.classList.remove('is-dragging');
    };

    update();
    track.addEventListener('scroll', update, { passive: true });
    track.addEventListener('pointerdown', onDown);
    window.addEventListener('pointermove', onMove);
    window.addEventListener('pointerup', onUp);
    window.addEventListener('resize', update);
    return () => {
      track.removeEventListener('scroll', update);
      track.removeEventListener('pointerdown', onDown);
      window.removeEventListener('pointermove', onMove);
      window.removeEventListener('pointerup', onUp);
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
      <ul
        ref={trackRef}
        className="carousel-track no-scrollbar -mx-5 flex cursor-grab snap-x snap-mandatory gap-4 overflow-x-auto scroll-px-5 px-5 py-6 sm:-mx-8 sm:scroll-px-8 sm:px-8"
      >
        {MODULES.map((module) => (
          <li key={module.id} className="shrink-0 snap-start">
            <a
              href={href(module.path)}
              draggable={false}
              className={`tone-${module.tone} tone-card tilt group relative flex aspect-[4/5] w-[78vw] max-w-[20rem] select-none flex-col rounded-[1.75rem] p-6 sm:w-[20rem]`}
            >
              <span data-vt-title className="text-[1.625rem] font-semibold leading-tight tracking-[-0.025em]">
                {module.title}
              </span>
              <span className="mt-3 text-[0.9375rem] leading-relaxed opacity-75">{module.summary}</span>
              <ul className="mt-auto divide-y divide-black/10 rounded-2xl bg-white/55 px-4 py-1.5 text-sm">
                {PREVIEW[module.id].slice(0, 4).map((item) => (
                  <li key={item.label} className="flex items-baseline justify-between gap-3 py-1.5">
                    <span className="truncate font-medium">{item.label}</span>
                    {item.detail && <span className="tnum shrink-0 text-xs opacity-60">{item.detail}</span>}
                  </li>
                ))}
              </ul>
              <span className="mt-4 flex items-center gap-2 text-sm font-semibold">
                Open
                <ArrowRight size={16} aria-hidden="true" className="transition-transform duration-500 group-hover:translate-x-1" />
              </span>
            </a>
          </li>
        ))}
      </ul>
      <div className="mt-2 flex justify-end gap-2">
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
