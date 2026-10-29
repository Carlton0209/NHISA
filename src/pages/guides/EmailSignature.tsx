import { ArrowRight } from 'lucide-react';
import CopyButton from '../../components/CopyButton';
import PixelCard, { LaptopArt, PhoneArt } from '../../components/PixelCard';
import StepTrail from '../../components/StepTrail';
import Topic from '../../components/Topic';
import { DEVICES, type Device } from '../../content/email';
import { href } from '../../lib/router';

/** The signature as it looks in an email, on white like the message itself. */
function SignaturePreview({ caption }: { caption: string }) {
  return (
    <figure>
      <div data-ui className="rounded-[1.25rem] bg-white p-6 text-[13px] leading-relaxed text-[#1f1f1f] sm:p-8" style={{ fontFamily: 'Arial, Helvetica, sans-serif' }}>
        <div className="mb-5 space-y-3" aria-hidden="true">
          <p>Hi Professor Lee,</p>
          <p>Thank you for meeting with me today. I’ve attached my résumé, as we discussed.</p>
          <p>Best regards,</p>
        </div>
        <div className="select-all" dangerouslySetInnerHTML={{ __html: SAMPLE_HTML }} />
      </div>
      <figcaption className="t-meta mt-3">{caption}</figcaption>
    </figure>
  );
}

export function EmailSignature() {
  return (
    <div className="space-y-28 sm:space-y-36">
      <Topic
        id="why"
        photo="hall"
        title="Why use an email signature?"
        intro="An email signature makes your emails look professional and helps recipients quickly find your name, role, and contact information."
      >
        <SignaturePreview caption="A finished signature, as it appears at the end of an email." />
      </Topic>

      <Topic id="how" photo="school" title="How to create an email signature?" intro="Choose the device you use Outlook on.">
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
          className="mt-8 inline-flex items-center gap-2 font-medium text-white underline decoration-1 underline-offset-4 hover:decoration-2"
        >
          Just need a sample signature to copy?
          <ArrowRight size={16} aria-hidden="true" />
        </a>
      </Topic>
    </div>
  );
}

export function DeviceSteps({ device }: { device: Device }) {
  const other: Device = device === 'laptop' ? 'phone' : 'laptop';
  return (
    <>
      <StepTrail steps={DEVICES[device].steps} />
      <p className="t-body mt-12">
        Using your {other} instead?{' '}
        <a
          href={href(`/career-hub/email-signature/${other}`)}
          className="font-medium text-white underline decoration-1 underline-offset-4 hover:decoration-2"
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
      <div data-reveal>
        <SignaturePreview caption="Select the signature, or use the button to copy it with its formatting." />
        <div className="mt-6 flex flex-wrap items-center gap-4">
          <CopyButton text={SAMPLE_TEXT} html={SAMPLE_HTML} label="Copy signature" />
          <span className="t-meta">Formatting is kept when you paste into Outlook.</span>
        </div>
      </div>
      <div data-reveal="2" className="panel">
        <h2 className="text-[var(--step-lead)] font-medium text-white">What goes on each line</h2>
        <ol className="t-body mt-4 space-y-3">
          <li><span className="text-white">Name and pronouns</span>, so people know how to address you.</li>
          <li><span className="text-white">School and class year.</span></li>
          <li><span className="text-white">Major and minor.</span></li>
          <li><span className="text-white">Your organization and role</span>, if you have one.</li>
          <li><span className="text-white">Your SU email</span>, linked so it opens a new message.</li>
        </ol>
        <p className="t-meta mt-6">
          Next: add it in Outlook on your{' '}
          <a href={href('/career-hub/email-signature/laptop')} className="text-white underline underline-offset-4">laptop</a> or{' '}
          <a href={href('/career-hub/email-signature/phone')} className="text-white underline underline-offset-4">phone</a>.
        </p>
      </div>
    </div>
  );
}
