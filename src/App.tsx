import { useEffect, useRef } from 'react';
import Navbar, { NAV_ITEMS } from './components/Navbar';
import Home from './pages/Home';
import School, { schoolTitle } from './pages/School';
import Job, { jobTitle } from './pages/Job';
import ComingSoon from './pages/ComingSoon';
import { useRoute } from './lib/router';

function resolve(route: string) {
  const section = `/${route.split('/')[1] ?? ''}`;
  if (route === '/') return { title: 'NHISA', page: <Home /> };
  if (section === '/school') return { title: schoolTitle(route), page: <School route={route} /> };
  if (section === '/job') return { title: jobTitle(route), page: <Job route={route} /> };
  const item = NAV_ITEMS.find((nav) => nav.path === section);
  if (item) return { title: item.label, page: <ComingSoon route={route} title={item.label} /> };
  return { title: 'NHISA', page: <Home /> };
}

export default function App() {
  const route = useRoute();
  const { title, page } = resolve(route);
  const firstRender = useRef(true);

  useEffect(() => {
    document.title = title === 'NHISA' ? 'NHISA' : `${title} | NHISA`;
    if (firstRender.current) {
      firstRender.current = false;
      return;
    }
    // A new page: start at the top and move focus to its heading for screen readers.
    window.scrollTo(0, 0);
    document.querySelector<HTMLElement>('[data-page-title]')?.focus({ preventScroll: true });
  }, [route, title]);

  return (
    <div className="min-h-screen tracking-[-0.02em]">
      <a href="#main" className="skip-link" onClick={(event) => {
        event.preventDefault();
        document.querySelector<HTMLElement>('[data-page-title]')?.focus();
      }}>
        Skip to content
      </a>
      <Navbar route={route} />
      {page}
    </div>
  );
}
