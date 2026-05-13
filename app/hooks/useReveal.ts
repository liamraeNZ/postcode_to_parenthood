import type { RefObject } from 'react';
import { useEffect, useRef } from 'react';

/**
 * Attaches an IntersectionObserver to a container ref.
 * All children with class `.reveal` inside the container will
 * have `.in-view` added when they enter the viewport.
 *
 * @param threshold - IntersectionObserver threshold (0-1), default 0.15
 * @returns React ref to attach to the container element
 */
export function useReveal(threshold = 0.15): RefObject<HTMLElement | null> {
  const ref = useRef<HTMLElement | null>(null);

  useEffect(() => {
    if (typeof window === 'undefined') return;

    const container = ref.current;
    if (!container) return;

    const observer = new IntersectionObserver(
      (entries) => {
        for (const entry of entries) {
          if (entry.isIntersecting) {
            entry.target.classList.add('in-view');
            observer.unobserve(entry.target);
          }
        }
      },
      { threshold }
    );

    const elements = container.querySelectorAll('.reveal');
    for (const el of elements) {
      observer.observe(el);
    }

    return () => {
      observer.disconnect();
    };
  }, [threshold]);

  return ref;
}
