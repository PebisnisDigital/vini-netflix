import { Fragment, useCallback, useRef, useState, type PointerEvent } from 'react';
import { motion } from 'framer-motion';
import type { Project } from '../data/portfolio';
import { usePortfolio } from '../data/PortfolioContext';
import { useAutoRail } from '../hooks/useAutoRail';
import { useReducedMotionPref } from '../hooks/useMedia';
import { EASE, RevealText } from './fx';
import ProjectCard from './ProjectCard';

/**
 * The artwork rail is a real, scrollable carousel on every screen size.
 * The former desktop-only pinned scroll had no direct drag controls and
 * could leave the third card cut off when vertical scroll was interrupted.
 */
export default function Originals({ onOpen }: { onOpen: (p: Project) => void }) {
  const { profile, projects } = usePortfolio();
  const isYudhi = profile.clientSlug === 'yudhisakkautama';
  const rail = useRef<HTMLDivElement>(null);
  const currentIndex = useRef(0);
  const pointer = useRef<{ id: number; x: number; left: number; dragged: boolean } | null>(null);
  const blockNextClick = useRef(false);
  const [active, setActive] = useState(0);
  const [dragging, setDragging] = useState(false);
  const reduced = useReducedMotionPref();
  const hasWebsite = Boolean(profile.links.website);
  const slideCount = projects.length + (hasWebsite ? 1 : 0);
  const { pause } = useAutoRail(rail, {
    itemCount: slideCount,
    speed: profile.clientSlug === 'yantiriyantini' ? 28 : 110,
    pauseMs: profile.clientSlug === 'yantiriyantini' ? 10000 : 1800,
  });

  const scrollToSlide = useCallback((index: number, manual = false) => {
    const el = rail.current;
    if (!el) return;
    // The middle copy is the canonical, keyboard-accessible card set.
    const item = el.children[index + slideCount] as HTMLElement | undefined;
    if (!item) return;

    if (manual) pause();
    const gutter = parseFloat(getComputedStyle(el).paddingLeft) || 0;
    const left = el.scrollLeft + item.getBoundingClientRect().left - el.getBoundingClientRect().left - gutter;
    currentIndex.current = index;
    setActive(index);
    el.scrollTo({ left, behavior: reduced ? 'auto' : 'smooth' });
  }, [reduced, pause]);

  const changeSlide = (direction: -1 | 1) =>
    scrollToSlide((currentIndex.current + direction + slideCount) % slideCount, true);

  const syncActive = () => {
    const el = rail.current;
    if (!el || !el.children.length) return;
    const target = el.getBoundingClientRect().left + (parseFloat(getComputedStyle(el).paddingLeft) || 0);
    let nearest = 0;
    let distance = Infinity;
    for (let i = 0; i < el.children.length; i++) {
      const x = Math.abs(el.children[i].getBoundingClientRect().left - target);
      if (x < distance) {
        distance = x;
        nearest = i;
      }
    }
    const normalizedIndex = nearest % slideCount;
    currentIndex.current = normalizedIndex;
    setActive(normalizedIndex);
  };

  const onPointerDown = (event: PointerEvent<HTMLDivElement>) => {
    if (event.pointerType !== 'mouse' || event.button !== 0) return;
    pointer.current = { id: event.pointerId, x: event.clientX, left: event.currentTarget.scrollLeft, dragged: false };
  };

  const onPointerMove = (event: PointerEvent<HTMLDivElement>) => {
    const start = pointer.current;
    if (!start || event.pointerId !== start.id || !(event.buttons & 1)) return;
    const delta = event.clientX - start.x;
    if (!start.dragged && Math.abs(delta) < 7) return;

    if (!start.dragged) {
      start.dragged = true;
      setDragging(true);
      event.currentTarget.setPointerCapture(event.pointerId);
    }
    event.preventDefault();
    event.currentTarget.scrollLeft = start.left - delta;
  };

  const endPointer = (event: PointerEvent<HTMLDivElement>) => {
    const start = pointer.current;
    if (!start || start.id !== event.pointerId) return;
    if (start.dragged) {
      pause();
      blockNextClick.current = true;
      window.setTimeout(() => { blockNextClick.current = false; }, 150);
      setDragging(false);
      if (event.currentTarget.hasPointerCapture(event.pointerId)) {
        event.currentTarget.releasePointerCapture(event.pointerId);
      }
    }
    pointer.current = null;
  };

  return (
    <div className="relative py-8 sm:py-12">
      <div className="gutter mb-7 flex flex-wrap items-end justify-between gap-6 sm:mb-9">
        <div>
          <p className="mb-3 flex items-center gap-3 text-[11px] font-semibold uppercase tracking-[0.32em] text-crimson-2">
            <span className="h-px w-8 bg-crimson-2" /> {projects.length} {isYudhi ? 'Foto & Dokumentasi' : profile.clientSlug === 'noahinna' ? 'Creative Formats' : profile.clientSlug === 'isa' ? 'Materi Pilihan' : profile.clientSlug === 'yantiriyantini' ? 'Buku & Penelitian' : 'Karya Orisinal'} · {isYudhi ? 'Arsip pilihan' : profile.clientSlug === 'yantiriyantini' ? '2010–2026' : projects[0].year}
          </p>
          <RevealText as="h2" text={isYudhi ? 'GALERI FOTO' : profile.clientSlug === 'noahinna' ? 'THE WORK' : profile.clientSlug === 'yantiriyantini' ? 'PUBLIKASI' : 'KARYA'} className="font-display text-[clamp(2.8rem,7vw,6rem)] leading-tight text-bone" />
          <p className="mt-4 max-w-2xl text-[15px] leading-relaxed text-mist">
            {isYudhi
              ? 'Sembilan foto kiriman: dokumentasi geologi, pengolahan data, aktivitas digital, potret, dan kebersamaan. Klik kartu untuk membuka foto utuh beserta ceritanya. Visual operasi tambang merupakan ilustrasi AI.'
              : profile.clientSlug === 'noahinna'
              ? 'Music-led videos, handcrafted 3D clay visuals, one educational tutorial and one explainer. Explore the cards to discover each format.'
              : profile.clientSlug === 'yantiriyantini'
              ? 'Empat buku keperawatan anak dan dua penelitian. Geser kartu, lalu buka detail untuk membaca karya selengkapnya.'
              : `${projects.map((project) => project.title).join(' · ')}. Geser kartunya untuk menjelajahi setiap cerita.`}
          </p>
        </div>

        <div className="flex items-center gap-2" aria-label="Kontrol carousel karya">
          <button type="button" aria-label="Karya sebelumnya" onClick={() => changeSlide(-1)}
            className="flex h-12 w-12 items-center justify-center rounded-full border border-white/25 bg-white/5 text-3xl text-bone transition hover:border-crimson-2 hover:bg-white/15 focus-visible:border-crimson-2">‹</button>
          <button type="button" aria-label="Karya berikutnya" onClick={() => changeSlide(1)}
            className="flex h-12 w-12 items-center justify-center rounded-full border border-white/25 bg-white/5 text-3xl text-bone transition hover:border-crimson-2 hover:bg-white/15 focus-visible:border-crimson-2">›</button>
        </div>
      </div>

      <motion.div
        ref={rail}
        aria-label={`Geser untuk melihat karya ${profile.displayName}`}
        className={`rail gutter relative flex gap-4 overflow-x-auto overscroll-x-contain pb-8 sm:gap-6 ${dragging ? 'cursor-grabbing select-none snap-none' : 'cursor-grab snap-x snap-mandatory'}`}
        data-cursor="drag"
        onScroll={syncActive}
        onPointerDown={onPointerDown}
        onPointerMove={onPointerMove}
        onPointerUp={endPointer}
        onPointerCancel={endPointer}
        onPointerLeave={() => { if (!pointer.current?.dragged) pointer.current = null; }}
        onClickCapture={(event) => {
          if (!blockNextClick.current) return;
          event.preventDefault();
          event.stopPropagation();
          blockNextClick.current = false;
        }}
        initial={{ opacity: 0, y: 28 }}
        whileInView={{ opacity: 1, y: 0 }}
        viewport={{ once: true, margin: '-10% 0px' }}
        transition={{ duration: 0.8, ease: EASE }}
      >
        {[0, 1, 2].map((copy) => (
          <Fragment key={copy}>
            {projects.map((project, index) => (
              <ProjectCard key={project.id} project={project} index={index} duplicate={copy !== 1} onOpen={() => onOpen(project)} />
            ))}
            {hasWebsite && (
              <a href={profile.links.website} target="_blank" rel="noreferrer" data-cursor="link"
                aria-hidden={copy !== 1} tabIndex={copy === 1 ? 0 : -1}
                className="group flex aspect-[3/4] w-[70vw] shrink-0 snap-start flex-col items-center justify-center gap-4 rounded-2xl border border-dashed border-white/15 text-center transition hover:border-crimson-2/60 sm:w-[44vw] lg:aspect-auto lg:h-[66vh] lg:w-[24vw]">
                <span className="flex h-16 w-16 items-center justify-center rounded-full border border-white/25 text-2xl text-bone transition group-hover:scale-110 group-hover:border-crimson-2 group-hover:text-crimson-2">↗</span>
                <span className="font-display text-3xl tracking-wide text-bone">{profile.clientSlug === 'noahinna' ? 'Visit Website' : 'Kunjungi Website'}</span>
                <span className="text-xs text-mist">{profile.links.website.replace(/^https?:\/\//, '').replace(/\/$/, '')}</span>
              </a>
            )}
          </Fragment>
        ))}
      </motion.div>

      <div className="gutter mt-2 flex items-center justify-between gap-4">
        <div className="flex items-center gap-2" aria-label={`Menampilkan karya ${active + 1} dari ${slideCount}`}>
          {Array.from({ length: slideCount }, (_, index) => (
            <button key={index} type="button" aria-label={`Lihat kartu ${index + 1}`}
              aria-current={active === index ? 'true' : undefined}
              onClick={() => scrollToSlide(index, true)}
              className={`h-1.5 rounded-full transition-all duration-300 ${active === index ? 'w-9 bg-crimson-2' : 'w-4 bg-white/25 hover:bg-white/60'}`} />
          ))}
        </div>
        <span className="text-[10px] font-semibold uppercase tracking-[0.22em] text-smoke">
          {String(active + 1).padStart(2, '0')} / {String(slideCount).padStart(2, '0')} · {profile.clientSlug === 'noahinna' ? 'Swipe to explore' : 'Geser untuk menjelajah'}
        </span>
      </div>
    </div>
  );
}
