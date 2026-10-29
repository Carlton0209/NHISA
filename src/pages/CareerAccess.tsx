import { useState } from 'react';
import { ArrowRight, ArrowUpRight, Search } from 'lucide-react';
import PageShell from '../components/PageShell';
import { RESOURCES } from '../content/resources';
import type { Category, Resource } from '../content/types';
import { href } from '../lib/router';

const ALL = Object.values(RESOURCES as Record<string, Resource>);

const CATEGORIES: Category[] = [
  'Job & internship search',
  'Career services',
  'Guides & toolkits',
  'AI & practice tools',
  'International students',
  'Academics',
  'Research',
  'Production & tech',
  'Campus life',
  'Study away',
];

const host = (url: string) => new URL(url).hostname.replace(/^www\./, '');

function Row({ item }: { item: Resource }) {
  const target = item.path ? href(item.path) : item.url ?? item.links?.[0].url;
  const external = !item.path;
  return (
    <li>
      <a
        href={target}
        {...(external ? { target: '_blank', rel: 'noopener noreferrer' } : {})}
        className="group grid gap-x-6 gap-y-2 px-5 py-5 transition-colors hover:bg-white/[0.04] sm:grid-cols-[1fr_auto] sm:items-center"
      >
        <span>
          <span className="flex flex-wrap items-baseline gap-x-3 gap-y-1">
            <span className="text-lg font-semibold text-white">{item.name}</span>
            <span className="text-sm text-white/40">{item.path ? 'NHISA guide' : target && host(target)}</span>
          </span>
          <span className="mt-1 block leading-relaxed text-white/60">{item.intro}</span>
        </span>
        <span className="flex items-center gap-3">
          <span className="rounded-full border border-white/10 bg-white/[0.04] px-3 py-1 text-xs text-white/65">{item.category}</span>
          {external ? (
            <ArrowUpRight size={18} aria-hidden="true" className="text-white/40 transition-transform group-hover:-translate-y-0.5 group-hover:translate-x-0.5 group-hover:text-accent" />
          ) : (
            <ArrowRight size={18} aria-hidden="true" className="text-accent transition-transform group-hover:translate-x-1" />
          )}
          {external && <span className="sr-only">(opens in a new tab)</span>}
        </span>
      </a>
    </li>
  );
}

/** Every resource on the site as one filterable library, after the YC company directory. */
export default function CareerAccess({ path }: { path: string }) {
  const [query, setQuery] = useState('');
  const [category, setCategory] = useState<Category | null>(null);

  const matchesQuery = (item: Resource) => {
    const q = query.trim().toLowerCase();
    return !q || `${item.name} ${item.intro} ${item.category} ${item.note ?? ''}`.toLowerCase().includes(q);
  };
  const searched = ALL.filter(matchesQuery);
  const results = category ? searched.filter((item) => item.category === category) : searched;
  const count = (c: Category | null) => (c ? searched.filter((item) => item.category === c).length : searched.length);

  const filters = [null, ...CATEGORIES].map((c) => (
    <button
      key={c ?? 'all'}
      type="button"
      onClick={() => setCategory(c)}
      aria-pressed={category === c}
      className={`glass-button shrink-0 justify-between gap-3 px-4 py-2 lg:w-full ${category === c ? '' : 'text-white/75 hover:text-white'}`}
    >
      <span>{c ?? 'All resources'}</span>
      <span className="text-xs text-white/50">{count(c)}</span>
    </button>
  ));

  return (
    <PageShell
      path={path}
      eyebrow="Career Access"
      title="The NHISA resource library"
      intro="Every resource on NHISA in one place. Search, or filter by what you need right now. As our alumni network grows, internships and jobs they share will be added here too."
    >
      <div className="grid gap-8 lg:grid-cols-[15rem_1fr]">
        <aside aria-label="Filter by category">
          <h2 className="mb-3 hidden text-sm font-semibold uppercase tracking-[0.14em] text-white/50 lg:block">Category</h2>
          <div className="no-scrollbar -mx-5 flex gap-2 overflow-x-auto px-5 pb-1 lg:mx-0 lg:flex-col lg:px-0 lg:pb-0">{filters}</div>
        </aside>

        <div>
          <label className="glass flex items-center gap-3 rounded-full px-5 py-3 focus-within:outline focus-within:outline-2 focus-within:outline-accent">
            <Search size={18} aria-hidden="true" className="shrink-0 text-white/55" />
            <span className="sr-only">Search resources</span>
            <input
              type="search"
              value={query}
              onChange={(event) => setQuery(event.target.value)}
              placeholder="Search, e.g. OPT, résumé, internships"
              aria-label="Search resources"
              className="search-input w-full bg-transparent text-white placeholder:text-white/40"
            />
          </label>

          <p className="mt-6 text-sm text-white/50" aria-live="polite">
            Showing {results.length} of {ALL.length} resources{category ? ` in ${category}` : ''}
          </p>

          {results.length ? (
            <ul className="mt-3 divide-y divide-white/[0.07] overflow-hidden rounded-2xl border border-white/10 bg-white/[0.025]">
              {results.map((item) => (
                <Row key={item.name} item={item} />
              ))}
            </ul>
          ) : (
            <div className="card mt-3 text-white/65">
              No resources match that search. Try a different word, or{' '}
              <button type="button" onClick={() => { setQuery(''); setCategory(null); }} className="text-accent underline underline-offset-4">
                clear the filters
              </button>
              .
            </div>
          )}
        </div>
      </div>
    </PageShell>
  );
}
