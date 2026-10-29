import RevealLayer from '../components/RevealLayer';
import ModuleCarousel from '../components/ModuleCarousel';
import ModuleStory, { type StoryLink } from '../components/ModuleStory';
import { SectionHeading } from '../components/PageShell';
import { ALUMNI_SECTIONS } from '../content/alumni';
import { CAMPUS_SECTIONS } from '../content/campus';
import { CAREER_STEPS } from '../content/careerHub';
import { href } from '../lib/router';
import heroAutumn from '../assets/hero-autumn.webp';
import heroWinter from '../assets/hero-winter.webp';

// What each module contains, as links straight into its sections.
const MODULE_LINKS: Record<string, StoryLink[]> = {
  campus: CAMPUS_SECTIONS.map((s) => ({ label: s.title, path: '/campus', section: s.id })),
  'career-hub': CAREER_STEPS.map((s, i) => ({ label: `${i + 1}. ${s.title}`, path: '/career-hub', section: s.id })),
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
      {/* The hero pins while you scroll and winter settles over the campus. */}
      <div className="hero-track">
        <section className="hero" aria-label="NHISA campus, autumn and winter">
          <div className="hero-scene" aria-hidden="true">
            <RevealLayer autumnImage={heroAutumn} winterImage={heroWinter} />
          </div>
          <div className="hero-scrim" aria-hidden="true" />
          <div className="hero-dusk" aria-hidden="true" />

          <h1 tabIndex={-1} data-page-title className="sr-only">
            NHISA: a community and career hub for Newhouse international students and alumni
          </h1>

          <div className="hero-copy absolute inset-x-0 bottom-[20%] z-50 flex justify-center px-5">
            <a href={href('/', 'modules')} className="glass-button rise-in px-9 py-3.5 text-base">
              Start Exploring
            </a>
          </div>
        </section>
      </div>

      <main id="main" className="relative z-10 mx-auto w-full max-w-6xl px-5 sm:px-8">
        <section id="modules" aria-labelledby="modules-title" className="scroll-mt-24 pt-20 sm:pt-28">
          <SectionHeading
            id="modules-title"
            title="Everything you need, in one place"
            intro="Five sections built around what Newhouse international students ask us most. Flip through, or read on."
          />
          <ModuleCarousel />
        </section>

        <div className="mt-28 sm:mt-36">
          <ModuleStory links={MODULE_LINKS} autumn={heroAutumn} winter={heroWinter} />
        </div>

        <section aria-labelledby="join-title" className="panel mt-28 bg-gradient-to-br from-accent/[0.12] via-white/[0.02] to-transparent sm:mt-36 sm:p-14">
          <h2 id="join-title" className="t-heading max-w-2xl text-white">
            Built by Newhouse international students, for the ones who come next.
          </h2>
          <p className="t-lede mt-5 max-w-2xl">Join as a student, share your story as an alum, or point us to a resource we’re missing.</p>
          <div className="mt-9 flex flex-wrap gap-3">
            <a href={href('/about', 'get-involved')} className="glass-button px-6 py-3">Get involved</a>
            <a href={href('/about', 'mission')} className="glass-button px-6 py-3 text-white/80">Our mission</a>
          </div>
        </section>
      </main>
    </>
  );
}
