const langRoutes: Record<string, string> = {
  "pt-br": "/pt-br",
  en: "/en",
};

const getHrefLang = (lang: string): string => langRoutes[lang] ?? "/";


export { getHrefLang, langRoutes }