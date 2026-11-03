import PageShell from '../components/PageShell';
import { SectionList } from '../components/Resources';
import { CAREER_STEPS } from '../content/careerHub';
import { DEVICES, type Device } from '../content/email';
import { GUIDES } from '../content/guides';
import { t } from '../lib/i18n';
import LinkedIn from './guides/LinkedIn';
import Handshake from './guides/Handshake';
import { DeviceSteps, EmailSignature, SignatureSample } from './guides/EmailSignature';

const TOTAL = new Set(CAREER_STEPS.flatMap((s) => s.groups.flatMap((g) => g.ids))).size;

// The Career Hub step each guide belongs to, for its back link.
const GUIDE_STEP: Record<string, string> = { linkedin: 'profile', handshake: 'opportunities', 'email-signature': 'profile' };

export function careerHubTitle(path: string) {
  const [, , slug, sub] = path.split('/');
  const guide = GUIDES.find((g) => g.slug === slug);
  if (!guide) return t('Career Hub');
  if (sub === 'sample') return `${t('Sample signature')} · ${t('Email Signature')}`;
  if (sub && sub in DEVICES) return `${t(DEVICES[sub as Device].title)} · ${t('Email Signature')}`;
  return `${t(guide.title)} · ${t('Career Hub')}`;
}

export default function CareerHub({ path }: { path: string }) {
  const [, , slug, sub] = path.split('/');
  const guide = GUIDES.find((g) => g.slug === slug);

  if (!guide) {
    return (
      <PageShell
        path={path}
        title={t('Your job search, step by step')}
        intro={t('From zero to offer. Each step has a short guide and the resources for it.')}
        meta={t('{steps} steps · {resources} resources', { steps: CAREER_STEPS.length, resources: TOTAL })}
        jump={CAREER_STEPS.map((step) => ({ id: step.id, label: t(step.title) }))}
      >
        <SectionList sections={CAREER_STEPS} numbered />
      </PageShell>
    );
  }

  const back = { label: t('Career Hub'), path: '/career-hub', section: GUIDE_STEP[guide.slug] };

  if (guide.slug === 'email-signature' && sub) {
    const signatureBack = { label: t('Email Signature'), path: '/career-hub/email-signature' };
    if (sub === 'sample') {
      return (
        <PageShell path={path} title={t('A sample signature')} back={signatureBack} compact
          intro={t('Copy it, paste it into Outlook, and swap in your details.')}>
          <SignatureSample />
        </PageShell>
      );
    }
    if (sub in DEVICES) {
      const device = DEVICES[sub as Device];
      return (
        <PageShell path={path} title={t('Create your email signature')} compact
          intro={t(sub === 'phone' ? 'On your phone: {app}, in four steps.' : 'On your laptop: {app}, in four steps.', { app: t(device.subtitle) })}
          back={signatureBack}>
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
    <PageShell path={path} title={t(guide.title)} intro={t(guide.intro)} back={back}>
      {pages[guide.slug]}
    </PageShell>
  );
}
