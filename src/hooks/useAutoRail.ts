import { useCallback, useEffect, useRef, type RefObject } from 'react';

type AutoRailOptions = {
  /** Duration of each complete card-to-card slide. */
  travelMs?: number;
  /** Short gap before the next slide, giving readers time to scan a card. */
  holdMs?: number;
  /** Briefly yield control after a swipe, arrow click, or keyboard interaction. */
  pauseMs?: number;
};

/**
 * Netflix-style autoplay: advance one complete card, reverse at the last
 * reachable position, and keep looping while the rail is on screen.
 *
 * Position is derived from the actual animation clock, not accumulated pixel
 * deltas. This matters on low-power/mobile browsers where requestAnimationFrame
 * can be throttled and a tiny per-frame delta looks completely static.
 */
export function useAutoRail(
  rail: RefObject<HTMLDivElement | null>,
  { travelMs = 1900, holdMs = 420, pauseMs = 1600 }: AutoRailOptions = {},
) {
  const pausedUntil = useRef(0);
  const interrupt = useRef<() => void>(() => {});

  const pause = useCallback((duration = pauseMs) => {
    pausedUntil.current = performance.now() + duration;
    interrupt.current();
  }, [pauseMs]);

  useEffect(() => {
    const element = rail.current;
    if (!element) return;

    let visible = false;
    let pointerActive = false;
    let direction: 1 | -1 = 1;
    let frame = 0;
    let timer: ReturnType<typeof setTimeout> | null = null;
    const oldSnap = element.style.scrollSnapType;

    // Native snap can force tiny increments back onto the same card.
    element.style.scrollSnapType = 'none';

    const stop = () => {
      if (frame) cancelAnimationFrame(frame);
      frame = 0;
      if (timer !== null) clearTimeout(timer);
      timer = null;
    };

    const schedule = (delay: number) => {
      if (!visible) return;
      if (timer !== null) clearTimeout(timer);
      timer = setTimeout(step, Math.max(0, delay));
    };

    const step = () => {
      timer = null;
      if (!visible) return;

      const remainingPause = pausedUntil.current - performance.now();
      if (document.hidden || pointerActive || remainingPause > 0) {
        schedule(Math.max(200, Math.min(1000, remainingPause)));
        return;
      }

      const max = Math.max(0, element.scrollWidth - element.clientWidth);
      if (max < 6) {
        schedule(1200);
        return;
      }

      const firstCard = element.firstElementChild as HTMLElement | null;
      const gap = parseFloat(getComputedStyle(element).columnGap) || 0;
      const cardStep = Math.max(160, (firstCard?.getBoundingClientRect().width || element.clientWidth * 0.7) + gap);
      const distance = Math.min(cardStep, element.clientWidth * 0.78, max);
      const startPosition = element.scrollLeft;

      if (direction === 1 && startPosition >= max - 2) direction = -1;
      if (direction === -1 && startPosition <= 2) direction = 1;

      const endPosition = Math.max(0, Math.min(max, startPosition + direction * distance));
      if (Math.abs(endPosition - startPosition) < 2) {
        direction = direction === 1 ? -1 : 1;
        schedule(100);
        return;
      }

      let startedAt: number | null = null;
      const animate = (now: number) => {
        frame = 0;
        if (!visible || document.hidden || pointerActive || now < pausedUntil.current) {
          schedule(250);
          return;
        }

        if (startedAt === null) startedAt = now;
        const progress = Math.min(1, (now - startedAt) / travelMs);
        const eased = 0.5 - 0.5 * Math.cos(Math.PI * progress);
        element.scrollLeft = startPosition + (endPosition - startPosition) * eased;

        if (progress < 1) {
          frame = requestAnimationFrame(animate);
        } else {
          if (endPosition >= max - 1) direction = -1;
          if (endPosition <= 1) direction = 1;
          schedule(holdMs);
        }
      };

      frame = requestAnimationFrame(animate);
    };

    interrupt.current = () => {
      stop();
      if (visible) schedule(Math.max(200, pausedUntil.current - performance.now()));
    };

    const observer = new IntersectionObserver(([entry]) => {
      visible = entry.isIntersecting;
      stop();
      if (visible && !document.hidden) schedule(350);
    }, { threshold: 0 });
    observer.observe(element);

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
    const onVisibility = () => {
      stop();
      if (!document.hidden && visible) schedule(350);
    };

    element.addEventListener('pointerdown', pointerDown, { passive: true });
    window.addEventListener('pointerup', pointerUp, { passive: true });
    window.addEventListener('pointercancel', pointerUp, { passive: true });
    element.addEventListener('wheel', horizontalWheel, { passive: true });
    element.addEventListener('focusin', onFocus);
    document.addEventListener('visibilitychange', onVisibility);

    return () => {
      stop();
      observer.disconnect();
      element.style.scrollSnapType = oldSnap;
      interrupt.current = () => {};
      element.removeEventListener('pointerdown', pointerDown);
      window.removeEventListener('pointerup', pointerUp);
      window.removeEventListener('pointercancel', pointerUp);
      element.removeEventListener('wheel', horizontalWheel);
      element.removeEventListener('focusin', onFocus);
      document.removeEventListener('visibilitychange', onVisibility);
    };
  }, [rail, travelMs, holdMs, pause]);

  return { pause };
}
