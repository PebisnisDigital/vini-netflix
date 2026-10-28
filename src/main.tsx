import { StrictMode } from 'react';
import { createRoot } from 'react-dom/client';
import { MotionConfig } from 'framer-motion';
import App from './App';
import { PortfolioProvider } from './data/PortfolioContext';
import { loadClient } from './data/clientRegistry';
import './index.css';

async function start() {
  const root = createRoot(document.getElementById('root')!);
  if (/^\/formulir\/?$/.test(location.pathname)) {
    location.replace(`/studio?tab=formulir${location.hash}`);
    return;
  }
  if (/^\/studio\/?$/.test(location.pathname)) {
    if (new URLSearchParams(location.search).get('tab') === 'formulir') {
      document.title = 'Formulir Klien — PESONAFLIX Studio';
      const { default: ClientIntakeForm } = await import('./components/ClientIntakeForm');
      root.render(<StrictMode><ClientIntakeForm /></StrictMode>);
    } else {
      document.title = 'PESONAFLIX Studio — Kelola Website Klien';
      const { default: StudioEditor } = await import('./components/StudioEditor');
      root.render(<StrictMode><StudioEditor /></StrictMode>);
    }
    return;
  }
  if (/^\/studio\/preview\/?$/.test(location.pathname)) {
    const { default: StudioPreview } = await import('./components/StudioPreview');
    root.render(<StrictMode><StudioPreview /></StrictMode>);
    return;
  }
  try {
    const client = await loadClient(location.pathname);
    if (!client) {
      document.title = 'Halaman Tidak Ditemukan — PESONAFLIX';
      root.render(<div className="flex min-h-screen flex-col items-center justify-center gap-5 bg-[#07070a] p-6 text-center text-white"><h1 className="text-4xl font-bold">Halaman belum tersedia</h1><p>Portofolio belum diterbitkan atau nama URL keliru.</p><a className="rounded-lg bg-white px-6 py-3 font-bold text-black" href="/">Kembali ke Beranda</a></div>);
      return;
    }
    document.title = `${client.content.profile.displayName} — THE SERIES`;
    const description = document.querySelector('meta[name="description"]');
    description?.setAttribute('content', client.content.profile.intro);
    document.querySelector('meta[property="og:title"]')?.setAttribute('content', document.title);
    document.querySelector('meta[property="og:description"]')?.setAttribute('content', client.content.profile.intro);
    root.render(<StrictMode><MotionConfig reducedMotion="user"><PortfolioProvider data={client.content}><App slug={client.slug} /></PortfolioProvider></MotionConfig></StrictMode>);
  } catch (error) {
    console.error('Data portofolio tidak valid:', error);
    root.render(<div className="flex min-h-screen items-center justify-center bg-[#07070a] p-6 text-white">Data portofolio perlu diperiksa admin.</div>);
  }
}

void start();
