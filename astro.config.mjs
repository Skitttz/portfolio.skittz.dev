import mdx from '@astrojs/mdx';
import vercel from '@astrojs/vercel';
import icon from "astro-icon";
import { defineConfig } from 'astro/config';

import react from '@astrojs/react';

export default defineConfig({
  site: 'https://portfolio.skittz.dev',
  integrations: [mdx(), icon(), react()],
  output: 'server',
  adapter: vercel({webAnalytics: true}),
  i18n: {
    defaultLocale: 'en',
    locales: ['en', 'pt-br'],
    routing: {
      prefixDefaultLocale: true
    }
  },
});
