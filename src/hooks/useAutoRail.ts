import { useCallback, useLayoutEffect, useRef, type RefObject } from 'react';

type InfiniteRailOptions = {
  /** Number of cards in a single set, rendered three times by the caller. */
  itemCount: number;
  /** Continuous visual speed in CSS pixels per second. */
  speed?: number;
  /** Time to yield to a manual swipe, click, or keyboard action. */
  pauseMs?: number;
};

/**
 * Seamless rightward marquee: cards visually travel left → right forever.
 * Each caller renders three identical card sets. We start on the middle set,
 * then silently rebase scrollLeft by exactly one set's measured width. Since
 * the content on either side is identical, no jump is visible to the reader.
 * Real scrolling, hover, pointer drag, and links all remain available.
 */
export function useAutoRail(
  rail: RefObject<HTMLDivElement | null>,
  { itemCount, speed = 115, pauseMs = 1600 }: InfiniteRailOptions,
) {
  const pausedUntil = useRef(0);

  const pause = useCallback((duration = pauseMs) => {
    pausedUntil.current = performance.now() + duration;
  }, [pauseMs]);

  useLayoutEffect(() => {
    const element = rail.current;
    if (!element || itemCount < 1 || element.children.length < itemCount * 3) return;

    let visible = false;
    let pointerActive = false;
    let frame = 0;
    let lastFrame = 0;
    let span = 0;
    const oldSnap = element.style.scrollSnapType;
    element.style.scrollSnapType = 'none';

    const normalize = () => {
      if (span <= 0) return;
      let left = element.scrollLeft;
      // Rebase halfway through the center set, so even a reverse manual swipe
      // keeps a complete copy on both sides of the viewport.
      while (left < span * 0.5) left += span;
      while (left >= span * 1.5) left -= span;
      if (Math.abs(left - element.scrollLeft) > 0.5) element.scrollLeft = left;
    };

    const measure = () => {
      const first = element.children[0] as HTMLElement | undefined;
      const repeated = element.children[itemCount] as HTMLElement | undefined;
      if (!first || !repeated) return;
      const measured = repeated.offsetLeft - first.offsetLeft;
      if (measured <= 1) return;
      if (!span) {
        span = measured;
        element.scrollLeft = span;
      } else if (Math.abs(measured - span) > 1) {
        const relative = (element.scrollLeft - span) / span;
        span = measured;
        element.scrollLeft = span * (1 + relative);
      }
      normalize();
    };

    measure();

    const tick = (now: number) => {
      frame = 0;
      if (!visible) return;
      const elapsed = lastFrame ? Math.min(1, (now - lastFrame) / 1000) : 0;
      lastFrame = now;

      if (!document.hidden && !pointerActive && now >= pausedUntil.current && span > 1) {
        element.scrollLeft -= speed * elapsed;
        normalize();
      }

      frame = requestAnimationFrame(tick);
    };

    const observer = new IntersectionObserver(([entry]) => {
      visible = entry.isIntersecting;
      lastFrame = 0;
      if (visible && !frame) frame = requestAnimationFrame(tick);
      if (!visible && frame) {
        cancelAnimationFrame(frame);
        frame = 0;
      }
    }, { threshold: 0 });
    observer.observe(element);

    const resize = new ResizeObserver(measure);
    resize.observe(element);
    resize.observe(element.children[0]);
    resize.observe(element.children[itemCount]);

    const pointerDown = () => { pointerActive = true; pause(); };
    const pointerUp = () => {
      if (!pointerActive) return;
      pointerActive = false;
      pause();
    };
    const horizontalWheel = (event: WheelEvent) => {
      if (Math.abs(event.deltaX) > Math.abs(event.deltaY)) pause();
    };
    const onFocus = () => pause();
    const onVisibility = () => { lastFrame = 0; };

    element.addEventListener('pointerdown', pointerDown, { passive: true });
    window.addEventListener('pointerup', pointerUp, { passive: true });
    window.addEventListener('pointercancel', pointerUp, { passive: true });
    element.addEventListener('wheel', horizontalWheel, { passive: true });
    element.addEventListener('focusin', onFocus);
    document.addEventListener('visibilitychange', onVisibility);

    return () => {
      observer.disconnect();
      resize.disconnect();
      if (frame) cancelAnimationFrame(frame);
      element.style.scrollSnapType = oldSnap;
      element.removeEventListener('pointerdown', pointerDown);
      window.removeEventListener('pointerup', pointerUp);
      window.removeEventListener('pointercancel', pointerUp);
      element.removeEventListener('wheel', horizontalWheel);
      element.removeEventListener('focusin', onFocus);
      document.removeEventListener('visibilitychange', onVisibility);
    };
  }, [rail, itemCount, speed, pause]);

  return { pause };
}
