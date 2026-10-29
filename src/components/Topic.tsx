import type { ReactNode } from 'react';

type TopicProps = {
  id: string;
  title: string;
  intro?: ReactNode;
  /** Position in a sequence, shown when the order matters (Career Hub steps). */
  step?: number;
  children: ReactNode;
};

/**
 * The site's long-page section: title and introduction stay in view on the
 * left while the content runs on the right. Stacks on narrow screens.
 */
export default function Topic({ id, title, intro, step, children }: TopicProps) {
  return (
    <section id={id} aria-labelledby={`${id}-title`} className="grid scroll-mt-40 gap-10 lg:grid-cols-[minmax(0,5fr)_minmax(0,7fr)] lg:gap-20">
      <header className="lg:sticky lg:top-44 lg:self-start">
        {step !== undefined && (
          <span aria-hidden="true" className="tnum mb-5 block text-[4.5rem] font-semibold leading-none tracking-[-0.05em] text-white/[0.16]">
            {step}
          </span>
        )}
        <h2 id={`${id}-title`} className="t-heading text-white">
          {step !== undefined && <span className="sr-only">Step {step}: </span>}
          {title}
        </h2>
        {intro && <div className="t-body mt-4 max-w-md">{intro}</div>}
      </header>
      <div className="min-w-0">{children}</div>
    </section>
  );
}

/** A heading-and-points list, one row per item, for guide content. */
export function PointList({ items }: { items: { title: string; points: string[] }[] }) {
  return (
    <dl className="border-t border-white/[0.08]">
      {items.map((item) => (
        <div key={item.title} className="grid gap-3 border-b border-white/[0.08] py-7 sm:grid-cols-[11rem_1fr] sm:gap-8">
          <dt className="text-[1.0625rem] font-semibold text-white">{item.title}</dt>
          <dd>
            <ul className="space-y-2">
              {item.points.map((point) => (
                <li key={point} className="t-body flex gap-3">
                  <span className="mt-[0.7rem] h-1 w-1 shrink-0 rounded-full bg-accent/80" aria-hidden="true" />
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
