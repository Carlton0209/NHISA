import PageShell from '../components/PageShell';
import { SectionList } from '../components/Resources';
import { CAREER_STEPS } from '../content/careerHub';
import { DEVICES, type Device } from '../content/email';
import { GUIDES } from '../content/guides';
import LinkedIn from './guides/LinkedIn';
import Handshake from './guides/Handshake';
import { DeviceSteps, EmailSignature, SignatureSample } from './guides/EmailSignature';

// The Career Hub step each guide belongs to, for its back link.
const GUIDE_STEP: Record<string, string> = { linkedin: 'profile', handshake: 'opportunities', 'email-signature': 'profile' };

export function careerHubTitle(path: string) {
  const [, , slug, sub] = path.split('/');
  const guide = GUIDES.find((g) => g.slug === slug);
  if (!guide) return 'Career Hub';
  if (sub === 'sample') return 'Sample signature · Email Signature';
  if (sub && sub in DEVICES) return `${DEVICES[sub as Device].title} · Email Signature`;
  return `${guide.title} · Career Hub`;
}

export default function CareerHub({ path }: { path: string }) {
  const [, , slug, sub] = path.split('/');
  const guide = GUIDES.find((g) => g.slug === slug);

  if (!guide) {
    return (
      <PageShell
        path={path}
        title="Your job search, step by step"
        intro="International student support from zero to offer. Start at Step 1 and work your way to the interview: each step has a short guide and the resources to act on it."
        jump={CAREER_STEPS.map((step, index) => ({ id: step.id, label: `${index + 1}. ${step.title}` }))}
      >
        <SectionList sections={CAREER_STEPS} numbered />
      </PageShell>
    );
  }

  const back = { label: 'Career Hub', path: '/career-hub', section: GUIDE_STEP[guide.slug] };

  if (guide.slug === 'email-signature' && sub) {
    const signatureBack = { label: 'Email Signature', path: '/career-hub/email-signature' };
    if (sub === 'sample') {
      return (
        <PageShell path={path} title="A sample signature" back={signatureBack}
          intro="Copy it, paste it into your signature draft, then replace each detail with your own.">
          <SignatureSample />
        </PageShell>
      );
    }
    if (sub in DEVICES) {
      const device = DEVICES[sub as Device];
      return (
        <PageShell path={path} title="How to create an email signature?"
          intro={`On your ${device.title.toLowerCase()}: ${device.subtitle}, in four steps.`} back={signatureBack}>
          <DeviceSteps device={sub as Device} />
        </PageShell>
      );
    }
  }

  const pages: Record<string, JSX.Element> = {
    linkedin: <LinkedIn />,
    handshake: <Handshake />,
    'email-signature': <EmailSignature />,
  };

  return (
    <PageShell path={path} title={guide.title} intro={guide.intro} back={back}>
      {pages[guide.slug]}
    </PageShell>
  );
}
