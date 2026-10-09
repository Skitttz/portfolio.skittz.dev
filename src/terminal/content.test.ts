import assert from "node:assert/strict";
import { describe, test } from "node:test";
import en from "../locales/en.json" with { type: "json" };
import pt from "../locales/pt-br.json" with { type: "json" };
import { buildTerminalContent } from "./content.ts";
import { runCommand } from "./shell.ts";
import type { ShellState } from "./shell.ts";

const state: ShellState = { theme: "dark", snow: true };

// The real locale values feed the builder; every expectation is a literal copied from the spec tables.
const portuguese = buildTerminalContent({
  lang: "pt-br",
  nickname: pt.nickname,
  location: pt.about.location,
  cvFile: pt.fileName,
  articles: [
    { title: "Post novo", href: "/pt-br/articles/novo" },
    { title: "Post antigo", href: "/pt-br/articles/antigo" },
  ],
});
const english = buildTerminalContent({
  lang: "en",
  nickname: en.nickname,
  location: en.about.location,
  cvFile: en.fileName,
  articles: [],
});

const names = ["help", "whoami", "stack", "contact", "cv", "articles", "open", "projects", "experience", "theme", "lang", "snow", "clear", "exit"];
const lineTexts = (input: string, content = portuguese, current = state) =>
  runCommand(input, content, current).lines.map((line) => line.map((segment) => segment.text).join(""));
const shape = (value: unknown): unknown =>
  Array.isArray(value)
    ? value.map(shape)
    : value && typeof value === "object"
      ? Object.fromEntries(Object.entries(value).map(([key, inner]) => [key, shape(inner)]))
      : typeof value;

describe("terminal content", () => {
  test("help lists the fourteen commands in the same order in both languages", () => {
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
      "ferramentas e contexto técnico",
      "links úteis",
      "baixa o currículo",
      "lista os posts",
      "abre o post de número n",
      "vai para a seção de projetos",
      "vai para a seção de experiência",
      "troca o tema",
      "troca o idioma",
      "liga ou desliga a neve",
      "limpa o terminal",
      "volta ao modo normal",
    ]);
    assert.deepEqual(english.help.map((entry) => entry.description), [
      "list commands",
      "who is behind this portfolio",
      "tools and technical context",
      "useful links",
      "download the résumé",
      "list the posts",
      "open post number n",
      "go to the projects section",
      "go to the experience section",
      "switch the theme",
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
    assert.deepEqual(runCommand("contact", portuguese, state), { hang: 10, lines: [
      [{ text: "linkedin  " }, { text: "https://linkedin.com/in/carlos-vinicius-dev", href: "https://linkedin.com/in/carlos-vinicius-dev" }],
      [{ text: "github    " }, { text: "https://github.com/skitttz", href: "https://github.com/skitttz" }],
    ] });
  });

  test("cv points at the résumé of each language", () => {
    assert.deepEqual(runCommand("cv", portuguese, state), {
      lines: [[{ text: "baixando curriculo-carlos-vinicius.pdf" }]],
      effect: { type: "download", href: "/curriculo-carlos-vinicius.pdf" },
    });
    assert.deepEqual(runCommand("cv", english, state), {
      lines: [[{ text: "downloading resume-carlos-vinicius.pdf" }]],
      effect: { type: "download", href: "/resume-carlos-vinicius.pdf" },
    });
  });

  test("articles lists the posts and explains how to open one", () => {
    assert.deepEqual(lineTexts("articles"), ["1  Post novo", "2  Post antigo", "digite open 1 para ler"]);
    assert.deepEqual(lineTexts("articles", english), ["no posts yet."]);
  });

  test("open reports success, wrong usage and a missing post", () => {
    assert.deepEqual(lineTexts("open 2"), ["abrindo: Post antigo"]);
    assert.deepEqual(lineTexts("open"), ["uso: open <n>. veja os números em articles."]);
    assert.deepEqual(lineTexts("open 7"), ["não existe post 7. digite articles para ver a lista."]);
    assert.deepEqual(lineTexts("open", english), ["usage: open <n>. see the numbers in articles."]);
    assert.deepEqual(lineTexts("open 7", english), ["there is no post 7. type articles to see the list."]);
  });

  test("projects and experience announce where they go", () => {
    assert.deepEqual(lineTexts("projects"), ["abrindo a seção de projetos..."]);
    assert.deepEqual(lineTexts("experience"), ["abrindo a seção de experiência..."]);
    assert.deepEqual(lineTexts("projects", english), ["opening the projects section..."]);
    assert.deepEqual(lineTexts("experience", english), ["opening the experience section..."]);
  });

  test("theme confirms, refuses a repeat and explains its usage", () => {
    assert.deepEqual(lineTexts("theme light"), ["tema claro ativado."]);
    assert.deepEqual(lineTexts("theme dark", portuguese, { theme: "light", snow: true }), ["tema escuro ativado."]);
    assert.deepEqual(lineTexts("theme dark"), ["o tema já está escuro."]);
    assert.deepEqual(lineTexts("theme light", portuguese, { theme: "light", snow: true }), ["o tema já está claro."]);
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
    assert.deepEqual(lineTexts("snow on", portuguese, { theme: "dark", snow: false }), ["neve ligada."]);
    assert.deepEqual(lineTexts("snow on"), ["a neve já está ligada."]);
    assert.deepEqual(lineTexts("snow off", portuguese, { theme: "dark", snow: false }), ["a neve já está desligada."]);
    assert.deepEqual(lineTexts("snow maybe"), ["uso: snow [on|off]"]);
    assert.deepEqual(lineTexts("snow off", english), ["snow off."]);
    assert.deepEqual(lineTexts("snow on", english), ["the snow is already on."]);
    assert.deepEqual(lineTexts("snow maybe", english), ["usage: snow [on|off]"]);
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
