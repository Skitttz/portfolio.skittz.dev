import { navigate } from "astro:transitions/client";

type Lang = "pt-br" | "en";

const switchLang = (lang: Lang) => {
  const path = window.location.pathname.replace(/^\/(en|pt-br|pt)/, "");
  navigate(`/${lang}${path}`);
};

export { switchLang };
export type { Lang };
