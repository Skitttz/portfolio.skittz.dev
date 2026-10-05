import { getCollection } from 'astro:content';
import { projectContent, projectPath } from '@/constants/projects';

export const prerender = true;

const site = 'https://portfolio.skittz.dev';
type SitemapEntry = {
  path: string;
  lang: string;
  translationKey?: string;
};

export async function GET() {
  const articles = await getCollection('articles');
  const urls: SitemapEntry[] = [
    ...(['pt-br', 'en'] as const).flatMap((lang) => {
      const projects = [
        ...projectContent[lang].projects,
        ...projectContent[lang].otherProjects,
      ];

      return [
        { path: `/${lang}`, lang },
        { path: `/${lang}/articles`, lang },
        ...projects.map((project) => ({ path: projectPath(lang, project.slug), lang })),
      ];
    }),
    ...articles.map((article) => ({
      path: `/${article.data.lang}/articles/${article.id}`,
      lang: article.data.lang,
      translationKey: article.data.translationKey,
    })),
  ];

  const urlEntries = urls.map(({ path, lang }) => {
    const normalizedPath = path.replace(/^\/(?:pt-br|en)(?=\/|$)/, '');
    const current = urls.find((url) => url.path === path);
    const alternates = urls.filter((url) => {
      if (url.lang === lang) return false;
      const sameLocalizedPath = url.path.replace(/^\/(?:pt-br|en)(?=\/|$)/, '') === normalizedPath;
      const sameArticle = current?.translationKey && url.translationKey === current.translationKey;
      return sameLocalizedPath || Boolean(sameArticle);
    });
    const alternateLinks = alternates
      .map(({ path: alternatePath, lang: alternateLang }) =>
        `<xhtml:link rel="alternate" hreflang="${alternateLang === 'pt-br' ? 'pt-BR' : 'en'}" href="${site}${alternatePath}"/>`,
      )
      .join('');

    return `<url><loc>${site}${path}</loc>${alternateLinks}</url>`;
  }).join('');

  return new Response(
    `<?xml version="1.0" encoding="UTF-8"?><urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9" xmlns:xhtml="http://www.w3.org/1999/xhtml">${urlEntries}</urlset>`,
    { headers: { 'Content-Type': 'application/xml; charset=utf-8' } },
  );
}
