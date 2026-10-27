import { useCallback, useEffect, useRef, type RefObject } from 'react';
import { useReducedMotionPref } from './useMedia';

type AutoRailOptions = {
  /** Continuous travel distance in CSS pixels per second. */
  speed?: number;
  /** Time to let readers control the rail after a manual interaction. */
  pauseMs?: number;
};

/**
 * Gently moves an overflow rail left → right → left forever, reversing at the
 * actual scroll edges. Keeps real native scrolling, links, keyboard interaction
 * and touch swiping, rather than cloning cards into an inaccessible marquee.
 */
export function useAutoRail(
  rail: RefObject<HTMLDivElement | null>,
  { speed = 44, pauseMs = 6500 }: AutoRailOptions = {},
) {
  const reducedMotion = useReducedMotionPref();
  const pausedUntil = useRef(0);
  const direction = useRef<1 | -1>(1);

  const pause = useCallback((duration = pauseMs) => {
    pausedUntil.current = performance.now() + duration;
  }, [pauseMs]);

  useEffect(() => {
    const element = rail.current;
    if (!element || reducedMotion) return;

    let visible = false;
    let animationFrame = 0;
    let previousTime = 0;
    const originalSnap = element.style.scrollSnapType;

    // Mandatory snapping can force scripted incremental scrolls back to a card.
    element.style.scrollSnapType = 'none';

    const tick = (time: number) => {
      animationFrame = 0;
      if (!visible) return;
      const elapsed = previousTime ? Math.min((time - previousTime) / 1000, 0.05) : 0;
      previousTime = time;

      const focused = element.contains(document.activeElement);
      if (!document.hidden && !focused && time >= pausedUntil.current) {
        const last = Math.max(0, element.scrollWidth - element.clientWidth);
        if (last > 2) {
          let next = element.scrollLeft + direction.current * speed * elapsed;
          if (next >= last) {
            next = last;
            direction.current = -1;
          } else if (next <= 0) {
            next = 0;
            direction.current = 1;
          }
          element.scrollLeft = next;
        }
      }
      animationFrame = requestAnimationFrame(tick);
    };

    const observer = new IntersectionObserver(([entry]) => {
      visible = entry.isIntersecting;
      if (visible) {
        previousTime = 0;
        if (!animationFrame) animationFrame = requestAnimationFrame(tick);
      } else if (animationFrame) {
        cancelAnimationFrame(animationFrame);
        animationFrame = 0;
      }
    }, { threshold: 0.15 });
    observer.observe(element);

    const userInteracted = () => pause();
    element.addEventListener('pointerdown', userInteracted, { passive: true });
    element.addEventListener('touchstart', userInteracted, { passive: true });
    element.addEventListener('wheel', userInteracted, { passive: true });
    element.addEventListener('focusin', userInteracted);

    return () => {
      observer.disconnect();
      if (animationFrame) cancelAnimationFrame(animationFrame);
      element.style.scrollSnapType = originalSnap;
      element.removeEventListener('pointerdown', userInteracted);
      element.removeEventListener('touchstart', userInteracted);
      element.removeEventListener('wheel', userInteracted);
      element.removeEventListener('focusin', userInteracted);
    };
  }, [rail, speed, reducedMotion, pause]);

  return { pause };
}
