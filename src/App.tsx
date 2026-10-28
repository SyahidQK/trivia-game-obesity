import { useEffect, useState } from 'react';
import { Game } from './game/Game';
import { AdminApp } from './admin/AdminApp';

function useHash() {
  const [hash, setHash] = useState(window.location.hash);
  useEffect(() => {
    const onChange = () => setHash(window.location.hash);
    window.addEventListener('hashchange', onChange);
    return () => window.removeEventListener('hashchange', onChange);
  }, []);
  return hash;
}

export function App() {
  const hash = useHash();
  if (hash.startsWith('#/admin')) return <AdminApp onExit={() => (window.location.hash = '')} />;
  return <Game onOpenAdmin={() => (window.location.hash = '#/admin')} />;
}
