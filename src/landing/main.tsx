import { StrictMode } from 'react';
import { createRoot } from 'react-dom/client';
import LandingPage from './LandingPage';
import { BriefPage, CheckoutPage } from './PesonaflixCheckout';
import '../index.css';
import './landing.css';

const path = window.location.pathname.replace(/\/$/, '') || '/';
const page = path === '/checkout' ? <CheckoutPage /> : path === '/pesanan' ? <BriefPage /> : <LandingPage />;
createRoot(document.getElementById('root')!).render(<StrictMode>{page}</StrictMode>);
