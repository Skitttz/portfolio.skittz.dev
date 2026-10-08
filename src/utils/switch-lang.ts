type Lang = "pt-br" | "en";

const switchLang = (lang: Lang) => {
  const path = window.location.pathname.replace(/^\/(en|pt-br|pt)/, "");
  window.location.href = `/${lang}${path}`;
};

export { switchLang };
export type { Lang };
