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

      <div className="absolute inset-x-0 bottom-[20%] z-50 flex justify-center px-5 hero-anim">
        <a href={href('/school')} className="glass-button px-9 py-3.5 text-base">
          Start Exploring
        </a>
      </div>
    </main>
  );
}
