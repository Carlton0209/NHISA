import { ArrowRight } from 'lucide-react';
import RevealLayer from '../components/RevealLayer';
import { BLOCK_S_CLIP } from '../components/Brand';
import { CAMPUS_SECTIONS } from '../content/campus';
import { CAREER_STEPS } from '../content/careerHub';
import { RESOURCES } from '../content/resources';
import { AUDIENCES, CHAPTERS, MISSION, MODULES } from '../content/site';
import { href } from '../lib/router';
import heroAutumn from '../assets/hero-autumn.webp';
import heroWinter from '../assets/hero-winter.webp';
import hallOfLanguages from '../assets/found/hall-of-languages.webp';
import newhouseStudios from '../assets/found/newhouse-2-studios.webp';
import birdLibrary from '../assets/found/bird-library.webp';
import shawQuad from '../assets/found/shaw-quad.webp';
import newhouseSchool from '../assets/found/newhouse-school.webp';
import crouseCollege from '../assets/found/crouse-college.webp';

const RESOURCE_COUNT = Object.keys(RESOURCES).length;

// The poster list: each section as one giant line, with its one fact.
const POSTER: Record<string, string> = {
  campus: `${CAMPUS_SECTIONS.length} areas of campus life`,
  'career-hub': `${CAREER_STEPS.length} steps to an offer`,
  'career-access': `${RESOURCE_COUNT} resources, searchable`,
  alumni: 'Coffee chats and stories',
  about: 'Mission, team, how to join',
};

// One chapter per module, each with a real picture of the campus. The composition
// alternates so no two chapters in a row look alike.
const SHOWCASE: { id: string; layout: 'right' | 'left' | 'wide'; src: string; position: string; alt: string; sentence: string }[] = [
  {
    id: 'campus',
    layout: 'right',
    src: hallOfLanguages,
    position: '50% 40%',
    alt: 'The Hall of Languages, Syracuse University’s first building, seen across the lawn',
    sentence: 'Advising, international student services, student life and study away.',
  },
  {
    id: 'career-hub',
    layout: 'wide',
    src: newhouseStudios,
    position: '40% 50%',
    alt: 'The glass front of the Dick Clark Studios in Newhouse 2',
    sentence: 'Six steps from your first LinkedIn profile to the thank-you email.',
  },
  {
    id: 'career-access',
    layout: 'left',
    src: birdLibrary,
    position: '50% 8%',
    alt: 'Bird Library, Syracuse University’s main library',
    sentence: `All ${RESOURCE_COUNT} resources in one library you can search and filter.`,
  },
  {
    id: 'alumni',
    layout: 'wide',
    src: shawQuad,
    position: '45% 50%',
    alt: 'Students and alumni gathered under a tent on the Shaw Quad',
    sentence: 'Alumni and professionals, met over coffee, sharing what they learned.',
  },
];

const title = (id: string) => MODULES.find((m) => m.id === id)!;

export default function Home() {
  return (
    <>
      {/* The hero pins while you scroll and winter settles over the campus. */}
      <div className="hero-track" data-ink="dark">
        <section className="hero" aria-label="NHISA campus, autumn and winter">
          {/* The photograph itself, under the canvas that blends in winter. */}
          <img
            src={heroAutumn}
            alt="The Newhouse building’s curved glass front behind autumn trees, under a cloudy sky"
            className="scenery"
            fetchPriority="high"
          />
          <div className="hero-scene" aria-hidden="true">
            <RevealLayer autumnImage={heroAutumn} winterImage={heroWinter} />
          </div>
          <div className="hero-scrim" aria-hidden="true" />
          <div className="hero-dusk" aria-hidden="true" />
          <h1 tabIndex={-1} data-page-title className="sr-only">
            NHISA: a community and career hub for Newhouse international students and alumni
          </h1>
          <div className="hero-copy absolute inset-x-0 bottom-[20%] z-50 flex justify-center px-5 text-white">
            <a href={href('/', 'modules')} className="glass-button rise-in px-9 py-3.5 text-base">
              Start Exploring
            </a>
          </div>
        </section>
      </div>

      <main id="main" className="relative z-10">
        {/* Statement tiles: what NHISA is, before anything else. */}
        <section aria-labelledby="intro-title" className="frame pt-6" data-ink="dark">
          <div className="grid gap-2 md:grid-cols-12 md:grid-rows-[38svh_38svh]">
            <div className="field-careers flex min-h-[46svh] items-end rounded-[1.25rem] p-5 md:col-span-8 md:row-span-2 md:min-h-0 md:p-8">
              <h2 id="intro-title" data-reveal className="t-display">
                Find your
                <br />
                people.
              </h2>
            </div>
            <div className="grid grid-cols-2 gap-2 md:contents">
              <div className="field-about flex aspect-square flex-col justify-end rounded-[1.25rem] p-5 md:col-span-4 md:aspect-auto md:p-8">
                <p data-reveal className="tnum t-display">{RESOURCE_COUNT}</p>
                <p data-reveal="2" className="mt-3 text-[var(--step-small)] font-medium">resources, gathered in one library</p>
              </div>
              <div className="pic-in aspect-square overflow-hidden rounded-[1.25rem] md:col-span-4 md:aspect-auto">
                <img src={newhouseSchool} alt="The S.I. Newhouse School of Public Communications on a summer day" loading="lazy" className="h-full w-full object-cover" />
              </div>
            </div>
          </div>
          <div className="grid py-16 md:grid-cols-12 md:py-28">
            <p data-reveal className="t-lede md:col-span-6 md:col-start-7">
              {MISSION} We serve two groups: Newhouse international students, who are learning how the U.S. job search works, and
              alumni and industry professionals, who share their experience, guidance and opportunities with the next class.
            </p>
          </div>
        </section>

        {/* The sections as a poster: giant words left, one fact right. */}
        <nav id="modules" aria-labelledby="modules-title" className="frame scroll-mt-0 pb-28 pt-8 md:pb-40" data-ink="dark">
          <h2 id="modules-title" className="sr-only">The five sections of NHISA</h2>
          <ul>
            {MODULES.map((module, index) => (
              <li key={module.id} data-reveal={String(Math.min(index + 1, 4))}>
                <a href={href(module.path)} className="poster-line group grid items-baseline gap-x-6 md:grid-cols-[1fr_auto]">
                  <span data-vt-title className="t-display block">{module.short}</span>
                  <span className="tnum mb-5 mt-1.5 block text-[var(--step-body)] md:mb-0 md:mt-0">
                    {POSTER[module.id]}
                    <ArrowRight size={18} aria-hidden="true" className="ml-2 inline-block align-[-3px] transition-transform duration-500 group-hover:translate-x-1" />
                  </span>
                </a>
              </li>
            ))}
          </ul>
        </nav>

        {/* One chapter per module, each on its own field with its own picture. */}
        {SHOWCASE.map((chapter) => {
          const module = title(chapter.id);
          const { field, light } = CHAPTERS[chapter.id];
          const left = chapter.layout === 'left';
          const textColumn = left ? 'md:col-start-8' : 'md:col-start-1';
          const heading = (className: string) => (
            <h2 id={`chapter-${chapter.id}`} data-reveal className={`t-heading ${className}`}>
              {module.title}
            </h2>
          );
          const picture = (className: string) => (
            <div className={`pic-in overflow-hidden rounded-[1.25rem] ${className}`}>
              <img src={chapter.src} alt={chapter.alt} loading="lazy" className="h-full w-full object-cover" style={{ objectPosition: chapter.position }} />
            </div>
          );
          const close = (className: string) => (
            <div className={`flex flex-col items-start gap-6 ${className}`}>
              <p data-reveal="2" className="t-body max-w-[32ch]">{chapter.sentence}</p>
              <a href={href(module.path)} data-reveal="3" className="group inline-flex items-center gap-2 text-[var(--step-body)] font-medium underline decoration-1 underline-offset-[6px] hover:decoration-2">
                Explore {module.title}
                <ArrowRight size={18} aria-hidden="true" className="transition-transform duration-500 group-hover:translate-x-1" />
              </a>
            </div>
          );
          return (
            <section
              key={chapter.id}
              aria-labelledby={`chapter-${chapter.id}`}
              data-ink={light ? 'light' : 'dark'}
              className={`${field} ${light ? 'on-light' : ''} ${
                chapter.layout === 'wide' ? 'flex flex-col' : 'grid md:grid-cols-12 md:grid-rows-[auto_1fr] md:gap-x-8'
              } gap-10 px-[var(--margin)] pb-[var(--margin)] pt-20 md:min-h-[100svh] md:pt-28`}
            >
              {chapter.layout === 'wide' ? (
                <>
                  {heading('max-w-[14ch]')}
                  {picture('aspect-[4/5] sm:aspect-[16/9] md:aspect-auto md:min-h-[46svh] md:flex-1')}
                  {close('md:flex-row md:items-end md:justify-between')}
                </>
              ) : (
                <>
                  {heading(`md:col-span-5 md:row-start-1 ${textColumn}`)}
                  {picture(`aspect-[4/5] md:col-span-6 md:row-span-2 md:row-start-1 md:aspect-auto md:min-h-[64svh] lg:min-h-[80svh] ${left ? 'md:col-start-1' : 'md:col-start-7'}`)}
                  {close(`md:col-span-5 md:row-start-2 md:self-end ${textColumn}`)}
                </>
              )}
            </section>
          );
        })}

        {/* Who runs it: an inset panel, the photograph cut to the Block S. */}
        <section aria-labelledby="about-title" className="py-20 md:py-28" style={{ paddingInline: 'var(--margin)' }} data-ink="dark">
          <div className="relative grid gap-12 overflow-hidden rounded-[1.25rem] p-6 md:p-14 lg:min-h-[85svh] lg:grid-cols-12" style={{ background: '#171c3f' }}>
            <div className="lg:col-span-7">
              <h2 id="about-title" data-reveal className="t-heading">Run by students like you</h2>
              <div className="pic-in mt-12 aspect-[986/1358] w-[70%] max-w-[420px] overflow-hidden md:w-[30vw]" style={{ clipPath: BLOCK_S_CLIP }}>
                <img src={crouseCollege} alt="Crouse College’s red stone tower above the hillside" loading="lazy" className="h-full w-full object-cover" />
              </div>
            </div>
            <div className="flex flex-col gap-14 md:grid md:grid-cols-2 md:gap-10 lg:col-span-4 lg:col-start-9 lg:flex lg:gap-14 lg:pt-2">
              {AUDIENCES.map((audience, index) => (
                <div key={audience.title} data-reveal={String(index + 2)}>
                  <h3 className="text-[var(--step-lead)] font-medium leading-tight">{audience.title}</h3>
                  <p className="t-body mt-3 text-white/80">{audience.body}</p>
                </div>
              ))}
              <a href={href('/about', 'get-involved')} data-reveal="4" className="glass-button self-start px-6 py-3">
                Get involved
              </a>
            </div>
          </div>
        </section>

        {/* The close, inverted: paper ground, night ink. */}
        <section aria-labelledby="close-title" data-ink="light" className="on-light flex flex-col justify-between gap-24 bg-[#f4f5fb] py-20 text-[#090b14] lg:min-h-[72svh]" style={{ padding: 'var(--margin)' }}>
          <h2 id="close-title" data-reveal className="t-display max-w-[10ch] lg:pt-16">Your path starts here.</h2>
          <div className="flex flex-col gap-6 pb-4 md:flex-row md:items-end md:justify-between">
            <p data-reveal="2" className="max-w-[34ch] text-[var(--step-lead)] leading-snug">
              Start with the first step of the job search, or browse everything in the library.
            </p>
            <a href={href('/career-hub')} data-reveal="3" className="glass-button min-h-[56px] self-start px-8 text-base md:self-auto">
              Open the Career Hub
              <ArrowRight size={18} aria-hidden="true" />
            </a>
          </div>
        </section>
      </main>
    </>
  );
}
