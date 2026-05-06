'use client';

import { useEffect } from 'react';

/**
 * Add `.in-view` to any `[data-reveal]` element the first time it crosses
 * into the viewport. Honors `prefers-reduced-motion`.
 */
export function useScrollReveal() {
  useEffect(() => {
    if (typeof window === 'undefined') return;

    const reduceMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
    const elements = document.querySelectorAll<HTMLElement>('[data-reveal]');
    if (!elements.length) return;

    if (reduceMotion) {
      elements.forEach((el) => el.classList.add('in-view'));
      return;
    }

    const observer = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (entry.isIntersecting) {
            entry.target.classList.add('in-view');
            observer.unobserve(entry.target);
          }
        });
      },
      { threshold: 0.1, rootMargin: '0px 0px -60px 0px' },
    );

    elements.forEach((el) => observer.observe(el));
    return () => observer.disconnect();
  }, []);
}
