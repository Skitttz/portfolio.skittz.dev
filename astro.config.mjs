import tailwind from '@astrojs/tailwind';
import vercel from '@astrojs/vercel';
import { defineConfig } from 'astro/config';
import mdx from '@astrojs/mdx';

export default defineConfig({
  integrations: [tailwind(),mdx()],
  output: 'server',
  adapter: vercel({webAnalytics: true}),
  
});