import { defineConfig } from 'astro/config';
import tailwind from '@astrojs/tailwind';
import vercel from '@astrojs/vercel/static';

export default defineConfig({
  site: 'https://signario.io',
  output: 'static',
  adapter: vercel(),
  integrations: [
    tailwind(),
  ],
});
