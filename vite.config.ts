import { defineConfig } from 'vite';
import react from '@vitejs/plugin-react';
import tailwindcss from '@tailwindcss/vite';

export default defineConfig({
  plugins: [react(), tailwindcss()],
  server: { host: '0.0.0.0', allowedHosts: ['terminal.local'] },
  build: {
    target: 'es2020',
    rollupOptions: {
      input: {
        landing: 'index.html',
        vini: 'vini/index.html',
      },
      output: {
        manualChunks: { motion: ['framer-motion'], react: ['react', 'react-dom'] },
      },
    },
  },
});
