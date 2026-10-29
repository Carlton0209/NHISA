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
      <span className="row-title block text-[1.125rem] font-medium text-white">{item.name}</span>
      <span className="t-body mt-1.5 block max-w-[62ch]">{item.intro}</span>
      {item.note && <span className="t-meta mt-2 block">{item.note}</span>}
      {meta && <span className={`t-mono mt-3 block ${item.path ? 'text-accent' : ''}`}>{meta}</span>}
    </>
  );

  if (item.links) {
    return (
      <li data-row-id={id} className="border-b border-white/[0.1]">
        <div className="grid gap-5 py-7 sm:grid-cols-[1fr_auto] sm:items-center sm:gap-8">
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
    <li data-row-id={id} className="border-b border-white/[0.1]">
      <a href={target} {...newTab(target)} className="row -mx-4 grid grid-cols-[1fr_auto] items-start gap-x-6 px-4 py-7">
        <span className="min-w-0">{details}</span>
        <span className="flex items-center gap-4 pt-1">
          {showCategory && (
            <span className="t-mono hidden whitespace-nowrap border border-white/[0.14] px-2.5 py-1 sm:inline">{item.category}</span>
          )}
          {external ? (
            <ArrowUpRight size={18} strokeWidth={1.5} aria-hidden="true" className="row-arrow" />
          ) : (
            <ArrowRight size={18} strokeWidth={1.5} aria-hidden="true" className="row-arrow is-forward text-accent" />
          )}
        </span>
        {external && <span className="sr-only">(opens in a new tab)</span>}
      </a>
    </li>
  );
}

export function ResourceList({ ids }: { ids: string[] }) {
  return (
    <ul className="border-t border-white/[0.1]">
      {ids.map((id) => (
        <ResourceRow key={id} id={id} item={resource(id)} />
      ))}
    </ul>
  );
}

const plural = (n: number, word: string) => `${n} ${word}${n === 1 ? '' : 's'}`;

/** Titled sections (Campus Resources, Career Hub), each with its resource lists. */
export function SectionList({ sections, numbered = false }: { sections: Section[]; numbered?: boolean }) {
  return (
    <div className="space-y-28 sm:space-y-40">
      {sections.map((section, index) => (
        <Topic
          key={section.id}
          id={section.id}
          title={section.title}
          intro={section.intro}
          meta={plural(section.groups.reduce((n, g) => n + g.ids.length, 0), 'resource')}
          step={numbered ? { index: index + 1, total: sections.length } : undefined}
        >
          <div className="space-y-14">
            {section.groups.map((group, groupIndex) => (
              <div key={group.title ?? groupIndex}>
                {group.title && <h3 className="t-mono mb-3">{group.title}</h3>}
                <ResourceList ids={group.ids} />
              </div>
            ))}
          </div>
        </Topic>
      ))}
    </div>
  );
}
