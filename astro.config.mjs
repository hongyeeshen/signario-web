import { defineConfig } from 'astro/config';
import tailwind from '@astrojs/tailwind';
import vercel from '@astrojs/vercel/serverless';

export default defineConfig({
  site: process.env.SITE_URL || 'https://signario.io',
  output: 'hybrid',
  adapter: vercel(),
  integrations: [
    tailwind(),
  ],
});
