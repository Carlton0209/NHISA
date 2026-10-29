import { useEffect, useState } from 'react';
import { ArrowRight } from 'lucide-react';
import { MODULES } from '../content/site';
import { href } from '../lib/router';

export type StoryLink = { label: string; path: string; section?: string };

// Where the photo window looks for each module: season, focal point (%), zoom.
const CROPS: Record<string, { season: 'autumn' | 'winter'; x: number; y: number; zoom: number }> = {
  campus: { season: 'autumn', x: 26, y: 62, zoom: 1.9 },
  'career-hub': { season: 'winter', x: 58, y: 52, zoom: 2.1 },
  'career-access': { season: 'autumn', x: 66, y: 60, zoom: 2.4 },
  alumni: { season: 'winter', x: 22, y: 58, zoom: 1.8 },
};

/** Centre the focal point after zooming, without ever showing past the photo's edge. */
function cropTransform(id: string) {
  const { x, y, zoom } = CROPS[id];
  const limit = (v: number) => Math.min(100 - 50 / zoom, Math.max(50 / zoom, v));
  return `translate(${-(limit(x) - 50) * zoom}%, ${-(limit(y) - 50) * zoom}%) scale(${zoom})`;
}

function Frame({ id, autumn, winter, className = '' }: { id: string; autumn: string; winter: string; className?: string }) {
  const crop = CROPS[id];
  const title = MODULES.find((m) => m.id === id)?.title;
  return (
    <div className={`story-frame relative overflow-hidden rounded-[2rem] bg-night-800 ${className}`}>
      {(['autumn', 'winter'] as const).map((season) => (
        <img
          key={season}
          src={season === 'autumn' ? autumn : winter}
          alt=""
          loading="lazy"
          decoding="async"
          className="absolute inset-0 h-full w-full object-cover"
          style={{ opacity: crop.season === season ? 1 : 0, transform: cropTransform(id) }}
        />
      ))}
      <span className="glass-dark absolute bottom-4 left-4 rounded-full px-4 py-2 text-sm font-medium text-white">{title}</span>
    </div>
  );
}

/**
 * Each module in turn, with a photo window beside it that pans across the
 * campus as the module scrolls into view.
 */
export default function ModuleStory({ links, autumn, winter }: { links: Record<string, StoryLink[]>; autumn: string; winter: string }) {
  const modules = MODULES.filter((m) => links[m.id]);
  const [active, setActive] = useState(modules[0].id);

  useEffect(() => {
    const observer = new IntersectionObserver(
      (entries) => entries.forEach((entry) => entry.isIntersecting && setActive((entry.target as HTMLElement).dataset.story!)),
      { rootMargin: '-45% 0px -45% 0px' },
    );
    document.querySelectorAll('[data-story]').forEach((el) => observer.observe(el));
    return () => observer.disconnect();
  }, []);

  return (
    <div className="grid gap-24 lg:grid-cols-2 lg:gap-20">
      <div className="space-y-28 lg:space-y-0">
        {modules.map((module) => (
          <section
            key={module.id}
            data-story={module.id}
            aria-labelledby={`story-${module.id}`}
            className="lg:flex lg:min-h-[82vh] lg:flex-col lg:justify-center"
          >
            <Frame id={module.id} autumn={autumn} winter={winter} className="mb-10 aspect-[16/10] lg:hidden" />
            <h2 id={`story-${module.id}`} className="t-heading text-white">{module.title}</h2>
            <p className="t-lede mt-4 max-w-md">{module.summary}</p>
            <ul className="mt-8 border-t border-white/[0.08]">
              {links[module.id].map((link) => (
                <li key={link.label} className="border-b border-white/[0.08]">
                  <a href={href(link.path, link.section)} className="row -mx-3 flex items-center justify-between gap-4 rounded-xl px-3 py-3.5 text-white/80 hover:text-white">
                    <span className="row-title">{link.label}</span>
                    <ArrowRight size={16} aria-hidden="true" className="row-arrow is-forward shrink-0" />
                  </a>
                </li>
              ))}
            </ul>
            <a href={href(module.path)} className="glass-button mt-8 self-start px-6 py-3">
              Explore {module.title}
            </a>
          </section>
        ))}
      </div>
      <div className="hidden lg:block" aria-hidden="true">
        <div className="sticky top-[14vh] h-[72vh]">
          <Frame id={active} autumn={autumn} winter={winter} className="h-full" />
        </div>
      </div>
    </div>
  );
}
