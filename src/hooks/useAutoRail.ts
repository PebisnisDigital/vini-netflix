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
  { speed = 92, pauseMs = 1600 }: AutoRailOptions = {},
) {
  const reducedMotion = useReducedMotionPref();
  const pausedUntil = useRef(0);
  const direction = useRef<1 | -1>(1);
  const pointerActive = useRef(false);

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

      if (!document.hidden && !pointerActive.current && time >= pausedUntil.current) {
        const last = Math.max(0, element.scrollWidth - element.clientWidth);
        if (last > 2) {
          // Slow gently near each end so the change of direction feels natural.
          const room = direction.current > 0 ? last - element.scrollLeft : element.scrollLeft;
          const easingZone = Math.min(100, last / 3);
          const easing = 0.45 + 0.55 * Math.min(1, Math.max(0, room / easingZone));
          let next = element.scrollLeft + direction.current * speed * easing * elapsed;
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
    }, { threshold: 0 });
    observer.observe(element);

    const pointerDown = () => { pointerActive.current = true; pause(); };
    const pointerUp = () => {
      if (!pointerActive.current) return;
      pointerActive.current = false;
      pause();
    };
    const touchStart = () => pause();
    const horizontalWheel = (event: WheelEvent) => {
      // Vertical page scrolling over the cards must not freeze the carousel.
      if (Math.abs(event.deltaX) > Math.abs(event.deltaY)) pause();
    };
    const focusIn = () => pause();
    element.addEventListener('pointerdown', pointerDown, { passive: true });
    window.addEventListener('pointerup', pointerUp, { passive: true });
    window.addEventListener('pointercancel', pointerUp, { passive: true });
    element.addEventListener('touchstart', touchStart, { passive: true });
    element.addEventListener('wheel', horizontalWheel, { passive: true });
    element.addEventListener('focusin', focusIn);

    return () => {
      observer.disconnect();
      if (animationFrame) cancelAnimationFrame(animationFrame);
      element.style.scrollSnapType = originalSnap;
      element.removeEventListener('pointerdown', pointerDown);
      window.removeEventListener('pointerup', pointerUp);
      window.removeEventListener('pointercancel', pointerUp);
      element.removeEventListener('touchstart', touchStart);
      element.removeEventListener('wheel', horizontalWheel);
      element.removeEventListener('focusin', focusIn);
    };
  }, [rail, speed, reducedMotion, pause]);

  return { pause };
}
