import { ArrowUpRight } from 'lucide-react';
import CopyButton from '../../components/CopyButton';
import Topic, { PointList } from '../../components/Topic';
import { LINKEDIN } from '../../content/guides';

export default function LinkedIn() {
  return (
    <div className="space-y-28 sm:space-y-36">
      <Topic
        id="start"
        photo="studios"
        title="Why is LinkedIn important?"
        intro={
          <>
            <p>{LINKEDIN.why}</p>
            <a href="https://www.linkedin.com/" target="_blank" rel="noopener noreferrer" className="glass-button mt-7 px-5 py-2.5">
              Open LinkedIn
              <ArrowUpRight size={16} aria-hidden="true" />
              <span className="sr-only">(opens in a new tab)</span>
            </a>
          </>
        }
      >
        <h3 className="mb-4 text-[var(--step-lead)] font-medium text-white">Create your account</h3>
        <ol className="space-y-2">
          {LINKEDIN.setup.map((step, index) => (
            <li key={step} className="flex items-baseline gap-5 rounded-2xl bg-[var(--surface)] px-6 py-4">
              <span className="tnum w-5 shrink-0 text-sm font-semibold text-accent">{index + 1}</span>
              <span className="text-white/80">{step}</span>
            </li>
          ))}
        </ol>
      </Topic>

      <Topic id="profile" photo="school" title="Profile optimization" intro="Show who you are, what you can do and where you’re headed.">
        <PointList items={LINKEDIN.profile} />
      </Topic>

      <Topic id="networking" photo="quad" title="Networking & outreach" intro="Build real connections and keep them going.">
        <PointList items={LINKEDIN.networking} />
      </Topic>

      <Topic
        id="prompts"
        title="AI prompts"
        intro={
          <>
            <p>Paste these into an AI tool and fill in the brackets.</p>
            <p className="t-meta mt-4 italic">Leave out sensitive personal details, and check what the AI writes.</p>
          </>
        }
      >
        <div className="space-y-6">
          {LINKEDIN.prompts.map((prompt) => {
            const text = [prompt.body, '', ...prompt.fields].join('\n');
            return (
              <figure key={prompt.title} className="panel">
                <figcaption className="flex flex-wrap items-center justify-between gap-4">
                  <h3 className="text-[1.0625rem] font-semibold text-white">{prompt.title}</h3>
                  <CopyButton text={text} label="Copy prompt" />
                </figcaption>
                <blockquote className="mt-5 rounded-xl bg-white/[0.04] p-5 leading-relaxed text-white/80">
                  <p>{prompt.body}</p>
                  <p className="mt-4 text-sm text-white/55">
                    {prompt.fields.map((field) => (
                      <span key={field} className="block">
                        {field}
                      </span>
                    ))}
                  </p>
                </blockquote>
              </figure>
            );
          })}
        </div>
      </Topic>
    </div>
  );
}
