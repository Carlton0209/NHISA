import { useEffect, useRef } from 'react';
import FlowLines from './components/FlowLines';
import { BackToTop, BottomNav, TopBar } from './components/Navigation';
import SiteFooter from './components/SiteFooter';
import Home from './pages/Home';
import Campus from './pages/Campus';
import CareerHub, { careerHubTitle } from './pages/CareerHub';
import CareerAccess from './pages/CareerAccess';
import Alumni, { alumniTitle } from './pages/Alumni';
import About from './pages/About';
import { useRoute } from './lib/router';

function resolve(path: string) {
  const section = `/${path.split('/')[1] ?? ''}`;
  switch (section) {
    case '/campus': return { title: 'Campus Resources', page: <Campus path={path} /> };
    case '/career-hub': return { title: careerHubTitle(path), page: <CareerHub path={path} /> };
    case '/career-access': return { title: 'Career Access', page: <CareerAccess path={path} /> };
    case '/alumni': return { title: alumniTitle(path), page: <Alumni path={path} /> };
    case '/about': return { title: 'About Us', page: <About path={path} /> };
    default: return { title: 'NHISA', page: <Home /> };
  }
}

export default function App() {
  const { path, section } = useRoute();
  const { title, page } = resolve(path);
  const firstRender = useRef(true);

  useEffect(() => {
    document.title = title === 'NHISA' ? 'NHISA · Newhouse International Students' : `${title} | NHISA`;
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
    // A new page: start at the top and move focus to its heading for screen readers.
    window.scrollTo(0, 0);
    document.querySelector<HTMLElement>('[data-page-title]')?.focus({ preventScroll: true });
  }, [path, section, title]);

  return (
    <div className="min-h-screen tracking-[-0.01em]">
      <a href="#main" className="skip-link" onClick={(event) => {
        event.preventDefault();
        document.querySelector<HTMLElement>('[data-page-title]')?.focus();
      }}>
        Skip to content
      </a>
      <FlowLines className="flow-lines-fixed" />
      <TopBar />
      {page}
      <SiteFooter />
      <BackToTop />
      <BottomNav path={path} />
    </div>
  );
}
