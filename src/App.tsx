import { useEffect, useRef } from 'react';
import { BackToTop, TopBar } from './components/Navigation';
import SiteFooter from './components/SiteFooter';
import Home from './pages/Home';
import Campus from './pages/Campus';
import CareerHub, { careerHubTitle } from './pages/CareerHub';
import CareerAccess from './pages/CareerAccess';
import Alumni, { alumniTitle } from './pages/Alumni';
import About from './pages/About';
import Wall from './pages/Wall';
import WallReview from './pages/WallReview';
import { useRoute } from './lib/router';
import { installPointerLight, installTitleCapture } from './lib/interactions';
import { installReveal } from './lib/reveal';

function resolve(path: string) {
  const section = `/${path.split('/')[1] ?? ''}`;
  switch (section) {
    case '/campus': return { title: 'Campus Resources', page: <Campus path={path} /> };
    case '/career-hub': return { title: careerHubTitle(path), page: <CareerHub path={path} /> };
    case '/career-access': return { title: 'Career Access', page: <CareerAccess path={path} /> };
    case '/alumni': return { title: alumniTitle(path), page: <Alumni path={path} /> };
    case '/about': return { title: 'About Us', page: <About path={path} /> };
    case '/wall':
      return path === '/wall/review'
        ? { title: 'Photo wall review', page: <WallReview path={path} /> }
        : { title: 'Find your moment', page: <Wall path={path} /> };
    default: return { title: 'NHISA', page: <Home /> };
  }
}

export default function App() {
  const { path, section } = useRoute();
  const { title, page } = resolve(path);
  const firstRender = useRef(true);

  useEffect(() => {
    const removeLight = installPointerLight();
    const removeCapture = installTitleCapture();
    const removeReveal = installReveal();
    return () => {
      removeLight();
      removeCapture();
      removeReveal();
    };
  }, []);

  useEffect(() => {
    document.title = title === 'NHISA' ? 'NHISA · Newhouse International Student Association' : `${title} | NHISA`;
    const target = section ? document.getElementById(section) : null;
    if (target) {
      // Wait a frame so the new page has laid out before jumping into it.
      requestAnimationFrame(() => {
        const reduced = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
        target.scrollIntoView({ behavior: firstRender.current || reduced ? 'auto' : 'smooth' });
        firstRender.current = false;
      });
      return;
    }
    if (firstRender.current) {
      firstRender.current = false;
      return;
    }
    // A new page (the router has already reset the scroll): move focus to its
    // heading for screen readers.
    document.querySelector<HTMLElement>('[data-page-title]')?.focus({ preventScroll: true });
  }, [path, section, title]);

  return (
    <div className="min-h-screen">
      <a href="#main" className="skip-link" onClick={(event) => {
        event.preventDefault();
        document.querySelector<HTMLElement>('[data-page-title]')?.focus();
      }}>
        Skip to content
      </a>
      <TopBar path={path} />
      {page}
      <SiteFooter />
      <BackToTop />
    </div>
  );
}
