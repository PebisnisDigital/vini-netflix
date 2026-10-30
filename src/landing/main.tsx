import { StrictMode } from 'react';
import { createRoot } from 'react-dom/client';
import LandingPage, { daftarWhatsapp } from './LandingPage';
import { BriefPage } from './PesonaflixCheckout';
import '../index.css';
import './landing.css';

const path = window.location.pathname.replace(/\/$/, '') || '/';
// Until sandbox payment QA passes, even saved /checkout links go to the team.
if (path === '/checkout') window.location.replace(daftarWhatsapp);
const page = path === '/pesanan' ? <BriefPage /> : <LandingPage />;
createRoot(document.getElementById('root')!).render(<StrictMode>{page}</StrictMode>);
