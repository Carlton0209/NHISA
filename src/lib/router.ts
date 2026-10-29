import { useEffect, useState } from 'react';

export type Route = { path: string; section: string | null };

// Addresses from the earlier site, so shared links keep working.
const LEGACY: [RegExp, string][] = [
  [/^\/job\/(linkedin|handshake|email-signature)(\/.*)?$/, '/career-hub/$1$2'],
  [/^\/job(\/.*)?$/, '/career-hub'],
  [/^\/school\/(community|experience|it-support)$/, '/campus?section=student-life'],
  [/^\/school\/academics$/, '/campus?section=academics'],
  [/^\/school(\/.*)?$/, '/campus'],
  [/^\/visa$/, '/campus?section=international'],
  [/^\/(photo-wall|community)$/, '/alumni'],
];

// Hash routes keep deep links working on GitHub Pages without rewrites.
function read(): Route {
  const [raw, query = ''] = window.location.hash.replace(/^#/, '').split('?');
  const path = raw.replace(/\/+$/, '') || '/';
  for (const [pattern, target] of LEGACY) {
    if (pattern.test(path)) {
      window.history.replaceState(null, '', `#${path.replace(pattern, target)}`);
      return read();
    }
  }
  return {
    path: path.startsWith('/') ? path : '/',
    section: new URLSearchParams(query).get('section'),
  };
}

export function useRoute() {
  const [route, setRoute] = useState(read);

  useEffect(() => {
    const onChange = () => setRoute(read());
    window.addEventListener('hashchange', onChange);
    return () => window.removeEventListener('hashchange', onChange);
  }, []);

  return route;
}

export const href = (path: string, section?: string) => `#${path}${section ? `?section=${section}` : ''}`;

/** Web links open in a new tab; mailto: and site links stay put. */
export const newTab = (url: string) => (/^https?:/.test(url) ? { target: '_blank', rel: 'noopener noreferrer' } : {});
