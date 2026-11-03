import { ArrowRight } from 'lucide-react';
import CopyButton from '../../components/CopyButton';
import PixelCard, { LaptopArt, PhoneArt } from '../../components/PixelCard';
import StepTrail from '../../components/StepTrail';
import Topic from '../../components/Topic';
import { DEVICES, type Device } from '../../content/email';
import { href } from '../../lib/router';
import { plural, rich, t } from '../../lib/i18n';

/** The signature as it looks in an email, on white like the message itself. It stays in English, as the email would be. */
function SignaturePreview({ caption }: { caption: string }) {
  return (
    <figure>
      <div data-ui lang="en" translate="no" className="rounded-[1.25rem] bg-white p-6 text-[13px] leading-relaxed text-[#1f1f1f] sm:p-8" style={{ fontFamily: 'Arial, Helvetica, sans-serif' }}>
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

const steps = (n: number) => plural(n, { one: '{n} step', other: '{n} steps' });

export function EmailSignature() {
  return (
    <div className="space-y-28 sm:space-y-36">
      <Topic
        id="why"
        photo="hall"
        title={t('Why use an email signature?')}
        intro={t('People see who you are and how to reach you at a glance.')}
      >
        <SignaturePreview caption={t('A finished signature at the end of an email.')} />
      </Topic>

      <Topic id="how" photo="school" title={t('How to create an email signature?')} intro={t('Pick your device.')}>
        <div className="grid gap-5 md:grid-cols-2">
          <PixelCard path="/career-hub/email-signature/laptop" title={t(DEVICES.laptop.title)} subtitle={t(DEVICES.laptop.subtitle)} meta={steps(DEVICES.laptop.steps.length)} seed={11}>
            <LaptopArt />
          </PixelCard>
          <PixelCard path="/career-hub/email-signature/phone" title={t(DEVICES.phone.title)} subtitle={t(DEVICES.phone.subtitle)} meta={steps(DEVICES.phone.steps.length)} seed={29}>
            <PhoneArt />
          </PixelCard>
        </div>
        <a
          href={href('/career-hub/email-signature/sample')}
          className="mt-8 inline-flex items-center gap-2 font-medium text-white underline decoration-1 underline-offset-4 hover:decoration-2"
        >
          {t('Just want a sample to copy?')}
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
        {rich(other === 'phone' ? 'Using your phone instead? <0>See the phone steps</0>' : 'Using your laptop instead? <0>See the laptop steps</0>', [
          <a
            href={href(`/career-hub/email-signature/${other}`)}
            className="font-medium text-white underline decoration-1 underline-offset-4 hover:decoration-2"
          />,
        ])}
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
  const strong = <span className="text-white" />;
  return (
    <div className="grid gap-10 lg:grid-cols-[1.2fr_1fr] lg:items-start">
      <div data-reveal>
        <SignaturePreview caption={t('Select it, or use the button below.')} />
        <div className="mt-6 flex flex-wrap items-center gap-4">
          <CopyButton text={SAMPLE_TEXT} html={SAMPLE_HTML} label={t('Copy signature')} />
          <span className="t-meta">{t('Formatting is kept when you paste into Outlook.')}</span>
        </div>
      </div>
      <div data-reveal="2" className="panel">
        <h2 className="text-[var(--step-lead)] font-medium text-white">{t('What goes on each line')}</h2>
        <ol className="t-body mt-4 space-y-3">
          <li>{rich('<0>Name and pronouns</0>, so people know how to address you.', [strong])}</li>
          <li>{rich('<0>School and class year.</0>', [strong])}</li>
          <li>{rich('<0>Major and minor.</0>', [strong])}</li>
          <li>{rich('<0>Your organization and role</0>, if you have one.', [strong])}</li>
          <li>{rich('<0>Your SU email</0>, as a link.', [strong])}</li>
        </ol>
        <p className="t-meta mt-6">
          {rich('Next: add it in Outlook on your <0>laptop</0> or <1>phone</1>.', [
            <a href={href('/career-hub/email-signature/laptop')} className="text-white underline underline-offset-4" />,
            <a href={href('/career-hub/email-signature/phone')} className="text-white underline underline-offset-4" />,
          ])}
        </p>
      </div>
    </div>
  );
}
