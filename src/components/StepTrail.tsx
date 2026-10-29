import { ArrowRight, ArrowUpRight } from 'lucide-react';
import type { Step } from '../content/email';
import { href } from '../lib/router';
import ImageDialog from './ImageDialog';

/** Numbered steps that alternate left and right, as in the hand-drawn layout. */
export default function StepTrail({ steps }: { steps: Step[] }) {
  return (
    <ol className="relative space-y-6 sm:space-y-4">
      {steps.map((step, index) => {
        const right = index % 2 === 1;
        return (
          <li key={step.title} className={`card relative sm:w-[64%] ${right ? 'sm:ml-auto sm:text-right' : ''}`}>
            <p className="font-mono text-sm uppercase tracking-[0.18em] text-accent">Step {index + 1}</p>
            <h3 className="mt-3 text-2xl font-semibold tracking-tight text-white">{step.title}</h3>
            {step.body && <p className="mt-3 leading-relaxed text-white/65">{step.body}</p>}
            {step.extras?.map((extra) => (
              // A div, not a p: the image link renders its <dialog> here.
              <div key={extra.label} className="mt-4 text-white/80">
                <span className="mr-2">{extra.prompt}</span>
                {extra.kind === 'image' && (
                  <ImageDialog label={extra.label} src={extra.src} alt={extra.alt} caption={`Step ${index + 1}: ${step.title}`} />
                )}
                {extra.kind === 'external' && (
                  <a
                    href={extra.url}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="inline-flex items-center gap-1 font-medium text-accent underline decoration-accent/40 underline-offset-4 hover:decoration-accent"
                  >
                    {extra.label}
                    <ArrowUpRight size={15} aria-hidden="true" />
                    <span className="sr-only">(opens in a new tab)</span>
                  </a>
                )}
                {extra.kind === 'route' && (
                  <a
                    href={href(extra.path)}
                    className="inline-flex items-center gap-1 font-medium text-accent underline decoration-accent/40 underline-offset-4 hover:decoration-accent"
                  >
                    {extra.label}
                    <ArrowRight size={15} aria-hidden="true" />
                  </a>
                )}
              </div>
            ))}
          </li>
        );
      })}
    </ol>
  );
}
