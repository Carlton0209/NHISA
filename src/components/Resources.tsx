import { ArrowRight, ArrowUpRight } from 'lucide-react';
import { resource } from '../content/resources';
import type { Resource, Section } from '../content/types';
import { href, newTab } from '../lib/router';
import { plural, t } from '../lib/i18n';
import Topic from './Topic';
import { SECTION_PHOTOS } from '../content/photos';

const host = (url: string) => new URL(url).hostname.replace(/^www\./, '');

/** One resource as an index row: name, why it matters, where it goes. */
export function ResourceRow({ id, item, showCategory = false }: { id: string; item: Resource; showCategory?: boolean }) {
  const meta = item.path ? t('NHISA guide') : item.url ? host(item.url) : undefined;
  const newTabNote = <span className="sr-only">{t('(opens in a new tab)')}</span>;
  const details = (
    <>
      <span className="row-title block text-[var(--step-lead)] font-medium leading-tight">{t(item.name)}</span>
      <span className="t-body mt-1.5 block">{t(item.intro)}</span>
      {item.note && <span className="t-meta mt-2 block">{t(item.note)}</span>}
      {meta && <span className={`t-meta mt-2.5 block ${item.path ? '!text-[var(--accent)]' : ''}`}>{meta}</span>}
    </>
  );

  if (item.links) {
    return (
      <li data-row-id={id} data-reveal>
        <div className="grid gap-5 rounded-2xl bg-[var(--surface)] p-5 sm:grid-cols-[1fr_auto] sm:items-center sm:gap-8">
          <div className="min-w-0">{details}</div>
          <div className="flex flex-wrap gap-2">
            {item.links.map((link) => (
              <a key={link.url} href={link.url} {...newTab(link.url)} className="glass-button gap-1 px-3.5 py-1.5">
                {t(link.label)}
                <ArrowUpRight size={14} aria-hidden="true" />
                {newTabNote}
              </a>
            ))}
          </div>
        </div>
      </li>
    );
  }

  const target = item.path ? href(item.path) : item.url!;
  const external = !item.path;
  const arrow = (className: string) =>
    external ? (
      <ArrowUpRight size={18} strokeWidth={1.5} aria-hidden="true" className={`row-arrow ${className}`} />
    ) : (
      <ArrowRight size={18} strokeWidth={1.5} aria-hidden="true" className={`row-arrow is-forward text-accent ${className}`} />
    );
  // In the library the category closes the row at the margin, so the arrow follows the name instead.
  // Its rows move when the filter changes (transitionRows), so they skip the scroll entrance.
  if (showCategory) {
    return (
      <li data-row-id={id}>
        <a href={target} {...newTab(target)} className="row -mx-4 grid grid-cols-[1fr_auto] items-start gap-x-6 px-4 py-5">
          <span className="min-w-0">
            <span className="row-title block text-[var(--step-lead)] font-medium leading-tight">
              {t(item.name)}
              {arrow('ml-1.5 inline-block align-[-2px]')}
            </span>
            <span className="t-body mt-1.5 block max-w-[68ch]">{t(item.intro)}</span>
            {item.note && <span className="t-meta mt-2 block">{t(item.note)}</span>}
            {meta && <span className={`t-meta mt-2.5 block ${item.path ? '!text-[var(--accent)]' : ''}`}>{meta}</span>}
          </span>
          <span className="hidden whitespace-nowrap rounded-full bg-[var(--surface)] px-3 py-1 text-[var(--step-small)] sm:inline">{t(item.category)}</span>
          {external && newTabNote}
        </a>
      </li>
    );
  }
  // Elsewhere the destination closes the row at the margin; on phones it stays under the intro.
  return (
    <li data-row-id={id} data-reveal>
      <a href={target} {...newTab(target)} className="row -mx-4 grid grid-cols-[1fr_auto] items-start gap-x-6 px-4 py-5">
        <span className="min-w-0">
          <span className="row-title block text-[var(--step-lead)] font-medium leading-tight">{t(item.name)}</span>
          <span className="t-body mt-1.5 block">{t(item.intro)}</span>
          {item.note && <span className="t-meta mt-2 block">{t(item.note)}</span>}
          {meta && <span className={`t-meta mt-2.5 block sm:hidden ${item.path ? '!text-[var(--accent)]' : ''}`}>{meta}</span>}
        </span>
        <span className="flex items-center gap-2 pt-1">
          {meta && <span className={`t-meta hidden whitespace-nowrap sm:inline ${item.path ? '!text-[var(--accent)]' : ''}`}>{meta}</span>}
          {arrow('')}
        </span>
        {external && newTabNote}
      </a>
    </li>
  );
}

export function ResourceList({ ids }: { ids: string[] }) {
  return (
    <ul className="space-y-1">
      {ids.map((id) => (
        <ResourceRow key={id} id={id} item={resource(id)} />
      ))}
    </ul>
  );
}

/** Titled sections (Campus Resources, Career Hub), each with its resource lists. */
export function SectionList({ sections, numbered = false }: { sections: Section[]; numbered?: boolean }) {
  return (
    <div className="space-y-28 sm:space-y-40">
      {sections.map((section, index) => (
        <Topic
          key={section.id}
          id={section.id}
          title={t(section.title)}
          intro={t(section.intro)}
          meta={plural(section.groups.reduce((n, g) => n + g.ids.length, 0), { one: '{n} resource', other: '{n} resources' })}
          step={numbered ? { index: index + 1, total: sections.length } : undefined}
          photo={SECTION_PHOTOS[section.id]}
        >
          <div className="space-y-14">
            {section.groups.map((group, groupIndex) => (
              <div key={group.title ?? groupIndex}>
                {group.title && <h3 className="mb-4 text-[var(--step-lead)] font-medium">{t(group.title)}</h3>}
                <ResourceList ids={group.ids} />
              </div>
            ))}
          </div>
        </Topic>
      ))}
    </div>
  );
}
