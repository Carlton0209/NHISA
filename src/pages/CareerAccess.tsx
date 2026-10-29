import { useEffect, useRef, useState } from 'react';
import { flushSync } from 'react-dom';
import { Search } from 'lucide-react';
import PageShell from '../components/PageShell';
import { ResourceRow } from '../components/Resources';
import { RESOURCES } from '../content/resources';
import type { Category, Resource } from '../content/types';
import { transitionRows } from '../lib/interactions';

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
  const clear = () => transitionRows(() => flushSync(() => {
    setQuery('');
    setCategory(null);
  }));

  return (
    <PageShell
      path={path}
      title="The NHISA resource library"
      intro="Every resource on NHISA in one place. Search, or filter by what you need right now. As our alumni network grows, internships and jobs they share will be added here too."
    >
      <div className="grid gap-10 lg:grid-cols-[15rem_1fr] lg:gap-14">
        <aside aria-label="Filter by category" className="lg:sticky lg:top-28 lg:self-start">
          <h2 className="mb-3 hidden text-sm font-medium text-white/55 lg:block">Category</h2>
          <div className="no-scrollbar -mx-5 flex gap-2 overflow-x-auto px-5 pb-1 lg:mx-0 lg:flex-col lg:gap-1.5 lg:px-0 lg:pb-0">
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
            <kbd className="hidden rounded-md border border-white/15 px-1.5 py-0.5 text-xs text-white/45 sm:block" aria-hidden="true">/</kbd>
          </label>

          <p className="t-meta tnum mt-6" aria-live="polite">
            Showing {results.length} of {ALL.length} resources{category ? ` in ${category}` : ''}
          </p>

          {results.length ? (
            <ul className="mt-3 border-t border-white/[0.08]">
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
        </div>
      </div>
    </PageShell>
  );
}
