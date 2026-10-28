import { ArrowUpRight } from 'lucide-react';
import CopyButton from '../../components/CopyButton';
import { SectionHeading } from '../../components/PageShell';
import { LINKEDIN } from '../../content/job';

function PointCard({ title, points }: { title: string; points: string[] }) {
  return (
    <div className="card">
      <h3 className="text-lg font-semibold text-white">{title}</h3>
      <ul className="mt-4 space-y-2.5">
        {points.map((point) => (
          <li key={point} className="flex gap-3 leading-relaxed text-white/65">
            <span className="mt-[0.6rem] h-1 w-1 shrink-0 rounded-full bg-ember" aria-hidden="true" />
            {point}
          </li>
        ))}
      </ul>
    </div>
  );
}

export default function LinkedIn() {
  return (
    <div className="space-y-20">
      <section aria-labelledby="why-linkedin" className="grid gap-8 lg:grid-cols-[1fr_1.4fr]">
        <div>
          <h2 id="why-linkedin" className="text-2xl sm:text-3xl font-semibold tracking-tight text-white">
            Why is LinkedIn important?
          </h2>
          <p className="mt-3 leading-relaxed text-white/65">{LINKEDIN.why}</p>
          <a
            href="https://www.linkedin.com/"
            target="_blank"
            rel="noopener noreferrer"
            className="mt-6 inline-flex items-center gap-2 rounded-full border border-white/20 px-5 py-2.5 text-sm font-medium text-white transition-colors hover:border-ember"
          >
            Open LinkedIn
            <ArrowUpRight size={16} aria-hidden="true" />
            <span className="sr-only">(opens in a new tab)</span>
          </a>
        </div>
        <div className="card">
          <h3 className="text-lg font-semibold text-white">How to create a LinkedIn account</h3>
          <ol className="mt-5 space-y-4">
            {LINKEDIN.setup.map((step, index) => (
              <li key={step} className="flex items-baseline gap-4">
                <span className="font-mono text-sm text-ember">{String(index + 1).padStart(2, '0')}</span>
                <span className="leading-relaxed text-white/75">{step}</span>
              </li>
            ))}
          </ol>
        </div>
      </section>

      <section aria-labelledby="profile">
        <SectionHeading
          id="profile"
          number="01"
          title="Profile optimization"
          intro="Build a profile that clearly shows who you are, what you can do, and where you want to go."
        />
        <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
          {LINKEDIN.profile.map((card) => (
            <PointCard key={card.title} {...card} />
          ))}
        </div>
      </section>

      <section aria-labelledby="networking">
        <SectionHeading
          id="networking"
          number="02"
          title="Networking & outreach"
          intro="Build meaningful connections through thoughtful conversations and continued engagement."
        />
        <div className="grid gap-4 sm:grid-cols-2">
          {LINKEDIN.networking.map((card) => (
            <PointCard key={card.title} {...card} />
          ))}
        </div>
      </section>

      <section aria-labelledby="prompts">
        <SectionHeading
          id="prompts"
          number="03"
          title="AI prompts"
          intro="Use these prompts with an AI tool to improve your LinkedIn profile and understand what employers are looking for. Replace the brackets with your information."
        />
        <div className="grid gap-4 lg:grid-cols-2">
          {LINKEDIN.prompts.map((prompt, index) => {
            const text = [prompt.body, '', ...prompt.fields].join('\n');
            return (
              <div key={prompt.title} className="card flex flex-col">
                <p className="font-mono text-xs text-white/40">Prompt {index + 1}</p>
                <h3 className="mt-3 text-lg font-semibold text-white">{prompt.title}</h3>
                <blockquote className="mt-4 rounded-xl border border-white/10 bg-black/25 p-5 text-[0.95rem] leading-relaxed text-white/80">
                  <p>{prompt.body}</p>
                  <p className="mt-4 font-mono text-sm text-white/55">
                    {prompt.fields.map((field) => (
                      <span key={field} className="block">
                        {field}
                      </span>
                    ))}
                  </p>
                </blockquote>
                <div className="mt-5">
                  <CopyButton text={text} label="Copy prompt" />
                </div>
              </div>
            );
          })}
        </div>
        <p className="mt-6 text-sm italic text-white/50">
          Remove sensitive personal information before uploading materials, and review AI suggestions for accuracy.
        </p>
      </section>
    </div>
  );
}
