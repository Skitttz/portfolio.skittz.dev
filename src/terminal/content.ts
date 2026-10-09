import type { Lang } from "../utils/switch-lang.ts";
import { colorSchemes, commands } from "./shell.ts";
import type { CommandName, Segment, ShellContent } from "./shell.ts";

type ContentInput = {
  lang: Lang;
  nickname: string;
  location: string;
  cvFile: string;
  articles: ShellContent["articles"];
  projects: number;
  git: { branch: string; commit?: string };
  now: Date;
};

type Copy = Pick<ShellContent, "welcome" | "stack" | "messages"> & {
  role: string;
  help: Record<CommandName, string>;
};

const run = (command: string): Segment => ({ text: command, command });
const colorsUsage = `colors [${colorSchemes.join("|")}]`;

const copy: Record<Lang, Copy> = {
  "pt-br": {
    role: "Desenvolvedor Front-end",
    welcome: [{ text: "digite " }, run("help"), { text: " para listar os comandos." }],
    help: {
      help: "lista os comandos",
      whoami: "quem está por trás do portfólio",
      neofetch: "resumo no estilo neofetch",
      stack: "ferramentas e contexto técnico",
      contact: "links úteis",
      cv: "baixa o currículo",
      articles: "lista os posts",
      open: "abre o post n em outra aba",
      projects: "vai para a seção de projetos",
      experience: "vai para a seção de experiência",
      theme: "troca o tema",
      colors: "troca as cores do terminal",
      lang: "troca o idioma",
      snow: "liga ou desliga a neve",
      clear: "limpa o terminal",
      exit: "volta ao modo normal",
    },
    stack: [
      "ui:      React, Astro, Next.js, Tailwind",
      "build:   Vite, estrutura orientada a componentes",
      "backend: Node.js, Express, APIs REST",
      "cms:     Strapi, WordPress Headless",
    ],
    messages: {
      unknown: [{ text: "comando não encontrado: {name}. digite " }, run("help"), { text: " para listar os comandos." }],
      cv: "baixando {file}",
      articlesHint: [{ text: "digite " }, run("open 1"), { text: " para ler" }],
      articlesEmpty: "nenhum post publicado ainda.",
      openDone: "abrindo em outra aba: {title}",
      openUsage: [{ text: "uso: open <n>. veja os números em " }, run("articles"), { text: "." }],
      openMissing: [{ text: "não existe post {n}. digite " }, run("articles"), { text: " para ver a lista." }],
      projects: "abrindo a seção de projetos...",
      experience: "abrindo a seção de experiência...",
      themeSet: { light: "tema claro ativado.", dark: "tema escuro ativado." },
      themeAlready: { light: "o tema já está claro.", dark: "o tema já está escuro." },
      themeUsage: "uso: theme [light|dark]",
      langSet: "trocando para inglês...",
      langAlready: "o idioma já é português.",
      langUsage: "uso: lang [pt|en]",
      snowSet: { on: "neve ligada.", off: "neve desligada." },
      snowAlready: { on: "a neve já está ligada.", off: "a neve já está desligada." },
      snowUsage: "uso: snow [on|off]",
      colorsActive: "(ativo)",
      colorsHint: [{ text: "digite " }, run("colors dracula"), { text: " para trocar" }],
      colorsSet: "cores: {name}.",
      colorsAlready: "as cores já são {name}.",
      colorsUsage: `uso: ${colorsUsage}`,
      exit: "saindo do modo terminal.",
    },
  },
  en: {
    role: "Front-end Developer",
    welcome: [{ text: "type " }, run("help"), { text: " to list the commands." }],
    help: {
      help: "list commands",
      whoami: "who is behind this portfolio",
      neofetch: "summary in neofetch style",
      stack: "tools and technical context",
      contact: "useful links",
      cv: "download the résumé",
      articles: "list the posts",
      open: "open post n in a new tab",
      projects: "go to the projects section",
      experience: "go to the experience section",
      theme: "switch the theme",
      colors: "switch the terminal colors",
      lang: "switch the language",
      snow: "turn the snow on or off",
      clear: "reset terminal",
      exit: "back to the regular site",
    },
    stack: [
      "ui:      React, Astro, Next.js, Tailwind",
      "build:   Vite, component-driven structure",
      "backend: Node.js, Express, REST APIs",
      "cms:     Strapi, WordPress Headless",
    ],
    messages: {
      unknown: [{ text: "command not found: {name}. type " }, run("help"), { text: " to list the commands." }],
      cv: "downloading {file}",
      articlesHint: [{ text: "type " }, run("open 1"), { text: " to read" }],
      articlesEmpty: "no posts yet.",
      openDone: "opening in a new tab: {title}",
      openUsage: [{ text: "usage: open <n>. see the numbers in " }, run("articles"), { text: "." }],
      openMissing: [{ text: "there is no post {n}. type " }, run("articles"), { text: " to see the list." }],
      projects: "opening the projects section...",
      experience: "opening the experience section...",
      themeSet: { light: "light theme on.", dark: "dark theme on." },
      themeAlready: { light: "the theme is already light.", dark: "the theme is already dark." },
      themeUsage: "usage: theme [light|dark]",
      langSet: "switching to Portuguese...",
      langAlready: "the language is already English.",
      langUsage: "usage: lang [pt|en]",
      snowSet: { on: "snow on.", off: "snow off." },
      snowAlready: { on: "the snow is already on.", off: "the snow is already off." },
      snowUsage: "usage: snow [on|off]",
      colorsActive: "(active)",
      colorsHint: [{ text: "type " }, run("colors dracula"), { text: " to switch" }],
      colorsSet: "colors: {name}.",
      colorsAlready: "the colors are already {name}.",
      colorsUsage: `usage: ${colorsUsage}`,
      exit: "leaving terminal mode.",
    },
  },
};

const careerTime = (lang: Lang, now: Date): string => {
  const months = Math.max(0, (now.getUTCFullYear() - 2023) * 12 + now.getUTCMonth());
  const years = Math.floor(months / 12);
  const remainder = months % 12;
  const pt = lang === "pt-br";
  const parts = [
    ...(years ? [`${years} ${pt ? (years === 1 ? "ano" : "anos") : (years === 1 ? "year" : "years")}`] : []),
    ...(remainder || !years ? [`${remainder} ${pt ? (remainder === 1 ? "mês" : "meses") : (remainder === 1 ? "month" : "months")}`] : []),
  ];
  return parts.join(pt ? " e " : " and ") + (pt ? " de carreira" : " in the field");
};

const buildTerminalContent = ({ lang, nickname, location, cvFile, articles, projects, git, now }: ContentInput): ShellContent => {
  const { role, welcome, help, stack, messages } = copy[lang];

  return {
    lang,
    prompt: "skittz@portfolio:~$",
    welcome,
    help: commands.map(({ name, args }) => ({ name, args, description: help[name] })),
    whoami: [`Carlos Vinicius (${nickname})`, `${role} · ${location}`],
    neofetch: {
      title: "skittz@portfolio",
      rows: [
        { label: lang === "pt-br" ? "cargo" : "role", value: role },
        { label: lang === "pt-br" ? "local" : "location", value: location },
        { label: "uptime", value: careerTime(lang, now) },
        { label: "stack", value: "React, Next.js, Astro, TypeScript" },
        { label: lang === "pt-br" ? "projetos" : "projects", value: String(projects) },
        { label: "posts", value: String(articles.length) },
        { label: "commit", value: git.branch + (git.commit ? ` @ ${git.commit.slice(0, 7)}` : "") },
      ],
      colorsLabel: lang === "pt-br" ? "cores" : "colors",
    },
    stack,
    contact: [
      { label: "linkedin", href: "https://linkedin.com/in/carlos-vinicius-dev" },
      { label: "github", href: "https://github.com/skitttz" },
    ],
    cv: { href: `/${cvFile}.pdf`, file: `${cvFile}.pdf` },
    articles,
    messages,
  };
};

export { buildTerminalContent };
