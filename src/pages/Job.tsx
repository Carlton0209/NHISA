import { ArrowUpRight } from 'lucide-react';
import PageShell, { SectionHeading } from '../components/PageShell';
import { ResourceGroups } from '../components/ResourceCard';
import TopicCard from '../components/TopicCard';
import { CAREER_PLANNING, JOB_SEARCH, JOB_TOPICS, TOOLKITS } from '../content/job';
import { DEVICES, type Device } from '../content/email';
import LinkedIn from './job/LinkedIn';
import Handshake from './job/Handshake';
import { DeviceSteps, EmailSignature, SignatureSample } from './job/EmailSignature';

const SUBNAV = [
  { label: 'Overview', path: '/job' },
  ...JOB_TOPICS.map((topic) => ({ label: topic.title, path: `/job/${topic.slug}` })),
];

export function jobTitle(route: string) {
  const [, , slug, sub] = route.split('/');
  const topic = JOB_TOPICS.find((t) => t.slug === slug);
  if (!topic) return 'Job Knowledge';
  if (sub === 'sample') return 'Sample signature · Email Signature';
  if (sub && sub in DEVICES) return `${DEVICES[sub as Device].title} · Email Signature`;
  return `${topic.title} · Job Knowledge`;
}

function Toolkits() {
  return (
    <section aria-labelledby="toolkits" className="mt-20">
      <SectionHeading
        id="toolkits"
        title="NHISA toolkits"
        intro="Our long-form guides, with exercises and templates you can fill in. They open as Google Docs."
      />
      <div className="grid gap-4 lg:grid-cols-3">
        {TOOLKITS.map((kit) => (
          <a key={kit.url} href={kit.url} target="_blank" rel="noopener noreferrer" className="card card-link group flex flex-col">
            <span className="font-mono text-xs text-ember">{kit.number}</span>
            <h3 className="mt-4 text-xl font-semibold text-white">{kit.name}</h3>
            <p className="mt-3 leading-relaxed text-white/65">{kit.intro}</p>
            <span className="mt-auto flex items-center gap-2 pt-6 text-sm text-white/50 group-hover:text-white">
              Open the toolkit
              <ArrowUpRight size={16} aria-hidden="true" />
              <span className="sr-only">(opens in a new tab)</span>
            </span>
          </a>
        ))}
      </div>
    </section>
  );
}

export default function Job({ route }: { route: string }) {
  const [, , slug, sub] = route.split('/');
  const topic = JOB_TOPICS.find((t) => t.slug === slug);

  if (!topic) {
    return (
      <PageShell
        route={route}
        eyebrow="Job Knowledge"
        title="Get career-ready, one step at a time"
        intro="Practical guides for building a professional presence, finding opportunities and applying with confidence."
        subnav={SUBNAV}
      >
        <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
          {JOB_TOPICS.map((t, index) => (
            <TopicCard key={t.slug} path={`/job/${t.slug}`} index={index} title={t.title} summary={t.summary} />
          ))}
        </div>
        <Toolkits />
      </PageShell>
    );
  }

  if (topic.slug === 'email-signature' && sub) {
    const back = { label: 'Email Signature', path: '/job/email-signature' };
    if (sub === 'sample') {
      return (
        <PageShell route={route} eyebrow="Email Signature" title="A sample signature" back={back}
          intro="Copy it, paste it into your signature draft, then replace each detail with your own.">
          <SignatureSample />
        </PageShell>
      );
    }
    if (sub in DEVICES) {
      const device = DEVICES[sub as Device];
      return (
        <PageShell route={route} eyebrow={`Email Signature · ${device.title}`} title="How to create an email signature?"
          intro={`${device.subtitle}, in four steps.`} back={back}>
          <DeviceSteps device={sub as Device} />
        </PageShell>
      );
    }
  }

  const pages: Record<string, JSX.Element> = {
    linkedin: <LinkedIn />,
    handshake: <Handshake />,
    'email-signature': <EmailSignature />,
    'job-search': <ResourceGroups groups={JOB_SEARCH} numbered />,
    'career-planning': <ResourceGroups groups={CAREER_PLANNING} numbered />,
  };

  return (
    <PageShell route={route} eyebrow="Job Knowledge" title={topic.title} intro={topic.intro} subnav={SUBNAV}>
      {pages[topic.slug]}
    </PageShell>
  );
}
