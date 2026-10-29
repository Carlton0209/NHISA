import { useEffect, useRef, useState } from 'react';
import { flushSync } from 'react-dom';
import { Search } from 'lucide-react';
import PageShell from '../components/PageShell';
import { ResourceRow } from '../components/Resources';
import { RESOURCES } from '../content/resources';
import { PHOTOS, type PhotoKey } from '../content/photos';
import type { Category, Resource } from '../content/types';
import { transitionRows } from '../lib/interactions';
import { href } from '../lib/router';

const ALL = Object.entries(RESOURCES as Record<string, Resource>);

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

// Where most people start, each a filter with a picture of the place it leads to.
const STARTS: { category: Category; label: string; photo: PhotoKey }[] = [
  { category: 'Job & internship search', label: 'Find an internship or job', photo: 'studios' },
  { category: 'International students', label: 'Visas, CPT and OPT', photo: 'school' },
  { category: 'Campus life', label: 'Get involved on campus', photo: 'quad' },
];

const scrollBehavior = (): ScrollBehavior => (window.matchMedia('(prefers-reduced-motion: reduce)').matches ? 'auto' : 'smooth');

/** Every resource on the site as one filterable library, after the YC company directory. */
export default function CareerAccess({ path }: { path: string }) {
  const [query, setQuery] = useState('');
  const [category, setCategory] = useState<Category | null>(null);
  const inputRef = useRef<HTMLInputElement>(null);

  // "/" jumps to the search field, as on most directories.
  useEffect(() => {
    const onKey = (event: KeyboardEvent) => {
      const typing = (event.target as HTMLElement).closest('input, textarea, [contenteditable]');
      if (event.key === '/' && !typing) {
        event.preventDefault();
        inputRef.current?.focus();
      }
    };
    window.addEventListener('keydown', onKey);
    return () => window.removeEventListener('keydown', onKey);
  }, []);

  const q = query.trim().toLowerCase();
  const searched = ALL.filter(([, item]) => !q || `${item.name} ${item.intro} ${item.category} ${item.note ?? ''}`.toLowerCase().includes(q));
  const results = category ? searched.filter(([, item]) => item.category === category) : searched;
  const count = (c: Category | null) => (c ? searched.filter(([, item]) => item.category === c).length : searched.length);

  const choose = (next: Category | null) => transitionRows(() => flushSync(() => setCategory(next)));
  // The list is below the fold when a starting point is picked, so filter at once and scroll to it;
  // a row transition here would interrupt the scroll.
  const start = (next: Category) => {
    flushSync(() => setCategory(next));
    document.getElementById('library')?.scrollIntoView({ behavior: scrollBehavior(), block: 'start' });
  };
  const clear = () => transitionRows(() => flushSync(() => {
    setQuery('');
    setCategory(null);
  }));

  return (
    <PageShell
      path={path}
      title="The NHISA resource library"
      meta={`${ALL.length} resources · ${CATEGORIES.length} categories`}
      intro="Every resource on NHISA, searchable. Jobs shared by alumni will join them soon."
    >
      <section aria-labelledby="starts-title" className="mb-20 md:mb-28">
        <h2 id="starts-title" data-reveal className="mb-6 text-[var(--step-lead)] font-medium">Start here</h2>
        <ul className="grid gap-x-2 gap-y-8 sm:grid-cols-3">
          {STARTS.map((item, index) => (
            <li key={item.category} data-reveal={String(index + 1)}>
              <button type="button" onClick={() => start(item.category)} aria-pressed={category === item.category} className="group block w-full text-left">
                <span className="pic-in block aspect-[4/3] overflow-hidden rounded-[1.25rem]">
                  <img src={PHOTOS[item.photo].src} alt="" loading="lazy" className="h-full w-full object-cover transition-transform duration-700 group-hover:scale-[1.03]" style={{ objectPosition: PHOTOS[item.photo].position }} />
                </span>
                <span className="mt-4 block text-[var(--step-lead)] font-medium leading-tight">{item.label}</span>
                <span className="t-meta tnum mt-1 block">{count(item.category)} resources</span>
              </button>
            </li>
          ))}
        </ul>
      </section>

      <div id="library" className="grid gap-10 lg:grid-cols-[15rem_1fr] lg:gap-14">
        <aside aria-label="Filter by category" className="min-w-0 lg:sticky lg:top-28 lg:self-start">
          <h2 className="mb-3 hidden font-medium lg:block">Category</h2>
          <div className="flex flex-wrap gap-2 lg:flex-col lg:flex-nowrap lg:gap-1.5">
            {[null, ...CATEGORIES].map((c) => {
              const n = count(c);
              return (
                <button
                  key={c ?? 'all'}
                  type="button"
                  onClick={() => choose(c)}
                  aria-pressed={category === c}
                  disabled={n === 0 && category !== c}
                  className={`glass-button shrink-0 justify-between gap-4 px-4 py-2 lg:w-full ${category === c ? '' : 'text-white/75 hover:text-white'}`}
                >
                  <span>{c ?? 'All resources'}</span>
                  <span className="tnum text-xs text-white/50">{n}</span>
                </button>
              );
            })}
          </div>
        </aside>

        <div className="min-w-0">
          <label className="glass flex items-center gap-3 rounded-full px-5 py-3.5 transition-[border-color] focus-within:border-white/40">
            <Search size={18} aria-hidden="true" className="shrink-0 text-white/55" />
            <input
              ref={inputRef}
              type="search"
              value={query}
              onChange={(event) => setQuery(event.target.value)}
              onKeyDown={(event) => event.key === 'Escape' && setQuery('')}
              placeholder="Search, e.g. OPT, résumé, internships"
              aria-label="Search resources"
              className="search-input w-full bg-transparent text-white placeholder:text-white/45"
            />
            <kbd className="hidden rounded-md bg-white/10 px-2 py-0.5 text-[var(--step-small)] text-white/70 sm:block" aria-hidden="true">/</kbd>
          </label>

          <p className="t-meta tnum mt-6" aria-live="polite">
            Showing {results.length} of {ALL.length} resources{category ? ` in ${category}` : ''}
          </p>

          {results.length ? (
            <ul className="mt-3 space-y-1">
              {results.map(([id, item]) => (
                <ResourceRow key={id} id={id} item={item} showCategory />
              ))}
            </ul>
          ) : (
            <div className="panel mt-4 text-white/70">
              Nothing matches “{query}”{category ? ` in ${category}` : ''}. Try a different word, or{' '}
              <button type="button" onClick={clear} className="text-accent underline decoration-accent/40 underline-offset-4 hover:decoration-accent">
                clear the search and filters
              </button>
              .
            </div>
          )}

          <p data-reveal className="t-body mt-16">
            Missing something?{' '}
            <a href={href('/about', 'get-involved')} className="font-medium text-white underline decoration-1 underline-offset-4 hover:decoration-2">
              Suggest a resource
            </a>
            .
          </p>
        </div>
      </div>
    </PageShell>
  );
}
