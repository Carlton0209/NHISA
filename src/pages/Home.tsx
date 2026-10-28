import RevealLayer from '../components/RevealLayer';
import { href } from '../lib/router';
import heroAutumn from '../assets/hero-autumn.jpg';
import heroWinter from '../assets/hero-winter.jpg';

export default function Home() {
  return (
    <main id="main" className="hero" aria-label="NHISA campus, autumn and winter">
      <h1 tabIndex={-1} data-page-title className="sr-only">
        NHISA: community and career resources for Newhouse international students and alumni
      </h1>
      <div className="hero-scene" aria-hidden="true">
        <RevealLayer autumnImage={heroAutumn} winterImage={heroWinter} />
      </div>

      <div className="hero-scrim" aria-hidden="true" />

      <div className="absolute bottom-10 sm:bottom-24 right-5 sm:right-10 md:right-14 z-50 hero-anim">
        <a
          href={href('/school')}
          className="inline-block bg-[#e8702a] hover:bg-[#d2611f] text-white text-sm font-medium px-7 py-3 rounded-full transition-all hover:scale-[1.03] active:scale-95 hover:shadow-lg hover:shadow-[#e8702a]/30"
        >
          Start Exploring
        </a>
      </div>
    </main>
  );
}
