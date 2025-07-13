import { sequence } from 'astro:middleware';

const languageDetection = async ({ request, redirect, cookies }, next) => {
  const url = new URL(request.url);
  const supportedLangs = ['en', 'pt', 'pt-br'];
  const COOKIE_NAME = 'preferred_lang';
  
  if (url.pathname.startsWith('/_server-islands/') || 
      url.pathname.startsWith('/_astro/') || 
      url.pathname.startsWith('/api/') ||
      url.pathname.includes('favicon.ico') ||
      url.pathname.includes('.') && !url.pathname.endsWith('/')) {
    return next();
  }
  
  if (supportedLangs.some(lang => url.pathname.startsWith(`/${lang}`))) {
    return next();
  }
  
  let userLang = cookies.get(COOKIE_NAME)?.value;
  
  if (!userLang) {
    const acceptLanguage = request.headers.get('accept-language');
    if (acceptLanguage) {
      const languages = acceptLanguage.split(',').map(lang => 
        lang.split(';')[0].trim().toLowerCase()
      );
      
      for (const lang of languages) {
        if (supportedLangs.includes(lang)) {
          userLang = lang;
          break;
        }
        const shortLang = lang.split('-')[0];
        if (supportedLangs.includes(shortLang)) {
          userLang = shortLang;
          break;
        }
      }
    }
  }
  
  userLang = userLang || 'en';
  
  if (userLang === 'pt' && supportedLangs.includes('pt-br')) {
    userLang = 'pt-br';
  }
  
  if (!supportedLangs.includes(userLang)) {
    userLang = 'en';
  }
  
  cookies.set(COOKIE_NAME, userLang, {
    path: '/',
    maxAge: 60 * 60 * 24 * 365, // 1 ano
    httpOnly: false,
    secure: url.protocol === 'https:',
    sameSite: 'lax'
  });
  
  return redirect(`/${userLang}${url.pathname}${url.search}`);
};

const serverIslandsHandler = async ({ request }, next) => {
  const url = new URL(request.url);
  
  const match = url.pathname.match(/^\/(en|pt|pt-br)\/_server-islands\/(.+)$/);
  if (match) {
    const [, lang, islandPath] = match;
    const correctedPath = `/_server-islands/${islandPath}`;
    const newUrl = new URL(correctedPath, url.origin);
    newUrl.search = url.search;
    
    const newRequest = new Request(newUrl, {
      method: request.method,
      headers: request.headers,
      body: request.body
    });
    
    return fetch(newRequest);
  }
  
  return next();
};

export const onRequest = sequence(
  serverIslandsHandler,
  languageDetection
);