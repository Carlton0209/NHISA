import { ArrowRight } from 'lucide-react';
import RevealLayer from '../components/RevealLayer';
import ModuleCarousel from '../components/ModuleCarousel';
import ModuleArt from '../components/ModuleArt';
import { SectionHeading } from '../components/PageShell';
import { CAMPUS_SECTIONS } from '../content/campus';
import { CAREER_STEPS } from '../content/careerHub';
import { ALUMNI_SECTIONS } from '../content/alumni';
import { MODULES } from '../content/site';
import { href } from '../lib/router';
import heroAutumn from '../assets/hero-autumn.jpg';
import heroWinter from '../assets/hero-winter.jpg';

// What each module contains, as links straight into its sections.
const MODULE_LINKS: Record<string, { label: string; path: string; section?: string }[]> = {
  campus: CAMPUS_SECTIONS.map((s) => ({ label: s.title, path: '/campus', section: s.id })),
  'career-hub': CAREER_STEPS.map((s, i) => ({ label: `Step ${i + 1} · ${s.title}`, path: '/career-hub', section: s.id })),
  'career-access': [
    { label: 'Job & internship search', path: '/career-access' },
    { label: 'International student services', path: '/career-access' },
    { label: 'AI & practice tools', path: '/career-access' },
    { label: 'Guides & toolkits', path: '/career-access' },
  ],
  alumni: ALUMNI_SECTIONS.map((s) => ({ label: s.label, path: '/alumni', section: s.id })),
};

export default function Home() {
  return (
    <>
      <section className="hero" aria-label="NHISA campus, autumn and winter">
        <div className="hero-scene" aria-hidden="true">
          <RevealLayer autumnImage={heroAutumn} winterImage={heroWinter} />
        </div>
        <div className="hero-scrim" aria-hidden="true" />

        <div className="hero-anim absolute inset-x-0 top-[17%] z-50 mx-auto max-w-4xl px-5 text-center sm:top-[19%]">
          <h1 tabIndex={-1} data-page-title className="hero-title text-5xl font-extrabold leading-[1.02] tracking-[-0.04em] text-white outline-none sm:text-7xl">
            Find your path.
            <br />
            Find your people.
          </h1>
          <p className="hero-title mx-auto mt-6 max-w-2xl text-base leading-relaxed text-white/85 sm:text-lg">
            NHISA is a community and career hub for Newhouse international students and alumni: the resources, people and
            opportunities you need, in one place.
          </p>
        </div>

        <div className="hero-anim-late absolute inset-x-0 bottom-[20%] z-50 flex justify-center px-5">
          <a href={href('/', 'modules')} className="glass-button px-9 py-3.5 text-base">
            Start Exploring
          </a>
        </div>
      </section>

      <main id="main" className="relative z-10 mx-auto w-full max-w-6xl px-5 sm:px-8">
        <section id="modules" aria-labelledby="modules-title" className="scroll-mt-24 pt-24">
          <SectionHeading
            id="modules-title"
            label="What’s inside"
            title="Everything you need, in one place"
            intro="Five sections built around what Newhouse international students ask us most. Flip through, or pick one below."
          />
          <ModuleCarousel />
        </section>

        <div className="mt-28 space-y-24 sm:space-y-32">
          {MODULES.filter((m) => MODULE_LINKS[m.id]).map((module, index) => (
            <section
              key={module.id}
              aria-labelledby={`module-${module.id}`}
              className={`grid items-center gap-10 md:grid-cols-2 md:gap-16 ${index % 2 ? 'md:[&>*:first-child]:order-2' : ''}`}
            >
              <div>
                <p className="font-mono text-xs uppercase tracking-[0.16em] text-accent">{String(index + 1).padStart(2, '0')}</p>
                <h2 id={`module-${module.id}`} className="mt-3 text-3xl font-bold tracking-tight text-white sm:text-4xl">
                  {module.title}
                </h2>
                <p className="mt-4 text-lg leading-relaxed text-white/65">{module.summary}</p>
                <ul className="mt-6 space-y-1">
                  {MODULE_LINKS[module.id].map((link) => (
                    <li key={link.label}>
                      <a
                        href={href(link.path, link.section)}
                        className="group flex items-center justify-between gap-4 border-b border-white/[0.08] py-3 text-white/80 transition-colors hover:text-white"
                      >
                        {link.label}
                        <ArrowRight size={16} aria-hidden="true" className="text-white/35 transition-transform group-hover:translate-x-1 group-hover:text-accent" />
                      </a>
                    </li>
                  ))}
                </ul>
                <a href={href(module.path)} className="glass-button mt-8 px-6 py-3">
                  Explore {module.title}
                </a>
              </div>
              <div aria-hidden="true" className={`tone-${module.tone} tone-card aspect-[16/11] rounded-[2rem] p-8`}>
                <div className="h-full rounded-2xl bg-white/50 p-5">
                  <ModuleArt id={module.id} />
                </div>
              </div>
            </section>
          ))}
        </div>

        <section aria-labelledby="join-title" className="mt-28 rounded-[2rem] border border-white/10 bg-gradient-to-br from-accent/[0.14] via-white/[0.03] to-transparent p-8 sm:p-12">
          <h2 id="join-title" className="max-w-2xl text-3xl font-bold tracking-tight text-white sm:text-4xl">
            Built by Newhouse international students, for the ones who come next.
          </h2>
          <p className="mt-4 max-w-2xl text-lg leading-relaxed text-white/65">
            Join as a student, share your story as an alum, or point us to a resource we’re missing.
          </p>
          <div className="mt-8 flex flex-wrap gap-3">
            <a href={href('/about', 'get-involved')} className="glass-button px-6 py-3">Get involved</a>
            <a href={href('/about', 'mission')} className="glass-button px-6 py-3 text-white/80">Our mission</a>
          </div>
        </section>
      </main>
    </>
  );
}
