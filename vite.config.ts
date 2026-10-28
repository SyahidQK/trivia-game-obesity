/// <reference types="vitest" />
import { defineConfig } from 'vite';
import react from '@vitejs/plugin-react';
import { VitePWA } from 'vite-plugin-pwa';

export default defineConfig({
  // Relative base so the built `dist/` folder works from any path or file share.
  base: './',
  plugins: [
    react(),
    VitePWA({
      registerType: 'autoUpdate',
      includeAssets: ['assets/*.webp', 'assets/*.mp3', 'icon.svg'],
      manifest: {
        name: 'Myth or Fact',
        short_name: 'Myth or Fact',
        description: 'Health Myth or Fact trivia kiosk',
        theme_color: '#1f4d2b',
        background_color: '#123a1f',
        display: 'fullscreen',
        orientation: 'portrait',
        icons: [{ src: 'icon.svg', sizes: 'any', type: 'image/svg+xml', purpose: 'any' }],
      },
      workbox: {
        globPatterns: ['**/*.{js,css,html,svg,webp,woff,woff2,mp3}'],
        // The lobby music loop is ~6 MB; allow it so the kiosk keeps music offline.
        maximumFileSizeToCacheInBytes: 8 * 1024 * 1024,
      },
    }),
  ],
  test: {
    environment: 'jsdom',
    setupFiles: ['./src/test/setup.ts'],
  },
});
