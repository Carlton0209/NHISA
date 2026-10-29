import { ArrowRight, ArrowUpRight, Instagram, Linkedin, Mail } from 'lucide-react';
import PageShell from '../components/PageShell';
import Topic from '../components/Topic';
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

const subheading = 'mb-5 text-[var(--step-lead)] font-medium text-white';

export default function About({ path }: { path: string }) {
  const channels = [
    CONTACT.email && { label: CONTACT.email, url: `mailto:${CONTACT.email}`, Icon: Mail },
    CONTACT.instagram && { label: 'Instagram', url: CONTACT.instagram, Icon: Instagram },
    CONTACT.linkedin && { label: 'LinkedIn', url: CONTACT.linkedin, Icon: Linkedin },
  ].filter(Boolean) as { label: string; url: string; Icon: typeof Mail }[];

  return (
    <PageShell path={path} title="Built by students" intro={MISSION} jump={JUMP}>
      <div className="space-y-28 sm:space-y-36">
        <Topic id="mission" photo="hall" title="Our mission" intro="Make useful resources easier to find, and valuable people and opportunities easier to reach.">
          <div className="space-y-14">
            <div>
              <h3 className={subheading}>Who we serve</h3>
              <div className="grid gap-x-10 gap-y-8 sm:grid-cols-2">
                {AUDIENCES.map((audience) => (
                  <div key={audience.title}>
                    <h4 className="text-[1.0625rem] font-semibold text-white">{audience.title}</h4>
                    <p className="t-body mt-2">{audience.body}</p>
                  </div>
                ))}
              </div>
            </div>

            <div>
              <h3 className={subheading}>Why we exist</h3>
              <ul className="space-y-5">
                {PROBLEMS.map((problem) => (
                  <li key={problem} className="t-lede">
                    {problem}
                  </li>
                ))}
              </ul>
            </div>

            <div>
              <h3 className={subheading}>What we do</h3>
              <ul className="space-y-1">
                {MODULES.filter((m) => m.id !== 'about').map((module) => (
                  <li key={module.id}>
                    <a href={href(module.path)} className="row -mx-4 grid grid-cols-[1fr_auto] items-start gap-x-6 rounded-2xl px-4 py-6">
                      <span>
                        <span data-vt-title className="row-title block text-[1.0625rem] font-semibold text-white">{module.title}</span>
                        <span className="t-body mt-1.5 block">{module.summary}</span>
                      </span>
                      <ArrowRight size={18} aria-hidden="true" className="row-arrow is-forward mt-1 text-accent" />
                    </a>
                  </li>
                ))}
              </ul>
            </div>
          </div>
        </Topic>

        <Topic id="team" photo="quad" photoBelow title="Our team" intro="NHISA is run by Newhouse international students.">
          <div className="panel t-body">Team profiles are on the way.</div>
        </Topic>

        <Topic id="get-involved" photo="school" title="Get involved" intro="Three ways to help NHISA grow.">
          <ul className="space-y-3">
            {WAYS.map((way) => (
              <li key={way.title} className="grid gap-4 rounded-2xl bg-[var(--surface)] p-6 sm:grid-cols-[1fr_auto] sm:items-center sm:gap-8">
                <div>
                  <h3 className="text-[1.0625rem] font-semibold text-white">{way.title}</h3>
                  <p className="t-body mt-1.5">{way.body}</p>
                </div>
                {way.url ? (
                  <a href={way.url} {...newTab(way.url)} className="glass-button justify-self-start px-5 py-2.5">
                    {way.action}
                    <ArrowUpRight size={15} aria-hidden="true" />
                  </a>
                ) : (
                  <span className="t-meta">Sign-ups open soon</span>
                )}
              </li>
            ))}
          </ul>
        </Topic>

        <Topic id="contact" title="Contact us">
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
            <div className="panel t-body">We’re setting up our contact channels. Check back soon.</div>
          )}
        </Topic>
      </div>
    </PageShell>
  );
}
