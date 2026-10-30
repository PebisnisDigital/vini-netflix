import { useEffect, useRef, type PointerEvent, type ReactNode } from 'react';
import { useMotionValue, useScroll, useSpring } from 'framer-motion';
import { useFinePointer } from '../hooks/useMedia';
import './cinematic-hero-motion.css';

/**
 * The ORIGINAL hero already owns its cinematic camera. The other visual styles
 * keep their individual CSS/Framer animations and receive the same *kind* of
 * continuous camera movement here. We animate independent CSS `translate` and
 * `scale` properties so existing `transform` keyframes/intro motions survive.
 * Studio and public demos mount this exact same component.
 */
export default function CinematicHeroMotion({ children }: { children: ReactNode }) {
  const root = useRef<HTMLDivElement>(null);
  const finePointer = useFinePointer();
  const mouseX = useMotionValue(0);
  const mouseY = useMotionValue(0);
  const springX = useSpring(mouseX, { stiffness: 55, damping: 19 });
  const springY = useSpring(mouseY, { stiffness: 55, damping: 19 });
  const { scrollYProgress } = useScroll({ target: root, offset: ['start start', 'end start'] });

  useEffect(() => {
    const element = root.current;
    if (!element) return;

    let active = true;
    let frame = 0;
    const observer = new IntersectionObserver(([entry]) => {
      active = entry.isIntersecting;
    }, { rootMargin: '150px 0px' });
    observer.observe(element);

    const animateCamera = (time: number) => {
      if (active && document.visibilityState === 'visible') {
        const scroll = Math.min(1, Math.max(0, scrollYProgress.get()));
        const viewportFactor = window.innerWidth < 768 ? 0.55 : 1;
        const x = springX.get() * viewportFactor;
        const y = springY.get() * viewportFactor;
        // Always-on slow breathing, independent from hover and scroll.
        const drift = Math.sin(time / 2600) * 6 * viewportFactor;
        const sway = Math.cos(time / 3400) * 3 * viewportFactor;

        element.style.setProperty('--cinema-photo-x', `${(x * 14 + sway).toFixed(2)}px`);
        element.style.setProperty('--cinema-photo-y', `${(scroll * 44 + y * 8 + drift).toFixed(2)}px`);
        element.style.setProperty('--cinema-photo-scale', `${(1 + scroll * 0.035).toFixed(4)}`);
        element.style.setProperty('--cinema-copy-x', `${(-x * 3).toFixed(2)}px`);
        element.style.setProperty('--cinema-copy-y', `${(-scroll * 30 - y * 3).toFixed(2)}px`);
      }
      frame = window.requestAnimationFrame(animateCamera);
    };

    frame = window.requestAnimationFrame(animateCamera);
    return () => {
      window.cancelAnimationFrame(frame);
      observer.disconnect();
    };
  }, [scrollYProgress, springX, springY]);

  const onPointerMove = (event: PointerEvent<HTMLDivElement>) => {
    if (!finePointer || event.pointerType === 'touch') return;
    const bounds = event.currentTarget.getBoundingClientRect();
    mouseX.set(Math.max(-1, Math.min(1, (event.clientX - bounds.left) / bounds.width * 2 - 1)));
    mouseY.set(Math.max(-1, Math.min(1, (event.clientY - bounds.top) / bounds.height * 2 - 1)));
  };

  return (
    <div ref={root} className="cinematic-hero-motion" onPointerMove={onPointerMove} onPointerLeave={() => { mouseX.set(0); mouseY.set(0); }}>
      {children}
    </div>
  );
}
