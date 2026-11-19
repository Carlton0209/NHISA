import { ArrowRight, ArrowUpRight } from 'lucide-react';
import { resource } from '../content/resources';
import type { Resource, Section } from '../content/types';
import { href, newTab } from '../lib/router';
import { plural, t } from '../lib/i18n';
import Topic, { PointList } from './Topic';
import { SECTION_PHOTOS } from '../content/photos';

const host = (url: string) => new URL(url).hostname.replace(/^www\./, '');

/** One resource as an index row: name, why it matters, where it goes. `order` numbers it in a list meant to be done in sequence. */
export function ResourceRow({ id, item, showCategory = false, order }: { id: string; item: Resource; showCategory?: boolean; order?: number }) {
  const meta = item.path ? t('NHISA guide') : item.url ? host(item.url) : undefined;
  const newTabNote = <span className="sr-only">{t('(opens in a new tab)')}</span>;
  // The list itself is an <ol>, so screen readers already announce the position.
  const number = order !== undefined && (
    <span aria-hidden="true" className="tnum w-6 shrink-0 text-[var(--step-lead)] font-medium leading-tight text-accent">
      {order}
    </span>
  );
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
          <div className="flex min-w-0 items-baseline gap-4">
            {number}
            <div className="min-w-0">{details}</div>
          </div>
          <div className="flex flex-wrap gap-2">
            {item.links.map((link) => {
              const target = link.path ? href(link.path) : link.url!;
              return (
                <a key={target} href={target} {...newTab(target)} className="glass-button gap-1 px-3.5 py-1.5">
                  {t(link.label)}
                  {link.path ? <ArrowRight size={14} aria-hidden="true" /> : <ArrowUpRight size={14} aria-hidden="true" />}
                  {!link.path && newTabNote}
                </a>
              );
            })}
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
        <span className="flex min-w-0 items-baseline gap-4">
          {number}
          <span className="min-w-0">
            <span className="row-title block text-[var(--step-lead)] font-medium leading-tight">{t(item.name)}</span>
            <span className="t-body mt-1.5 block">{t(item.intro)}</span>
            {item.note && <span className="t-meta mt-2 block">{t(item.note)}</span>}
            {meta && <span className={`t-meta mt-2.5 block sm:hidden ${item.path ? '!text-[var(--accent)]' : ''}`}>{meta}</span>}
          </span>
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

/** A resource set beside a section's introduction: one outlined link. */
export function AsideResource({ id }: { id: string }) {
  const item = resource(id);
  const target = item.path ? href(item.path) : item.url!;
  return (
    <a href={target} {...newTab(target)} data-row-id={id} className="row flex items-start gap-4 border border-white/15 p-5">
      <span className="min-w-0 flex-1">
        <span className="row-title block font-medium leading-tight text-white">{t(item.name)}</span>
        <span className="t-body mt-1.5 block">{t(item.intro)}</span>
        {item.url && <span className="t-meta mt-2.5 block">{host(item.url)}</span>}
      </span>
      <ArrowUpRight size={18} strokeWidth={1.5} aria-hidden="true" className="row-arrow mt-0.5 shrink-0" />
      {!item.path && <span className="sr-only">{t('(opens in a new tab)')}</span>}
    </a>
  );
}

/** Rows for a list of resource ids. `intros` swaps a row's line for this list only; `ordered` numbers the rows. */
export function ResourceList({ ids, intros, ordered = false }: { ids: string[]; intros?: Record<string, string>; ordered?: boolean }) {
  const List = ordered ? 'ol' : 'ul';
  return (
    <List className="space-y-1">
      {ids.map((id, index) => {
        const item = resource(id);
        const intro = intros?.[id];
        return <ResourceRow key={id} id={id} item={intro ? { ...item, intro } : item} order={ordered ? index + 1 : undefined} />;
      })}
    </List>
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
          aside={section.aside && <AsideResource id={section.aside} />}
          meta={plural(section.groups.reduce((n, g) => n + g.ids.length, 0), { one: '{n} resource', other: '{n} resources' })}
          step={numbered ? { index: index + 1, total: sections.length } : undefined}
          photo={SECTION_PHOTOS[section.id]}
        >
          <div className="space-y-14">
            {section.groups.map((group, groupIndex) => (
              <div key={group.title ?? groupIndex}>
                {group.title && <h3 className="mb-4 text-[var(--step-lead)] font-medium">{t(group.title)}</h3>}
                <ResourceList ids={group.ids} intros={group.intros} ordered={group.ordered} />
              </div>
            ))}
            {section.tips && <PointList items={section.tips} />}
          </div>
        </Topic>
      ))}
    </div>
  );
}
