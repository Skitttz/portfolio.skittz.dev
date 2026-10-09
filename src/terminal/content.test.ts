import assert from "node:assert/strict";
import { describe, test } from "node:test";
import en from "../locales/en.json" with { type: "json" };
import pt from "../locales/pt-br.json" with { type: "json" };
import { buildTerminalContent } from "./content.ts";
import { runCommand } from "./shell.ts";
import type { ShellState } from "./shell.ts";
import type { Lang } from "../utils/switch-lang.ts";

const state: ShellState = { theme: "dark", snow: true, colors: "default" };

const october2026 = new Date(Date.UTC(2026, 9, 8));

const portuguese = buildTerminalContent({
  lang: "pt-br",
  nickname: pt.nickname,
  location: pt.about.location,
  cvFile: pt.fileName,
  articles: [
    { title: "Post novo", href: "/pt-br/articles/novo" },
    { title: "Post antigo", href: "/pt-br/articles/antigo" },
  ],
  projects: 7,
  git: { branch: "main", commit: "4833a4c" },
  now: october2026,
});
const english = buildTerminalContent({
  lang: "en",
  nickname: en.nickname,
  location: en.about.location,
  cvFile: en.fileName,
  articles: [],
  projects: 7,
  git: { branch: "main" },
  now: october2026,
});

const names = ["help", "whoami", "neofetch", "stack", "contact", "cv", "articles", "open", "projects", "experience", "theme", "colors", "lang", "snow", "clear", "exit"];
const lineTexts = (input: string, content = portuguese, current = state) =>
  runCommand(input, content, current).lines.map((line) => line.map((segment) => segment.text).join(""));
const shape = (value: unknown): unknown =>
  Array.isArray(value)
    ? value.map(shape)
    : value && typeof value === "object"
      ? Object.fromEntries(Object.entries(value).map(([key, inner]) => [key, shape(inner)]))
      : typeof value;

const uptime = (lang: Lang, year: number, month: number, day = 15) => {
  const locale = lang === "en" ? en : pt;
  const content = buildTerminalContent({
    lang,
    nickname: locale.nickname,
    location: locale.about.location,
    cvFile: locale.fileName,
    articles: [],
    projects: 7,
    git: { branch: "main" },
    now: new Date(Date.UTC(year, month - 1, day)),
  });

  return lineTexts("neofetch", content)[4];
};

describe("terminal content", () => {
  test("help lists the sixteen commands in the same order in both languages", () => {
    assert.deepEqual(portuguese.help.map((entry) => entry.name), names);
    assert.deepEqual(english.help.map((entry) => entry.name), names);
  });

  test("every listed command is understood by the interpreter", () => {
    for (const content of [portuguese, english]) {
      const unknown = runCommand("definitely-not-a-command", content, state).lines[0][0].text.slice(0, 12);

      for (const name of names) {
        const first = runCommand(name, content, state).lines[0]?.[0].text ?? "";
        assert.ok(!first.startsWith(unknown), `${content.lang}: "${name}" is listed in help but not understood`);
      }
    }
  });

  test("both languages carry the same messages", () => {
    assert.deepEqual(shape(english.messages), shape(portuguese.messages));
  });

  test("the help descriptions match the approved copy", () => {
    assert.deepEqual(portuguese.help.map((entry) => entry.description), [
      "lista os comandos",
      "quem está por trás do portfólio",
      "resumo no estilo neofetch",
      "ferramentas e contexto técnico",
      "links úteis",
      "baixa o currículo",
      "lista os posts",
      "abre o post n em outra aba",
      "abre os projetos no terminal",
      "abre a experiência no terminal",
      "troca o tema",
      "troca as cores do terminal",
      "troca o idioma",
      "liga ou desliga a neve",
      "limpa o terminal",
      "volta ao modo normal",
    ]);
    assert.deepEqual(english.help.map((entry) => entry.description), [
      "list commands",
      "who is behind this portfolio",
      "summary in neofetch style",
      "tools and technical context",
      "useful links",
      "download the résumé",
      "list the posts",
      "open post n in a new tab",
      "open projects inside the terminal",
      "open experience inside the terminal",
      "switch the theme",
      "switch the terminal colors",
      "switch the language",
      "turn the snow on or off",
      "reset terminal",
      "back to the regular site",
    ]);
  });

  test("the welcome line invites to run help", () => {
    assert.deepEqual(portuguese.welcome, [
      { text: "digite " },
      { text: "help", command: "help" },
      { text: " para listar os comandos." },
    ]);
    assert.deepEqual(english.welcome, [
      { text: "type " },
      { text: "help", command: "help" },
      { text: " to list the commands." },
    ]);
  });

  test("whoami joins the nickname, the role and the location", () => {
    assert.deepEqual(lineTexts("whoami"), ["Carlos Vinicius (Skittz)", "Desenvolvedor Front-end · Aracaju-SE, Brasil"]);
    assert.deepEqual(lineTexts("whoami", english), ["Carlos Vinicius (Skittz)", "Front-end Developer · Aracaju-SE, Brazil"]);
  });

  test("neofetch prints the card with the data of each language", () => {
    const strip = "                       ";

    assert.deepEqual(lineTexts("neofetch"), [
      "skittz@portfolio",
      "----------------",
      "cargo     Desenvolvedor Front-end",
      "local     Aracaju-SE, Brasil",
      "uptime    3 anos e 9 meses de carreira",
      "stack     React, Next.js, Astro, TypeScript",
      "projetos  7",
      "posts     2",
      "commit    main @ 4833a4c",
      "cores     default",
      " ",
      strip,
    ]);
    assert.deepEqual(lineTexts("neofetch", english, { ...state, colors: "gruvbox" }), [
      "skittz@portfolio",
      "----------------",
      "role      Front-end Developer",
      "location  Aracaju-SE, Brazil",
      "uptime    3 years and 9 months in the field",
      "stack     React, Next.js, Astro, TypeScript",
      "projects  7",
      "posts     0",
      "commit    main",
      "colors    gruvbox",
      " ",
      strip,
    ]);
  });

  test("the neofetch header and labels are accented, the values are plain", () => {
    const { lines } = runCommand("neofetch", portuguese, state);

    assert.deepEqual(lines[0], [{ text: "skittz@portfolio", tone: "accent" }]);
    for (const line of lines.slice(2, 10)) {
      assert.equal(line[0].tone, "accent", line[0].text);
      assert.equal(line[0].text.length, 10, line[0].text);
      assert.equal(line[1].tone, undefined, line[1].text);
    }
  });

  test("career time counts full years and months since January 2023", () => {
    assert.equal(uptime("pt-br", 2026, 10), "uptime    3 anos e 9 meses de carreira");
    assert.equal(uptime("en", 2026, 10), "uptime    3 years and 9 months in the field");
    assert.equal(uptime("pt-br", 2026, 10, 1), uptime("pt-br", 2026, 10, 31));
  });

  test("career time uses the singular for one year and one month", () => {
    assert.equal(uptime("pt-br", 2024, 2), "uptime    1 ano e 1 mês de carreira");
    assert.equal(uptime("en", 2024, 2), "uptime    1 year and 1 month in the field");
  });

  test("career time leaves out a zero part", () => {
    assert.equal(uptime("pt-br", 2025, 1), "uptime    2 anos de carreira");
    assert.equal(uptime("en", 2024, 1), "uptime    1 year in the field");
    assert.equal(uptime("pt-br", 2023, 12), "uptime    11 meses de carreira");
    assert.equal(uptime("en", 2023, 2), "uptime    1 month in the field");
  });

  test("career time never goes below zero months", () => {
    assert.equal(uptime("pt-br", 2023, 1), "uptime    0 meses de carreira");
    assert.equal(uptime("en", 2022, 6), "uptime    0 months in the field");
  });

  test("stack keeps the four technical lines", () => {
    assert.deepEqual(lineTexts("stack"), [
      "ui:      React, Astro, Next.js, Tailwind",
      "build:   Vite, estrutura orientada a componentes",
      "backend: Node.js, Express, APIs REST",
      "cms:     Strapi, WordPress Headless",
    ]);
    assert.deepEqual(lineTexts("stack", english), [
      "ui:      React, Astro, Next.js, Tailwind",
      "build:   Vite, component-driven structure",
      "backend: Node.js, Express, REST APIs",
      "cms:     Strapi, WordPress Headless",
    ]);
  });

  test("contact links LinkedIn and GitHub", () => {
    assert.deepEqual(runCommand("contact", portuguese, state), { ok: true, hang: 10, lines: [
      [{ text: "linkedin  " }, { text: "https://linkedin.com/in/carlos-vinicius-dev", href: "https://linkedin.com/in/carlos-vinicius-dev" }],
      [{ text: "github    " }, { text: "https://github.com/skitttz", href: "https://github.com/skitttz" }],
    ] });
  });

  test("cv points at the résumé of each language", () => {
    assert.deepEqual(runCommand("cv", portuguese, state), {
      ok: true,
      lines: [[{ text: "baixando curriculo-carlos-vinicius.pdf" }]],
      effect: { type: "download", href: "/curriculo-carlos-vinicius.pdf" },
    });
    assert.deepEqual(runCommand("cv", english, state), {
      ok: true,
      lines: [[{ text: "downloading resume-carlos-vinicius.pdf" }]],
      effect: { type: "download", href: "/resume-carlos-vinicius.pdf" },
    });
  });

  test("articles lists the posts and explains how to open one", () => {
    assert.deepEqual(lineTexts("articles"), ["1  Post novo", "2  Post antigo", "digite open 1 para ler"]);
    assert.deepEqual(lineTexts("articles", english), ["no posts yet."]);
  });

  test("open reports success, wrong usage and a missing post", () => {
    assert.deepEqual(lineTexts("open 2"), ["abrindo em outra aba: Post antigo"]);
    assert.deepEqual(lineTexts("open"), ["uso: open <n>. veja os números em articles."]);
    assert.deepEqual(lineTexts("open 7"), ["não existe post 7. digite articles para ver a lista."]);
    assert.deepEqual(lineTexts("open", english), ["usage: open <n>. see the numbers in articles."]);
    assert.deepEqual(lineTexts("open 7", english), ["there is no post 7. type articles to see the list."]);
  });

  test("projects and experience announce where they go", () => {
    assert.deepEqual(lineTexts("projects"), ["abrindo os projetos..."]);
    assert.deepEqual(lineTexts("experience"), ["abrindo a experiência..."]);
    assert.deepEqual(lineTexts("projects", english), ["opening projects..."]);
    assert.deepEqual(lineTexts("experience", english), ["opening experience..."]);
  });

  test("theme confirms, refuses a repeat and explains its usage", () => {
    assert.deepEqual(lineTexts("theme light"), ["tema claro ativado."]);
    assert.deepEqual(lineTexts("theme dark", portuguese, { ...state, theme: "light" }), ["tema escuro ativado."]);
    assert.deepEqual(lineTexts("theme dark"), ["o tema já está escuro."]);
    assert.deepEqual(lineTexts("theme light", portuguese, { ...state, theme: "light" }), ["o tema já está claro."]);
    assert.deepEqual(lineTexts("theme blue"), ["uso: theme [light|dark]"]);
    assert.deepEqual(lineTexts("theme light", english), ["light theme on."]);
    assert.deepEqual(lineTexts("theme dark", english), ["the theme is already dark."]);
    assert.deepEqual(lineTexts("theme blue", english), ["usage: theme [light|dark]"]);
  });

  test("lang confirms, refuses a repeat and explains its usage", () => {
    assert.deepEqual(lineTexts("lang en"), ["trocando para inglês..."]);
    assert.deepEqual(lineTexts("lang pt"), ["o idioma já é português."]);
    assert.deepEqual(lineTexts("lang fr"), ["uso: lang [pt|en]"]);
    assert.deepEqual(lineTexts("lang pt", english), ["switching to Portuguese..."]);
    assert.deepEqual(lineTexts("lang en", english), ["the language is already English."]);
    assert.deepEqual(lineTexts("lang fr", english), ["usage: lang [pt|en]"]);
  });

  test("snow confirms, refuses a repeat and explains its usage", () => {
    assert.deepEqual(lineTexts("snow off"), ["neve desligada."]);
    assert.deepEqual(lineTexts("snow on", portuguese, { ...state, snow: false }), ["neve ligada."]);
    assert.deepEqual(lineTexts("snow on"), ["a neve já está ligada."]);
    assert.deepEqual(lineTexts("snow off", portuguese, { ...state, snow: false }), ["a neve já está desligada."]);
    assert.deepEqual(lineTexts("snow maybe"), ["uso: snow [on|off]"]);
    assert.deepEqual(lineTexts("snow off", english), ["snow off."]);
    assert.deepEqual(lineTexts("snow on", english), ["the snow is already on."]);
    assert.deepEqual(lineTexts("snow maybe", english), ["usage: snow [on|off]"]);
  });

  test("colors lists the schemes, marks the active one and ends with the hint", () => {
    const strip = " ".repeat(12);

    assert.deepEqual(lineTexts("colors", portuguese, { ...state, colors: "dracula" }), [
      `default      ${strip}`,
      `dracula      ${strip}  (ativo)`,
      `gruvbox      ${strip}`,
      `catppuccin   ${strip}`,
      `tokyo-night  ${strip}`,
      "digite colors dracula para trocar",
    ]);
    assert.deepEqual(lineTexts("colors", english), [
      `default      ${strip}  (active)`,
      `dracula      ${strip}`,
      `gruvbox      ${strip}`,
      `catppuccin   ${strip}`,
      `tokyo-night  ${strip}`,
      "type colors dracula to switch",
    ]);
    assert.deepEqual(runCommand("colors", portuguese, state).lines.at(-1), [
      { text: "digite " },
      { text: "colors dracula", command: "colors dracula" },
      { text: " para trocar" },
    ]);
  });

  test("colors confirms, refuses a repeat and explains its usage", () => {
    assert.deepEqual(lineTexts("colors dracula"), ["cores: dracula."]);
    assert.deepEqual(lineTexts("colors default"), ["as cores já são default."]);
    assert.deepEqual(lineTexts("colors solarized"), ["uso: colors [default|dracula|gruvbox|catppuccin|tokyo-night]"]);
    assert.deepEqual(lineTexts("colors dracula", english), ["colors: dracula."]);
    assert.deepEqual(lineTexts("colors default", english), ["the colors are already default."]);
    assert.deepEqual(lineTexts("colors solarized", english), ["usage: colors [default|dracula|gruvbox|catppuccin|tokyo-night]"]);
  });

  test("exit and unknown commands use the approved wording", () => {
    assert.deepEqual(lineTexts("exit"), ["saindo do modo terminal."]);
    assert.deepEqual(lineTexts("exit", english), ["leaving terminal mode."]);
    assert.deepEqual(runCommand("sudo", portuguese, state).lines, [[
      { text: "comando não encontrado: sudo. digite " },
      { text: "help", command: "help" },
      { text: " para listar os comandos." },
    ]]);
    assert.deepEqual(lineTexts("sudo", english), ["command not found: sudo. type help to list the commands."]);
  });
});
