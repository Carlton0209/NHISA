import { ArrowRight, ArrowUpRight } from 'lucide-react';
import { resource } from '../content/resources';
import type { Resource, Section } from '../content/types';
import { href } from '../lib/router';
import { SectionHeading } from './PageShell';

const host = (url: string) => new URL(url).hostname.replace(/^www\./, '');

export function ResourceCard({ resource: item }: { resource: Resource }) {
  const { name, intro, url, path, links, note } = item;

  const body = (
    <>
      <h3 className="text-lg font-semibold text-white">{name}</h3>
      <p className="mt-2 leading-relaxed text-white/65">{intro}</p>
      {note && <p className="mt-3 text-sm text-white/45">{note}</p>}
    </>
  );

  if (links) {
    return (
      <div className="card flex flex-col">
        {body}
        <div className="mt-auto flex flex-wrap gap-2 pt-6">
          {links.map((link) => (
            <a key={link.url} href={link.url} target="_blank" rel="noopener noreferrer" className="glass-button gap-1 px-3 py-1.5">
              {link.label}
              <ArrowUpRight size={14} aria-hidden="true" />
              <span className="sr-only">(opens in a new tab)</span>
            </a>
          ))}
        </div>
      </div>
    );
  }

  if (path) {
    return (
      <a href={href(path)} className="card card-link group flex flex-col border-accent/25 bg-accent/[0.06]">
        {body}
        <span className="mt-auto flex items-center justify-between gap-3 pt-6 text-sm text-accent">
          <span>NHISA guide</span>
          <ArrowRight size={18} aria-hidden="true" className="shrink-0 transition-transform group-hover:translate-x-1" />
        </span>
      </a>
    );
  }

  return (
    <a href={url} target="_blank" rel="noopener noreferrer" className="card card-link group flex flex-col">
      {body}
      <span className="mt-auto flex items-center justify-between gap-3 pt-6 text-sm text-white/45">
        <span className="truncate">{url && host(url)}</span>
        <ArrowUpRight
          size={18}
          aria-hidden="true"
          className="shrink-0 text-white/50 transition-transform group-hover:-translate-y-0.5 group-hover:translate-x-0.5 group-hover:text-accent"
        />
      </span>
      <span className="sr-only">(opens in a new tab)</span>
    </a>
  );
}

/** A run of titled sections (Campus Resources, Career Hub), each with its resource grids. */
export function SectionList({ sections, label }: { sections: Section[]; label: (index: number) => string }) {
  return (
    <div className="space-y-24">
      {sections.map((section, index) => (
        <section key={section.id} id={section.id} aria-labelledby={`${section.id}-title`} className="scroll-mt-36">
          <SectionHeading id={`${section.id}-title`} label={label(index)} title={section.title} intro={section.intro} />
          <div className="space-y-10">
            {section.groups.map((group, groupIndex) => (
              <div key={group.title ?? groupIndex}>
                {group.title && <h3 className="mb-4 text-sm font-semibold uppercase tracking-[0.14em] text-white/50">{group.title}</h3>}
                <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
                  {group.ids.map((id) => (
                    <ResourceCard key={id} resource={resource(id)} />
                  ))}
                </div>
              </div>
            ))}
          </div>
        </section>
      ))}
    </div>
  );
}
