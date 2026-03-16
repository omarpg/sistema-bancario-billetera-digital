// @ts-check
import { defineConfig } from 'astro/config';

import tailwindcss from '@tailwindcss/vite';

import react from '@astrojs/react';

import sitemap from '@astrojs/sitemap';

// https://astro.build/config
export default defineConfig({
  site: 'http://localhost:4321/', // Cambiar por dominio real
  vite: {
    plugins: [tailwindcss()]
  },
  integrations: [react(), sitemap()],
  output: 'static',
  build: {
    inlineStylesheets: 'always'
  },
});