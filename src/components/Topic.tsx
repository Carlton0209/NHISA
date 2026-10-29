import type { ReactNode } from 'react';
import { PHOTOS, type PhotoKey } from '../content/photos';

type TopicProps = {
  id: string;
  title: string;
  intro?: ReactNode;
  /** Short data line under the introduction, e.g. "Step 2 / 6" or "6 resources". */
  meta?: string;
  /** Position in a sequence; announced to screen readers, shown by position. */
  step?: { index: number; total: number };
  /** A photograph under the introduction, or under the content when the section is short. */
  photo?: PhotoKey;
  photoBelow?: boolean;
  children: ReactNode;
};

/**
 * The site's long-page section: title and introduction stay in view on
 * the left while the content runs on the right. Stacks on narrow screens.
 */
export default function Topic({ id, title, intro, meta, step, photo, photoBelow = false, children }: TopicProps) {
  const picture = photo ? PHOTOS[photo] : null;
  return (
    <section id={id} aria-labelledby={`${id}-title`} className="grid scroll-mt-40 gap-10 lg:grid-cols-12 lg:gap-x-10">
      <header className="lg:sticky lg:top-32 lg:col-span-5 lg:self-start">
        <h2 id={`${id}-title`} data-reveal className="text-[clamp(2rem,1.3rem+2.2vw,3.25rem)] font-bold leading-[0.98] tracking-[-0.02em] text-white">
          {step && <span className="sr-only">Step {step.index}: </span>}
          {title}
        </h2>
        {intro && <div data-reveal="2" className="t-body mt-5 max-w-md">{intro}</div>}
        {meta && <p data-reveal="3" className="t-meta mt-6">{meta}</p>}
        {picture && !photoBelow && (
          <div className="pic-in mt-8 aspect-[4/3] max-w-md overflow-hidden rounded-[1.25rem]">
            <img src={picture.src} alt={picture.alt} loading="lazy" className="h-full w-full object-cover" style={{ objectPosition: picture.position }} />
          </div>
        )}
      </header>
      <div className="min-w-0 lg:col-span-7">
        {children}
        {picture && photoBelow && (
          <div className="pic-in mt-6 aspect-[16/10] overflow-hidden rounded-[1.25rem]">
            <img src={picture.src} alt={picture.alt} loading="lazy" className="h-full w-full object-cover" style={{ objectPosition: picture.position }} />
          </div>
        )}
      </div>
    </section>
  );
}

/** A heading-and-points list, one row per item, for guide content. */
export function PointList({ items }: { items: { title: string; points: string[] }[] }) {
  return (
    <dl className="space-y-2">
      {items.map((item) => (
        <div key={item.title} className="grid gap-3 rounded-2xl bg-[var(--surface)] p-6 sm:grid-cols-[12rem_1fr] sm:gap-8">
          <dt className="text-[1.125rem] font-medium text-white">{item.title}</dt>
          <dd>
            <ul className="space-y-2">
              {item.points.map((point) => (
                <li key={point} className="t-body flex gap-3">
                  <span className="mt-[0.62rem] h-1.5 w-1.5 shrink-0 rounded-full bg-[var(--accent)]" aria-hidden="true" />
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
