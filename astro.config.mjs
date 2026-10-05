import mdx from '@astrojs/mdx';
import vercel from '@astrojs/vercel';
import icon from "astro-icon";
import { defineConfig } from 'astro/config';
import tailwindcss from '@tailwindcss/vite';

import react from '@astrojs/react';

export default defineConfig({
  site: 'https://portfolio.skittz.dev',
  integrations: [mdx(), icon(), react()],
  output: 'server',
  adapter: vercel({ webAnalytics: true, staticHeaders: true }),
  security: {
    csp: {
      directives: [
        "default-src 'none'",
        "base-uri 'none'",
        "object-src 'none'",
        "frame-ancestors 'none'",
        "form-action 'self'",
        "connect-src 'self'",
        "img-src 'self' data: https://github.com https://avatars.githubusercontent.com",
        "font-src 'self' https://fonts.gstatic.com",
      ],
      scriptDirective: {
        resources: [
          { resource: "'self'", kind: 'element' },
          { resource: "'none'", kind: 'attribute' },
        ],
      },
      styleDirective: {
        resources: [
          { resource: "'self'", kind: 'element' },
          { resource: 'https://fonts.googleapis.com', kind: 'element' },
          { resource: "'unsafe-inline'", kind: 'attribute' },
        ],
      },
    },
  },
  vite: {
    plugins: [tailwindcss()],
    // External modules keep ClientRouter from injecting a data: script during navigation.
    build: { assetsInlineLimit: 0 },
  },
  i18n: {
    defaultLocale: 'en',
    locales: ['en', 'pt-br'],
    routing: {
      prefixDefaultLocale: true
    }
  },
});
