import { ArrowRight } from 'lucide-react';
import CopyButton from '../../components/CopyButton';
import PixelCard, { LaptopArt, PhoneArt } from '../../components/PixelCard';
import StepTrail from '../../components/StepTrail';
import { DEVICES, type Device } from '../../content/email';
import { href } from '../../lib/router';

export function EmailSignature() {
  return (
    <div className="space-y-16">
      <section aria-labelledby="why-signature" className="max-w-2xl">
        <h2 id="why-signature" className="text-2xl sm:text-3xl font-semibold tracking-tight text-white">
          Why use an email signature?
        </h2>
        <p className="mt-3 leading-relaxed text-white/65">
          An email signature makes your emails look professional and helps recipients quickly find your name, role, and
          contact information.
        </p>
      </section>

      <section aria-labelledby="how-signature">
        <h2 id="how-signature" className="mb-8 text-2xl sm:text-3xl font-semibold tracking-tight text-white">
          How to create an email signature?
        </h2>
        <div className="grid gap-5 md:grid-cols-2">
          <PixelCard path="/career-hub/email-signature/laptop" title="Laptop" subtitle={DEVICES.laptop.subtitle} meta="4 steps" seed={11}>
            <LaptopArt />
          </PixelCard>
          <PixelCard path="/career-hub/email-signature/phone" title="Phone" subtitle={DEVICES.phone.subtitle} meta="4 steps" seed={29}>
            <PhoneArt />
          </PixelCard>
        </div>
        <a
          href={href('/career-hub/email-signature/sample')}
          className="mt-8 inline-flex items-center gap-2 font-medium text-accent underline decoration-accent/40 underline-offset-4 hover:decoration-accent"
        >
          Just need a sample signature to copy?
          <ArrowRight size={16} aria-hidden="true" />
        </a>
      </section>
    </div>
  );
}

export function DeviceSteps({ device }: { device: Device }) {
  const other: Device = device === 'laptop' ? 'phone' : 'laptop';
  return (
    <>
      <StepTrail steps={DEVICES[device].steps} />
      <p className="mt-12 text-white/60">
        Using your {other} instead?{' '}
        <a
          href={href(`/career-hub/email-signature/${other}`)}
          className="font-medium text-accent underline decoration-accent/40 underline-offset-4 hover:decoration-accent"
        >
          See the {DEVICES[other].title.toLowerCase()} steps
        </a>
      </p>
    </>
  );
}

// Inline styles survive pasting into Outlook; class names would not.
const LINES = [
  { text: 'Your Name (pronouns)', style: 'font-weight:700;font-size:15px;color:#1f1f1f' },
  { text: 'Syracuse University Class of 20XX', style: 'font-weight:700;color:#d44500' },
  { text: 'Your Major | Your Minor', style: 'color:#1f1f1f' },
  { text: 'Organization | Your Role', style: 'font-weight:700;color:#000e54' },
  { text: 'netid@syr.edu', style: 'color:#0b57d0;text-decoration:underline', href: 'mailto:netid@syr.edu' },
];

const FONT = 'font-family:Arial,Helvetica,sans-serif';
const SAMPLE_HTML = `<div style="${FONT};font-size:13px;line-height:1.5">${LINES.map((line) =>
  line.href
    ? `<div style="${FONT}"><a href="${line.href}" style="${FONT};${line.style}">${line.text}</a></div>`
    : `<div style="${FONT};${line.style}">${line.text}</div>`,
).join('')}</div>`;
const SAMPLE_TEXT = LINES.map((line) => line.text).join('\n');

export function SignatureSample() {
  return (
    <div className="grid gap-10 lg:grid-cols-[1.2fr_1fr] lg:items-start">
      <div>
        <div className="rounded-2xl bg-white p-6 sm:p-8 shadow-2xl shadow-black/40">
          <p className="mb-5 border-b border-black/10 pb-3 text-xs uppercase tracking-[0.16em] text-black/40">Signature preview</p>
          <div className="select-all" dangerouslySetInnerHTML={{ __html: SAMPLE_HTML }} />
        </div>
        <div className="mt-5 flex flex-wrap items-center gap-4">
          <CopyButton text={SAMPLE_TEXT} html={SAMPLE_HTML} label="Copy signature" />
          <span className="text-sm text-white/50">Formatting is kept when you paste into Outlook.</span>
        </div>
      </div>
      <div className="card">
        <h2 className="text-lg font-semibold text-white">What goes on each line</h2>
        <ol className="mt-4 space-y-3 text-white/65">
          <li><span className="text-white">Name and pronouns</span>, so people know how to address you.</li>
          <li><span className="text-white">School and class year.</span></li>
          <li><span className="text-white">Major and minor.</span></li>
          <li><span className="text-white">Your organization and role</span>, if you have one.</li>
          <li><span className="text-white">Your SU email</span>, linked so it opens a new message.</li>
        </ol>
        <p className="mt-6 text-sm text-white/50">
          Next: add it in Outlook on your{' '}
          <a href={href('/career-hub/email-signature/laptop')} className="text-accent underline underline-offset-4">laptop</a> or{' '}
          <a href={href('/career-hub/email-signature/phone')} className="text-accent underline underline-offset-4">phone</a>.
        </p>
      </div>
    </div>
  );
}
