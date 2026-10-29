import { ArrowUpRight } from 'lucide-react';
import { SectionHeading } from '../../components/PageShell';
import { ResourceCard } from '../../components/ResourceCard';
import { HANDSHAKE } from '../../content/guides';
import { resource } from '../../content/resources';

function NumberedCards({ items }: { items: { title: string; body: string }[] }) {
  return (
    <ol className="grid gap-4 md:grid-cols-3">
      {items.map((item, index) => (
        <li key={item.title} className="card">
          <span className="font-mono text-sm text-accent">{String(index + 1).padStart(2, '0')}</span>
          <h3 className="mt-4 text-lg font-semibold text-white">{item.title}</h3>
          <p className="mt-2 leading-relaxed text-white/65">{item.body}</p>
        </li>
      ))}
    </ol>
  );
}

const cuseWorks = resource('cuseworks');

export default function Handshake() {
  return (
    <div className="space-y-20">
      <section aria-labelledby="why-handshake">
        <SectionHeading id="why-handshake" title="Why Handshake?" intro="Largely similar to LinkedIn, with three differences that matter." />
        <div className="grid gap-4 md:grid-cols-3">
          {HANDSHAKE.why.map((item) => (
            <div key={item.title} className="card">
              <h3 className="text-lg font-semibold text-white">{item.title}</h3>
              <p className="mt-2 leading-relaxed text-white/65">{item.body}</p>
            </div>
          ))}
        </div>
      </section>

      <section aria-labelledby="first-steps">
        <SectionHeading id="first-steps" label="01" title="First steps" intro="Account creation and setup." />
        <NumberedCards items={HANDSHAKE.firstSteps} />
      </section>

      <section aria-labelledby="next-steps">
        <SectionHeading id="next-steps" label="02" title="Make the platform work for you" />
        <NumberedCards items={HANDSHAKE.nextSteps} />
      </section>

      <section aria-labelledby="handshake-links" className="grid gap-4 md:grid-cols-2">
        <h2 id="handshake-links" className="sr-only">
          Handshake links
        </h2>
        <a
          href="https://app.joinhandshake.com/home"
          target="_blank"
          rel="noopener noreferrer"
          className="card card-link group flex flex-col justify-between bg-accent/[0.08]"
        >
          <span>
            <span className="block text-lg font-semibold text-white">Open Handshake</span>
            <span className="mt-2 block leading-relaxed text-white/65">Sign in and start setting up your profile.</span>
          </span>
          <span className="mt-6 flex items-center gap-2 text-sm text-white/60 group-hover:text-white">
            app.joinhandshake.com
            <ArrowUpRight size={16} aria-hidden="true" />
            <span className="sr-only">(opens in a new tab)</span>
          </span>
        </a>
        {cuseWorks && <ResourceCard resource={cuseWorks} />}
      </section>
    </div>
  );
}
