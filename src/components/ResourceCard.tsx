import { ArrowUpRight } from 'lucide-react';
import type { Resource, ResourceGroup } from '../content/types';
import { SectionHeading } from './PageShell';

const host = (url: string) => new URL(url).hostname.replace(/^www\./, '');

export function ResourceCard({ resource }: { resource: Resource }) {
  const { name, intro, url, links, note } = resource;

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
            <a
              key={link.url}
              href={link.url}
              target="_blank"
              rel="noopener noreferrer"
              className="inline-flex items-center gap-1 rounded-full border border-white/15 px-3 py-1.5 text-sm text-white/80 transition-colors hover:border-ember hover:text-white"
            >
              {link.label}
              <ArrowUpRight size={14} aria-hidden="true" />
              <span className="sr-only">(opens in a new tab)</span>
            </a>
          ))}
        </div>
      </div>
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
          className="shrink-0 text-white/50 transition-transform group-hover:-translate-y-0.5 group-hover:translate-x-0.5 group-hover:text-ember"
        />
      </span>
      <span className="sr-only">(opens in a new tab)</span>
    </a>
  );
}

export function ResourceGroups({ groups, numbered = false }: { groups: ResourceGroup[]; numbered?: boolean }) {
  return (
    <div className="space-y-16">
      {groups.map((group, index) => (
        <section key={group.title ?? index} aria-labelledby={group.title ? `group-${index}` : undefined}>
          {group.title && (
            <SectionHeading
              id={`group-${index}`}
              number={numbered ? String(index + 1).padStart(2, '0') : undefined}
              title={group.title}
              intro={group.intro}
            />
          )}
          <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
            {group.items.map((item) => (
              <ResourceCard key={item.name} resource={item} />
            ))}
          </div>
        </section>
      ))}
    </div>
  );
}
