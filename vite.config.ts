import react from '@vitejs/plugin-react';
import { defineConfig } from 'vite';
import { VitePWA } from 'vite-plugin-pwa';

// https://vite.dev/config/
export default defineConfig({
  base: '/des-pace-calculator/',
  plugins: [
    react(),
    // Installable from the browser menu, and works offline once loaded.
    VitePWA({
      registerType: 'autoUpdate',
      pwaAssets: { config: true },
      manifest: {
        name: 'Pace Calculator',
        short_name: 'Pace',
        description:
          'Running pace, time and distance calculator with VO2max estimate',
        theme_color: '#ff5a1f',
        background_color: '#f4f4f1',
        display: 'standalone',
      },
    }),
  ],
});
