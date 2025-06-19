import tailwind from '@astrojs/tailwind';
import vercel from '@astrojs/vercel';
import { defineConfig } from 'astro/config';
import mdx from '@astrojs/mdx';
import icon from "astro-icon";

export default defineConfig({
  integrations: [tailwind(),mdx(),icon()],
  output: 'server',
  adapter: vercel({webAnalytics: true}),
  
});