import type { ReactNode } from 'react';
import Glyph, { SECTION_GLYPHS } from './Glyph';

type TopicProps = {
  id: string;
  title: string;
  intro?: ReactNode;
  /** Short data line under the introduction, e.g. "Step 2 / 6" or "6 resources". */
  meta?: string;
  /** Position in a sequence, when the order matters (Career Hub steps). */
  step?: { index: number; total: number };
  children: ReactNode;
};

/**
 * The site's long-page section: glyph, title and introduction stay in view on
 * the left while the content runs on the right. Stacks on narrow screens.
 */
export default function Topic({ id, title, intro, meta, step, children }: TopicProps) {
  const glyph = SECTION_GLYPHS[id];
  const detail = step ? `Step ${step.index} / ${step.total}` : meta;
  return (
    <section id={id} aria-labelledby={`${id}-title`} className="grid scroll-mt-40 gap-10 lg:grid-cols-[minmax(0,5fr)_minmax(0,7fr)] lg:gap-20">
      <header className="lg:sticky lg:top-44 lg:self-start">
        {glyph && <Glyph name={glyph} className="mb-7 text-white/55" />}
        <h2 id={`${id}-title`} className="t-heading text-white">
          {step && <span className="sr-only">Step {step.index}: </span>}
          {title}
        </h2>
        {intro && <div className="t-body mt-4 max-w-md">{intro}</div>}
        {detail && <p className="t-mono mt-6">{detail}</p>}
      </header>
      <div className="min-w-0">{children}</div>
    </section>
  );
}

/** A heading-and-points list, one row per item, for guide content. */
export function PointList({ items }: { items: { title: string; points: string[] }[] }) {
  return (
    <dl className="border-t border-white/[0.1]">
      {items.map((item) => (
        <div key={item.title} className="grid gap-3 border-b border-white/[0.1] py-7 sm:grid-cols-[11rem_1fr] sm:gap-8">
          <dt className="text-[1.125rem] font-medium text-white">{item.title}</dt>
          <dd>
            <ul className="space-y-2">
              {item.points.map((point) => (
                <li key={point} className="t-body flex gap-3">
                  <span className="mt-[0.72rem] h-px w-3 shrink-0 bg-white/35" aria-hidden="true" />
                  {point}
                </li>
              ))}
            </ul>
          </dd>
        </div>
      ))}
    </dl>
  );
}
