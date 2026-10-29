import { useState } from 'react';
import { ArrowRight, ArrowUpRight, MapPin, Quote, User } from 'lucide-react';
import PageShell, { SectionHeading } from '../components/PageShell';
import { ALUMNI, ALUMNI_SECTIONS, EVENTS, type Alumnus } from '../content/alumni';
import { href } from '../lib/router';

export function alumniTitle(path: string) {
  const person = ALUMNI.find((a) => path === `/alumni/${a.id}`);
  return person ? `${person.name} · Alumni Connections` : 'Alumni Connections';
}

function ShareYourStory({ className = '' }: { className?: string }) {
  return (
    <a
      href={href('/about', 'get-involved')}
      className={`card card-link group flex flex-col justify-between border-accent/30 bg-accent/[0.07] ${className}`}
    >
      <span>
        <span className="block text-lg font-semibold text-white">Are you a Newhouse alum?</span>
        <span className="mt-2 block leading-relaxed text-white/65">
          Share your story over a coffee chat and help the next class of international students find their way.
        </span>
      </span>
      <span className="mt-6 flex items-center gap-2 text-sm font-medium text-accent">
        Get involved
        <ArrowRight size={16} aria-hidden="true" className="transition-transform group-hover:translate-x-1" />
      </span>
    </a>
  );
}

function PhotoWall() {
  const industries = [...new Set(ALUMNI.map((a) => a.industry))].sort();
  const [industry, setIndustry] = useState<string | null>(null);
  const people = industry ? ALUMNI.filter((a) => a.industry === industry) : ALUMNI;

  if (!ALUMNI.length) {
    return (
      <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
        {[0, 1, 2].map((i) => (
          <div key={i} aria-hidden="true" className="flex aspect-[4/5] flex-col items-center justify-center gap-3 rounded-2xl border border-dashed border-white/15 text-white/30">
            <User size={36} />
            <span className="text-sm">Coming soon</span>
          </div>
        ))}
        <ShareYourStory className="aspect-auto lg:aspect-[4/5]" />
        <p className="text-white/55 sm:col-span-2 lg:col-span-4">
          Our first coffee chats are being written up. Every alum and professional we meet gets a place on this wall.
        </p>
      </div>
    );
  }

  return (
    <>
      {industries.length > 1 && (
        <div className="no-scrollbar -mx-5 mb-8 flex gap-2 overflow-x-auto px-5 sm:mx-0 sm:px-0" role="group" aria-label="Filter by industry">
          {[null, ...industries].map((value) => (
            <button
              key={value ?? 'all'}
              type="button"
              onClick={() => setIndustry(value)}
              aria-pressed={industry === value}
              className={`glass-button shrink-0 px-4 py-2 ${industry === value ? '' : 'text-white/75 hover:text-white'}`}
            >
              {value ?? 'All industries'}
            </button>
          ))}
        </div>
      )}
      <ul className="grid gap-x-4 gap-y-10 sm:grid-cols-2 lg:grid-cols-4">
        {people.map((person) => (
          <li key={person.id}>
            <a href={href(`/alumni/${person.id}`)} className="group block">
              <span className="block aspect-[4/5] overflow-hidden rounded-2xl bg-night-800">
                <img
                  src={person.photo}
                  alt={person.photoAlt}
                  loading="lazy"
                  className="h-full w-full object-cover grayscale transition duration-500 group-hover:scale-[1.03] group-hover:grayscale-0"
                />
              </span>
              <span className="mt-4 block text-lg font-semibold text-white">{person.name}</span>
              <span className="block text-sm text-white/60">
                {person.role}, {person.organization}
              </span>
              <span className="mt-1 block text-xs uppercase tracking-[0.14em] text-accent">{person.industry}</span>
            </a>
          </li>
        ))}
        <li>
          <ShareYourStory className="h-full" />
        </li>
      </ul>
    </>
  );
}

function Stories() {
  const withAdvice = ALUMNI.filter((a) => a.advice);
  if (!withAdvice.length) {
    return <div className="card max-w-2xl text-white/60">Advice from our first coffee chats will appear here.</div>;
  }
  return (
    <div className="grid gap-4 md:grid-cols-2">
      {withAdvice.map((person) => (
        <a key={person.id} href={href(`/alumni/${person.id}`)} className="card card-link flex flex-col">
          <Quote size={22} aria-hidden="true" className="text-accent" />
          <p className="mt-4 text-lg leading-relaxed text-white/85">{person.advice}</p>
          <span className="mt-6 text-sm text-white/55">
            {person.name} · {person.role}, {person.organization}
          </span>
        </a>
      ))}
    </div>
  );
}

function Events() {
  const today = new Date().toISOString().slice(0, 10);
  const upcoming = EVENTS.filter((e) => e.date >= today).sort((a, b) => a.date.localeCompare(b.date));
  if (!upcoming.length) {
    return (
      <div className="card flex max-w-2xl flex-col gap-4 text-white/60 sm:flex-row sm:items-center sm:justify-between">
        <span>No coffee chats are scheduled right now. Get involved to hear about the next one.</span>
        <a href={href('/about', 'get-involved')} className="glass-button shrink-0 px-5 py-2.5">Get involved</a>
      </div>
    );
  }
  return (
    <ul className="space-y-4">
      {upcoming.map((event) => (
        <li key={event.id} className="card grid gap-4 sm:grid-cols-[8rem_1fr_auto] sm:items-center">
          <p className="font-mono text-sm text-accent">
            {new Date(`${event.date}T12:00:00`).toLocaleDateString('en-US', { month: 'short', day: 'numeric', weekday: 'short' })}
            {event.time && <span className="block text-white/50">{event.time}</span>}
          </p>
          <div>
            <h3 className="text-lg font-semibold text-white">{event.title}</h3>
            <p className="mt-1 text-white/60">{event.description}</p>
            <p className="mt-2 flex items-center gap-1.5 text-sm text-white/45">
              <MapPin size={14} aria-hidden="true" />
              {event.location}
            </p>
          </div>
          {event.signupUrl && (
            <a href={event.signupUrl} target="_blank" rel="noopener noreferrer" className="glass-button px-5 py-2.5">
              Sign up
              <ArrowUpRight size={15} aria-hidden="true" />
              <span className="sr-only">(opens in a new tab)</span>
            </a>
          )}
        </li>
      ))}
    </ul>
  );
}

function Profile({ path, person }: { path: string; person: Alumnus }) {
  const facts = [
    ['Newhouse', `${person.program}, ${person.classOf}`],
    ['Based in', person.location],
    ['Industry', person.industry],
    ...(person.chatDate
      ? [['Coffee chat', new Date(`${person.chatDate}T12:00:00`).toLocaleDateString('en-US', { month: 'long', year: 'numeric' })]]
      : []),
  ];
  return (
    <PageShell
      path={path}
      eyebrow={person.industry}
      title={person.name}
      intro={`${person.role}, ${person.organization}`}
      back={{ label: 'Alumni Connections', path: '/alumni' }}
    >
      <div className="grid gap-12 lg:grid-cols-[22rem_1fr]">
        <div className="lg:sticky lg:top-28 lg:self-start">
          <img src={person.photo} alt={person.photoAlt} className="aspect-[4/5] w-full rounded-2xl object-cover" />
          <dl className="mt-6 divide-y divide-white/[0.08] text-sm">
            {facts.map(([term, value]) => (
              <div key={term} className="flex justify-between gap-4 py-3">
                <dt className="text-white/50">{term}</dt>
                <dd className="text-right text-white/85">{value}</dd>
              </div>
            ))}
          </dl>
          {person.linkedin && (
            <a href={person.linkedin} target="_blank" rel="noopener noreferrer" className="glass-button mt-6 w-full px-5 py-3">
              Connect on LinkedIn
              <ArrowUpRight size={15} aria-hidden="true" />
              <span className="sr-only">(opens in a new tab)</span>
            </a>
          )}
        </div>
        <article>
          <p className="text-2xl font-semibold leading-snug tracking-tight text-white sm:text-3xl">“{person.headline}”</p>
          <p className="mt-8 text-lg leading-relaxed text-white/70">{person.intro}</p>
          <div className="mt-12 space-y-10">
            {person.questions.map((qa) => (
              <section key={qa.question}>
                <h2 className="text-lg font-semibold text-accent">{qa.question}</h2>
                <p className="mt-3 leading-relaxed text-white/75">{qa.answer}</p>
              </section>
            ))}
          </div>
          {person.advice && (
            <aside className="card mt-12 border-accent/30 bg-accent/[0.07]">
              <p className="text-xs font-semibold uppercase tracking-[0.16em] text-accent">Advice for international students</p>
              <p className="mt-3 text-lg leading-relaxed text-white/85">{person.advice}</p>
            </aside>
          )}
        </article>
      </div>
    </PageShell>
  );
}

export default function Alumni({ path }: { path: string }) {
  const id = path.split('/')[2];
  if (id) {
    const person = ALUMNI.find((a) => a.id === id);
    if (person) return <Profile path={path} person={person} />;
    return (
      <PageShell path={path} eyebrow="Alumni Connections" title="We couldn’t find that profile"
        intro="It may have moved, or it hasn’t been published yet." back={{ label: 'Alumni Connections', path: '/alumni' }}>
        <ShareYourStory className="max-w-md" />
      </PageShell>
    );
  }

  return (
    <PageShell
      path={path}
      eyebrow="Alumni Connections"
      title="Learn from people who’ve been where you are"
      intro="Every coffee chat with a Newhouse alum or industry professional becomes a profile here: their time at school, their U.S. job search, and their advice for international students."
      jump={ALUMNI_SECTIONS}
    >
      <div className="space-y-24">
        <section id="meet" aria-labelledby="meet-title" className="scroll-mt-36">
          <SectionHeading
            id="meet-title"
            title="Meet Alumni & Professionals"
            intro={ALUMNI.length ? 'Filter by industry, then open a profile to read the full conversation.' : 'Each coffee chat becomes a profile you can open to read the full conversation.'}
          />
          <PhotoWall />
        </section>
        <section id="stories" aria-labelledby="stories-title" className="scroll-mt-36">
          <SectionHeading id="stories-title" title="Career Stories & Advice" intro="The one thing each person wishes they had known as an international student." />
          <Stories />
        </section>
        <section id="events" aria-labelledby="events-title" className="scroll-mt-36">
          <SectionHeading id="events-title" title="Events & Coffee Chats" intro="Small-group chats with alumni and professionals, open to NHISA members." />
          <Events />
        </section>
      </div>
    </PageShell>
  );
}
