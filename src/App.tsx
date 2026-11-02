import { lazy, Suspense, useCallback, useEffect, useState, type CSSProperties, type KeyboardEvent, type MouseEvent, type ReactNode } from 'react';
import { AnimatePresence, LayoutGroup, motion } from 'framer-motion';
import type { ProfileId, Project, SectionId } from './data/portfolio';
import { appearanceSlug, effectiveTheme } from './data/clientModel';
import { elementKeyCandidates, isSafeElementHref } from './data/elementLinks';
import { usePortfolio } from './data/PortfolioContext';
import { SmoothScrollProvider, useSmoothScroll } from './hooks/smoothScroll';
import CustomCursor from './components/CustomCursor';
import OpeningSequence from './components/OpeningSequence';
import ProfileSelector from './components/ProfileSelector';
import Navbar from './components/Navbar';
import Hero from './components/Hero';
import ChibiHero from './components/ChibiHero';
import ClayHero from './components/ClayHero';
import ComicHero from './components/ComicHero';
import EditorialHero from './components/EditorialHero';
import DoodleHero from './components/DoodleHero';
import StorybookHero from './components/StorybookHero';
import ScrapbookHero from './components/ScrapbookHero';
import PaperCutHero from './components/PaperCutHero';
import PixelRetroHero from './components/PixelRetroHero';
import MiniatureWorldHero from './components/MiniatureWorldHero';
import DocumentaryHero from './components/DocumentaryHero';
import MinimalistHero from './components/MinimalistHero';
import FuturisticNeonHero from './components/FuturisticNeonHero';
import VintageHeritageHero from './components/VintageHeritageHero';
import TniProfessionHero from './components/TniProfessionHero';
import CinematicHeroMotion from './components/CinematicHeroMotion';
import ContinueWatching from './components/ContinueWatching';
import Scene from './components/Scene';
import About from './components/About';
import Seasons from './components/Seasons';
import Originals from './components/Originals';
import MunasifahShowcase from './components/MunasifahShowcase';
import ElectronicTigerStudio from './components/ElectronicTigerStudio';
import TopPicks from './components/TopPicks';
import Skills from './components/Skills';
import Achievements from './components/Achievements';
import ResumeSection from './components/ResumeViewer';
import FinalCTA from './components/FinalCTA';
import ClientLocationMap from './components/ClientLocationMap';
import { VisualDesignStyles, VisualWidgets } from './components/VisualDesignLayer';
import { EASE } from './components/fx';

// Overlays are only needed on demand — split them out of the first load.
const PlayIntro = lazy(() => import('./components/PlayIntro'));
const ProjectModal = lazy(() => import('./components/ProjectModal'));
const ResumeModal = lazy(() => import('./components/ResumeModal'));

type Stage = 'opening' | 'profiles' | 'home';

function readStoredProfile(key: string, viewerProfiles: ReturnType<typeof usePortfolio>['viewerProfiles']): ProfileId | null {
  try {
    const v = sessionStorage.getItem(key);
    return viewerProfiles.some((p) => p.id === v) ? (v as ProfileId) : null;
  } catch {
    return null;
  }
}

export default function App({ slug, editorMode = false }: { slug: string; editorMode?: boolean }) {
  const { profile, elementLinks } = usePortfolio();
  // This client requested an English-first studio brand site, while retaining
  // the same CMS data source and editable project/image fields.
  if (profile.clientSlug === 'noahinna' || profile.clientSlug === 'electronictigercreativestudio') {
    return <ElectronicTigerStudio editorMode={editorMode} />;
  }
  // Alamat publik dapat berupa alias, sedangkan kanvas dahulu memakai slug
  // sementara. Kelas tema khusus selalu mengikuti identitas sumber klien.
  const clientSlug = appearanceSlug(slug, profile.clientSlug);
  const chibiCinema = profile.templateId === 'chibi-3d' || profile.designVariant === 'chibi-cinema';
  const animeCinema = profile.templateId === 'anime' || slug === 'vini4';
  const clayCinema = profile.templateId === 'clay-3d' || slug === 'vini5';
  const comicCinema = profile.templateId === 'komik-pop' || slug === 'vini6';
  const editorialCinema = profile.templateId === 'editorial-premium' || slug === 'vini7';
  const doodleCinema = profile.templateId === 'doodle' || slug === 'vini8';
  const storybookCinema = profile.templateId === 'storybook' || slug === 'vini9';
  const scrapbookCinema = profile.templateId === 'scrapbook' || slug === 'vini10';
  const papercutCinema = profile.templateId === 'paper-cut' || slug === 'vini11';
  const pixelCinema = profile.templateId === 'pixel-retro' || slug === 'vini12';
  const miniatureCinema = profile.templateId === 'miniature-world' || slug === 'vini13';
  const documentaryCinema = profile.templateId === 'documentary' || slug === 'vini14';
  const minimalistCinema = profile.templateId === 'minimalist' || slug === 'vini15';
  const futuristicNeonCinema = profile.templateId === 'futuristic-neon' || slug === 'vini16';
  const vintageHeritageCinema = profile.templateId === 'vintage-heritage' || slug === 'vini17';
  const tniCinema = profile.templateId === 'tni-nusantara';
  // Warna CHIBI bawaan tidak disimpan ke data: ketika berganti gaya,
  // pilihan warna khusus dan warna asli klien tetap aman.
  const theme = profile.theme || chibiCinema || animeCinema || clayCinema || comicCinema || editorialCinema || doodleCinema || storybookCinema || scrapbookCinema || papercutCinema || pixelCinema || miniatureCinema || documentaryCinema || minimalistCinema || futuristicNeonCinema || vintageHeritageCinema || tniCinema ? effectiveTheme(profile) : undefined;
  const styles = theme ? {
    '--color-ink': theme.background,
    '--color-ink-2': theme.background,
    '--color-crimson': theme.accent,
    '--color-crimson-2': theme.accent,
    '--client-accent': theme.accent,
  } as CSSProperties : undefined;

  const followAssignedLink = (target: EventTarget | null): boolean => {
    if (editorMode || !(target instanceof HTMLElement) || !elementLinks) return false;
    let selected = target.closest<HTMLElement>('[data-studio-edit]');
    while (selected) {
      const field = selected.dataset.studioEdit || '';
      for (const key of elementKeyCandidates(field)) {
        const href = elementLinks[key];
        if (!href || !isSafeElementHref(href)) continue;
        if (href.startsWith('#')) {
          const destination = document.getElementById(href.slice(1));
          if (destination) destination.scrollIntoView({ behavior: 'smooth', block: 'start' });
          else window.location.assign(href);
        } else if (/^https?:\/\//i.test(href)) window.open(href, '_blank', 'noopener,noreferrer');
        else window.location.assign(href);
        return true;
      }
      selected = selected.parentElement?.closest<HTMLElement>('[data-studio-edit]') ?? null;
    }
    return false;
  };

  const captureLinkClick = (event: MouseEvent<HTMLDivElement>) => {
    if (followAssignedLink(event.target)) { event.preventDefault(); event.stopPropagation(); }
  };
  const captureLinkKey = (event: KeyboardEvent<HTMLDivElement>) => {
    if ((event.key === 'Enter' || event.key === ' ') && followAssignedLink(event.target)) { event.preventDefault(); event.stopPropagation(); }
  };
  return (
    <div onClickCapture={captureLinkClick} onKeyDownCapture={captureLinkKey} style={styles} className={`min-h-screen bg-ink client-portfolio${editorMode ? ' studio-canvas' : ''}${clientSlug === 'isa' ? ' isa-light' : ''}${clientSlug === 'noahinna' ? ' noahinna-clay' : ''}${clientSlug === 'yudhaandaka' ? ' yudhaandaka-executive' : ''}${clientSlug === 'yudhisakkautama' ? ' yudhisakkautama-geopreneur' : ''}${clientSlug === 'ninikwardhani' ? ' ninikwardhani-elegant' : ''}${clientSlug === 'vini3' ? ' chibi-theme' : ''}${animeCinema ? ' anime-theme' : ''}${chibiCinema ? ' chibi-cinema' : ''}${clayCinema ? ' clay-cinema' : ''}${comicCinema ? ' comic-cinema' : ''}${editorialCinema ? ' editorial-cinema' : ''}${doodleCinema ? ' doodle-cinema' : ''}${storybookCinema ? ' storybook-cinema' : ''}${scrapbookCinema ? ' scrapbook-cinema' : ''}${papercutCinema ? ' papercut-cinema' : ''}${pixelCinema ? ' pixel-cinema' : ''}${miniatureCinema ? ' miniature-cinema' : ''}${documentaryCinema ? ' documentary-cinema' : ''}${minimalistCinema ? ' minimalist-cinema' : ''}${futuristicNeonCinema ? ' futuristic-cinema' : ''}${vintageHeritageCinema ? ' vintage-cinema' : ''}${tniCinema ? ' tni-cinema' : ''}`}>
      <VisualDesignStyles />
      <SmoothScrollProvider>
        <Series slug={slug} editorMode={editorMode} />
      </SmoothScrollProvider>
    </div>
  );
}

function Series({ slug, editorMode }: { slug: string; editorMode: boolean }) {
  const { viewerProfiles, profile } = usePortfolio();
  const chibiCinema = profile.templateId === 'chibi-3d' || profile.designVariant === 'chibi-cinema';
  const animeCinema = profile.templateId === 'anime' || slug === 'vini4';
  const clayCinema = profile.templateId === 'clay-3d' || slug === 'vini5';
  const comicCinema = profile.templateId === 'komik-pop' || slug === 'vini6';
  const editorialCinema = profile.templateId === 'editorial-premium' || slug === 'vini7';
  const doodleCinema = profile.templateId === 'doodle' || slug === 'vini8';
  const storybookCinema = profile.templateId === 'storybook' || slug === 'vini9';
  const scrapbookCinema = profile.templateId === 'scrapbook' || slug === 'vini10';
  const papercutCinema = profile.templateId === 'paper-cut' || slug === 'vini11';
  const pixelCinema = profile.templateId === 'pixel-retro' || slug === 'vini12';
  const miniatureCinema = profile.templateId === 'miniature-world' || slug === 'vini13';
  const documentaryCinema = profile.templateId === 'documentary' || slug === 'vini14';
  const minimalistCinema = profile.templateId === 'minimalist' || slug === 'vini15';
  const futuristicNeonCinema = profile.templateId === 'futuristic-neon' || slug === 'vini16';
  const vintageHeritageCinema = profile.templateId === 'vintage-heritage' || slug === 'vini17';
  const tniCinema = profile.templateId === 'tni-nusantara';
  const storageKey = `personal-netflix-profile-${slug}`;
  const stored = readStoredProfile(storageKey, viewerProfiles);
  const [stage, setStage] = useState<Stage>(slug === 'vini3' || animeCinema || clayCinema || comicCinema || editorialCinema || doodleCinema || storybookCinema || scrapbookCinema || papercutCinema || pixelCinema || miniatureCinema || documentaryCinema || minimalistCinema || futuristicNeonCinema || vintageHeritageCinema || tniCinema || editorMode || stored || chibiCinema ? 'home' : 'opening');
  const [profileId, setProfileId] = useState<ProfileId>(stored ?? 'vini');
  const [playing, setPlaying] = useState(false);
  const [project, setProject] = useState<Project | null>(null);
  const [resumeOpen, setResumeOpen] = useState(false);
  const [toast, setToast] = useState<string | null>(null);
  const { scrollTo, lock, unlock } = useSmoothScroll();

  const order = viewerProfiles.find((p) => p.id === profileId)!.order;

  useEffect(() => {
    if (stage === 'home') return;
    lock();
    return unlock;
  }, [stage, lock, unlock]);

  const pickProfile = useCallback(
    (id: ProfileId) => {
      setProfileId(id);
      try {
        sessionStorage.setItem(storageKey, id);
      } catch {
        /* storage unavailable — profile simply won't persist */
      }
      if (stage !== 'home') {
        window.scrollTo(0, 0);
        setStage('home');
      } else {
        const p = viewerProfiles.find((v) => v.id === id)!;
        setToast(`Sekarang menonton sebagai ${p.name} — ${p.blurb.toLowerCase()}`);
        scrollTo(0, { offset: 0 });
      }
    },
    [stage, scrollTo, storageKey, viewerProfiles],
  );

  useEffect(() => {
    if (!toast) return;
    const t = window.setTimeout(() => setToast(null), 3200);
    return () => clearTimeout(t);
  }, [toast]);

  const closeIntro = useCallback(() => setPlaying(false), []);
  const closeProject = useCallback(() => setProject(null), []);
  const closeResume = useCallback(() => setResumeOpen(false), []);
  const openProject = useCallback((item: Project) => {
    if (slug === 'isa' && item.title === 'Seribu Rempah' && item.github) {
      window.open(item.github, '_blank', 'noopener,noreferrer');
      return;
    }
    setProject(item);
  }, [slug]);

  const sections: Record<SectionId, ReactNode> = {
    about: <About />,
    journey: <Seasons />,
    originals: profile.clientSlug === 'munasifah' ? <MunasifahShowcase onOpen={openProject} /> : <Originals onOpen={openProject} />,
    picks: <TopPicks />,
    skills: <Skills />,
    moments: <Achievements />,
    story: <ResumeSection onView={() => setResumeOpen(true)} />,
  };

  const customCinema = chibiCinema || clayCinema || comicCinema || editorialCinema || doodleCinema || storybookCinema || scrapbookCinema || papercutCinema || pixelCinema || miniatureCinema || documentaryCinema || minimalistCinema || futuristicNeonCinema || vintageHeritageCinema || tniCinema;
  const customHero = chibiCinema ? (
    <ChibiHero key={`hero-${profileId}`} onPlay={() => setPlaying(true)} onOpenProject={setProject} />
  ) : clayCinema ? (
    <ClayHero key={`hero-${profileId}`} onPlay={() => setPlaying(true)} onOpenProject={setProject} />
  ) : comicCinema ? (
    <ComicHero key={`hero-${profileId}`} onPlay={() => setPlaying(true)} onOpenProject={setProject} />
  ) : editorialCinema ? (
    <EditorialHero key={`hero-${profileId}`} onPlay={() => setPlaying(true)} onOpenProject={setProject} />
  ) : doodleCinema ? (
    <DoodleHero key={`hero-${profileId}`} onPlay={() => setPlaying(true)} onOpenProject={openProject} />
  ) : storybookCinema ? (
    <StorybookHero key={`hero-${profileId}`} onPlay={() => setPlaying(true)} onOpenProject={setProject} />
  ) : scrapbookCinema ? (
    <ScrapbookHero key={`hero-${profileId}`} onPlay={() => setPlaying(true)} onOpenProject={setProject} />
  ) : papercutCinema ? (
    <PaperCutHero key={`hero-${profileId}`} onPlay={() => setPlaying(true)} onOpenProject={setProject} />
  ) : pixelCinema ? (
    <PixelRetroHero key={`hero-${profileId}`} onPlay={() => setPlaying(true)} onOpenProject={setProject} />
  ) : miniatureCinema ? (
    <MiniatureWorldHero key={`hero-${profileId}`} onPlay={() => setPlaying(true)} onOpenProject={setProject} />
  ) : documentaryCinema ? (
    <DocumentaryHero key={`hero-${profileId}`} onPlay={() => setPlaying(true)} onOpenProject={setProject} />
  ) : minimalistCinema ? (
    <MinimalistHero key={`hero-${profileId}`} onPlay={() => setPlaying(true)} onOpenProject={setProject} />
  ) : futuristicNeonCinema ? (
    <FuturisticNeonHero key={`hero-${profileId}`} onPlay={() => setPlaying(true)} onOpenProject={setProject} />
  ) : vintageHeritageCinema ? (
    <VintageHeritageHero key={`hero-${profileId}`} onPlay={() => setPlaying(true)} onOpenProject={setProject} />
  ) : tniCinema ? (
    <TniProfessionHero key={`hero-${profileId}`} onPlay={() => setPlaying(true)} onOpenProject={setProject} />
  ) : null;

  return (
    <LayoutGroup>
      <div className="grain" aria-hidden />
      {!editorMode && <CustomCursor />}

      <AnimatePresence>
        {stage === 'opening' && <OpeningSequence key="opening" onDone={() => setStage('profiles')} />}
        {stage === 'profiles' && <ProfileSelector key="profiles" onPick={pickProfile} />}
      </AnimatePresence>

      {stage === 'home' && (
        <motion.div initial={{ opacity: 0, scale: 1.03, filter: 'blur(10px)' }} animate={{ opacity: 1, scale: 1, filter: 'blur(0px)' }} transition={{ duration: 1, ease: EASE }}>
          <Navbar order={order} profileId={profileId} onSwitch={pickProfile} variant={chibiCinema ? 'chibi' : undefined} />
          <main>
            {customCinema ? (
              <CinematicHeroMotion>{customHero}</CinematicHeroMotion>
            ) : (
              <Hero key={`hero-${profileId}`} onPlay={() => setPlaying(true)} onResume={() => setResumeOpen(true)} profileId={profileId} editorMode={editorMode} />
            )}
            <VisualWidgets section="top" />
            <ContinueWatching order={order} />
            <VisualWidgets section="continue" />
            {order.map((id) => (
              <Scene key={id} id={id} className={id === 'originals' ? '!py-0 sm:!py-0' : ''}>
                {sections[id]}
                <VisualWidgets section={id} />
              </Scene>
            ))}
            {profile.googleMapsUrl && <ClientLocationMap />}
            <FinalCTA onReplay={() => setStage('opening')} />
            <VisualWidgets section="contact" />
          </main>
        </motion.div>
      )}

      <Suspense fallback={null}>
        <AnimatePresence>{playing && <PlayIntro key="intro" onClose={closeIntro} />}</AnimatePresence>
        <AnimatePresence>{project && <ProjectModal key="project" project={project} onClose={closeProject} onSwitch={setProject} />}</AnimatePresence>
        <AnimatePresence>{resumeOpen && <ResumeModal key="resume" onClose={closeResume} />}</AnimatePresence>
      </Suspense>

      <AnimatePresence>
        {toast && (
          <motion.div
            role="status"
            className="glass fixed bottom-6 left-1/2 z-[150] w-[min(92vw,420px)] -translate-x-1/2 rounded-xl px-5 py-3 text-center text-sm text-bone"
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: 30 }}
          >
            {toast}
          </motion.div>
        )}
      </AnimatePresence>
    </LayoutGroup>
  );
}
