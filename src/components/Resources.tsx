import { ArrowRight, ArrowUpRight } from 'lucide-react';
import { resource } from '../content/resources';
import type { Resource, Section } from '../content/types';
import { href, newTab } from '../lib/router';
import Topic from './Topic';

const host = (url: string) => new URL(url).hostname.replace(/^www\./, '');

/** One resource as an index row: name, why it matters, where it goes. */
export function ResourceRow({ id, item, showCategory = false }: { id: string; item: Resource; showCategory?: boolean }) {
  const meta = item.path ? 'NHISA guide' : item.url ? host(item.url) : undefined;
  const details = (
    <>
      <span className="row-title block text-[1.0625rem] font-semibold text-white">{item.name}</span>
      <span className="t-body mt-1.5 block max-w-[62ch]">{item.intro}</span>
      <span className="t-meta mt-2.5 flex flex-wrap gap-x-4 gap-y-1">
        {meta && <span className={item.path ? 'text-accent' : undefined}>{meta}</span>}
        {item.note && <span>{item.note}</span>}
      </span>
    </>
  );

  if (item.links) {
    return (
      <li data-row-id={id} className="border-b border-white/[0.08]">
        <div className="grid gap-5 py-6 sm:grid-cols-[1fr_auto] sm:items-center sm:gap-8">
          <div className="min-w-0">{details}</div>
          <div className="flex flex-wrap gap-2">
            {item.links.map((link) => (
              <a key={link.url} href={link.url} {...newTab(link.url)} className="glass-button gap-1 px-3.5 py-1.5">
                {link.label}
                <ArrowUpRight size={14} aria-hidden="true" />
                <span className="sr-only">(opens in a new tab)</span>
              </a>
            ))}
          </div>
        </div>
      </li>
    );
  }

  const target = item.path ? href(item.path) : item.url!;
  const external = !item.path;
  return (
    <li data-row-id={id} className="border-b border-white/[0.08]">
      <a href={target} {...newTab(target)} className="row -mx-4 grid grid-cols-[1fr_auto] items-start gap-x-6 rounded-2xl px-4 py-6">
        <span className="min-w-0">{details}</span>
        <span className="flex items-center gap-3 pt-1">
          {showCategory && (
            <span className="hidden whitespace-nowrap rounded-full border border-white/10 px-3 py-1 text-xs text-white/60 sm:inline">
              {item.category}
            </span>
          )}
          {external ? (
            <ArrowUpRight size={18} aria-hidden="true" className="row-arrow" />
          ) : (
            <ArrowRight size={18} aria-hidden="true" className="row-arrow is-forward text-accent" />
          )}
        </span>
        {external && <span className="sr-only">(opens in a new tab)</span>}
      </a>
    </li>
  );
}

export function ResourceList({ ids }: { ids: string[] }) {
  return (
    <ul className="border-t border-white/[0.08]">
      {ids.map((id) => (
        <ResourceRow key={id} id={id} item={resource(id)} />
      ))}
    </ul>
  );
}

/** Titled sections (Campus Resources, Career Hub), each with its resource lists. */
export function SectionList({ sections, numbered = false }: { sections: Section[]; numbered?: boolean }) {
  return (
    <div className="space-y-28 sm:space-y-36">
      {sections.map((section, index) => (
        <Topic key={section.id} id={section.id} title={section.title} intro={section.intro} step={numbered ? index + 1 : undefined}>
          <div className="space-y-12">
            {section.groups.map((group, groupIndex) => (
              <div key={group.title ?? groupIndex}>
                {group.title && <h3 className="mb-2 text-sm font-medium text-white/55">{group.title}</h3>}
                <ResourceList ids={group.ids} />
              </div>
            ))}
          </div>
        </Topic>
      ))}
    </div>
  );
}
