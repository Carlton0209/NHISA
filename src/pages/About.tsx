import { ArrowRight, ArrowUpRight, Instagram, Linkedin, Mail, Users } from 'lucide-react';
import PageShell, { SectionHeading } from '../components/PageShell';
import { AUDIENCES, CONTACT, MISSION, MODULES, PROBLEMS } from '../content/site';
import { href, newTab } from '../lib/router';

const JUMP = [
  { id: 'mission', label: 'Our mission' },
  { id: 'team', label: 'Our team' },
  { id: 'get-involved', label: 'Get involved' },
  { id: 'contact', label: 'Contact us' },
];

const mailto = (subject: string) => (CONTACT.email ? `mailto:${CONTACT.email}?subject=${encodeURIComponent(subject)}` : '');

const WAYS = [
  {
    title: 'Join as a student',
    body: 'Become an NHISA member to hear about coffee chats, workshops and new resources first.',
    action: 'Join NHISA',
    url: CONTACT.joinForm || mailto('Joining NHISA'),
  },
  {
    title: 'Share your story',
    body: 'Alumni and industry professionals: sit down for a coffee chat and help us build the Alumni Connections wall.',
    action: 'Offer a coffee chat',
    url: mailto('Coffee chat with NHISA'),
  },
  {
    title: 'Suggest a resource',
    body: 'Found a guide, tool or opportunity that helped you? Tell us and we’ll add it to the library.',
    action: 'Suggest a resource',
    url: mailto('Resource suggestion for NHISA'),
  },
];

export default function About({ path }: { path: string }) {
  const channels = [
    CONTACT.email && { label: CONTACT.email, url: `mailto:${CONTACT.email}`, Icon: Mail },
    CONTACT.instagram && { label: 'Instagram', url: CONTACT.instagram, Icon: Instagram },
    CONTACT.linkedin && { label: 'LinkedIn', url: CONTACT.linkedin, Icon: Linkedin },
  ].filter(Boolean) as { label: string; url: string; Icon: typeof Mail }[];

  return (
    <PageShell path={path} eyebrow="About Us" title="A home for Newhouse international students" intro={MISSION} jump={JUMP}>
      <div className="space-y-24">
        <section id="mission" aria-labelledby="mission-title" className="scroll-mt-36">
          <SectionHeading id="mission-title" title="Our mission" intro="Make useful resources easier to find, and valuable people and opportunities easier to reach." />
          <h3 className="mb-4 text-sm font-semibold uppercase tracking-[0.14em] text-white/50">Who we serve</h3>
          <div className="grid gap-4 md:grid-cols-2">
            {AUDIENCES.map((audience) => (
              <div key={audience.title} className="card">
                <h4 className="text-lg font-semibold text-white">{audience.title}</h4>
                <p className="mt-2 leading-relaxed text-white/65">{audience.body}</p>
              </div>
            ))}
          </div>

          <h3 className="mb-4 mt-12 text-sm font-semibold uppercase tracking-[0.14em] text-white/50">Why we exist</h3>
          <ol className="grid gap-x-10 md:grid-cols-2">
            {PROBLEMS.map((problem, index) => (
              <li key={problem} className="flex gap-4 border-b border-white/[0.08] py-4">
                <span className="font-mono text-sm text-accent">{String(index + 1).padStart(2, '0')}</span>
                <span className="leading-relaxed text-white/75">{problem}</span>
              </li>
            ))}
          </ol>

          <h3 className="mb-4 mt-12 text-sm font-semibold uppercase tracking-[0.14em] text-white/50">What we do</h3>
          <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
            {MODULES.filter((m) => m.id !== 'about').map((module) => (
              <a key={module.id} href={href(module.path)} className={`tone-${module.tone} tone-card group flex flex-col rounded-2xl p-6`}>
                <span className="text-lg font-bold tracking-tight">{module.title}</span>
                <span className="mt-2 text-sm leading-relaxed opacity-75">{module.summary}</span>
                <ArrowRight size={18} aria-hidden="true" className="mt-6 transition-transform group-hover:translate-x-1" />
              </a>
            ))}
          </div>
        </section>

        <section id="team" aria-labelledby="team-title" className="scroll-mt-36">
          <SectionHeading id="team-title" title="Our team" intro="NHISA is run by Newhouse international students." />
          <div className="card flex max-w-2xl items-center gap-5 text-white/65">
            <span className="glass-button h-12 w-12 shrink-0" aria-hidden="true">
              <Users size={20} />
            </span>
            Team profiles are on the way.
          </div>
        </section>

        <section id="get-involved" aria-labelledby="involved-title" className="scroll-mt-36">
          <SectionHeading id="involved-title" title="Get involved" intro="Three ways to help NHISA grow." />
          <div className="grid gap-4 md:grid-cols-3">
            {WAYS.map((way) => (
              <div key={way.title} className="card flex flex-col">
                <h3 className="text-lg font-semibold text-white">{way.title}</h3>
                <p className="mt-2 leading-relaxed text-white/65">{way.body}</p>
                <div className="mt-auto pt-6">
                  {way.url ? (
                    <a href={way.url} {...newTab(way.url)} className="glass-button px-5 py-2.5">
                      {way.action}
                      <ArrowUpRight size={15} aria-hidden="true" />
                    </a>
                  ) : (
                    <span className="text-sm text-white/45">Sign-ups open soon.</span>
                  )}
                </div>
              </div>
            ))}
          </div>
        </section>

        <section id="contact" aria-labelledby="contact-title" className="scroll-mt-36">
          <SectionHeading id="contact-title" title="Contact us" />
          {channels.length ? (
            <ul className="flex flex-wrap gap-3">
              {channels.map(({ label, url, Icon }) => (
                <li key={label}>
                  <a href={url} {...newTab(url)} className="glass-button px-5 py-3">
                    <Icon size={17} aria-hidden="true" />
                    {label}
                  </a>
                </li>
              ))}
            </ul>
          ) : (
            <div className="card max-w-2xl text-white/65">We’re setting up our contact channels. Check back soon.</div>
          )}
        </section>
      </div>
    </PageShell>
  );
}
