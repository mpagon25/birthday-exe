import { lazy, Suspense, useEffect, useState, type MouseEvent } from 'react';
import { Landing } from './Landing';

const Maxi35 = lazy(() => import('./maxi35/App').then((m) => ({ default: m.App })));
const Michelle33 = lazy(() => import('./michelle/App').then((m) => ({ default: m.App })));

type Route = 'landing' | 'maxi35' | 'michelle33';

function resolve(pathname: string): Route {
  const p = pathname.replace(/\/+$/, '').toLowerCase();
  if (p.endsWith('/maxi35')) return 'maxi35';
  if (p.endsWith('/michelle33')) return 'michelle33';
  return 'landing';
}

const TITLES: Record<Route, string> = {
  landing: 'birthday-exe',
  maxi35: 'Maxi 35.exe - Level Up im Lebensspiel!',
  michelle33: 'MICHELLE.EXE – Level 33: Whiskey Unlocked',
};

/** Navigate without reload; used by the landing page links. */
export function navigate(e: MouseEvent<HTMLAnchorElement>, href: string): void {
  if (e.metaKey || e.ctrlKey || e.shiftKey || e.button !== 0) return;
  e.preventDefault();
  window.history.pushState(null, '', href);
  window.dispatchEvent(new PopStateEvent('popstate'));
}

export function Router() {
  const [route, setRoute] = useState<Route>(() => resolve(window.location.pathname));

  useEffect(() => {
    const onPop = () => setRoute(resolve(window.location.pathname));
    window.addEventListener('popstate', onPop);
    return () => window.removeEventListener('popstate', onPop);
  }, []);

  useEffect(() => {
    document.title = TITLES[route];
  }, [route]);

  if (route === 'landing') return <Landing />;
  return (
    <Suspense fallback={<div style={{ background: '#000', color: '#c0c0c0', fontFamily: 'monospace', padding: 24 }}>Loading...</div>}>
      {route === 'maxi35' ? <Maxi35 key="maxi35" /> : <Michelle33 key="michelle33" />}
    </Suspense>
  );
}
