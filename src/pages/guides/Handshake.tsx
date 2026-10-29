import { ArrowUpRight } from 'lucide-react';
import Topic from '../../components/Topic';
import { ResourceList } from '../../components/Resources';
import { HANDSHAKE } from '../../content/guides';

/** Steps whose order matters, as a numbered list. */
function Steps({ items }: { items: { title: string; body: string }[] }) {
  return (
    <ol className="space-y-2">
      {items.map((item, index) => (
        <li key={item.title} className="grid grid-cols-[2rem_1fr] gap-x-4 rounded-2xl bg-[var(--surface)] p-6">
          <span className="tnum pt-0.5 text-sm font-semibold text-accent">{index + 1}</span>
          <div>
            <h3 className="text-[1.0625rem] font-semibold text-white">{item.title}</h3>
            <p className="t-body mt-1.5">{item.body}</p>
          </div>
        </li>
      ))}
    </ol>
  );
}

export default function Handshake() {
  return (
    <div className="space-y-28 sm:space-y-36">
      <Topic
        id="why"
        photo="quad"
        title="Why Handshake?"
        intro={
          <>
            <p>Largely similar to LinkedIn, with three differences that matter.</p>
            <a href="https://app.joinhandshake.com/home" target="_blank" rel="noopener noreferrer" className="glass-button mt-7 px-5 py-2.5">
              Open Handshake
              <ArrowUpRight size={16} aria-hidden="true" />
              <span className="sr-only">(opens in a new tab)</span>
            </a>
          </>
        }
      >
        <dl className="space-y-2">
          {HANDSHAKE.why.map((item) => (
            <div key={item.title} className="grid gap-2 rounded-2xl bg-[var(--surface)] p-6 sm:grid-cols-[12rem_1fr] sm:gap-8">
              <dt className="text-[1.0625rem] font-semibold text-white">{item.title}</dt>
              <dd className="t-body">{item.body}</dd>
            </div>
          ))}
        </dl>
      </Topic>

      <Topic id="first-steps" photo="hall" title="First steps" intro="Account creation and setup.">
        <Steps items={HANDSHAKE.firstSteps} />
      </Topic>

      <Topic id="next-steps" photo="crouse" title="Make the platform work for you" intro="Bring the right jobs and events to you instead of searching every day.">
        <Steps items={HANDSHAKE.nextSteps} />
      </Topic>

      <Topic id="links" title="Where to go next" intro="Handshake itself, and the campus job board that runs on it.">
        <ResourceList ids={['handshake', 'cuseworks']} />
      </Topic>
    </div>
  );
}
