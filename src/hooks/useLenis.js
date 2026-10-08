import { useEffect } from 'react';
import { initLenis, getLenis, stopLenis, startLenis, scrollTo } from '../lib/lenis';

export function useLenis() {
  useEffect(() => {
    const lenis = initLenis();
    return () => {
      // Lenis ticker is persistent across routes
    };
  }, []);

  return { getLenis, stopLenis, startLenis, scrollTo };
}
