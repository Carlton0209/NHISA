import { useEffect, useState } from 'react';

// Hash routes keep deep links working on GitHub Pages without rewrites.
const current = () => {
  const path = window.location.hash.replace(/^#/, '').split('?')[0].replace(/\/+$/, '');
  return path.startsWith('/') ? path : '/';
};

export function useRoute() {
  const [path, setPath] = useState(current);

  useEffect(() => {
    const onChange = () => setPath(current());
    window.addEventListener('hashchange', onChange);
    return () => window.removeEventListener('hashchange', onChange);
  }, []);

  return path;
}

export const href = (path: string) => `#${path}`;
