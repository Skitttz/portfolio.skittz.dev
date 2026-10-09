import type { Lang } from "../utils/switch-lang.ts";
import type { Theme } from "../utils/theme.ts";

const colorSchemes = ["default", "dracula", "gruvbox", "catppuccin", "tokyo-night"] as const;
const swatchNames = ["red", "green", "yellow", "blue", "magenta", "cyan"] as const;

type ColorScheme = (typeof colorSchemes)[number];
type Swatch = (typeof swatchNames)[number];
type Segment = { text: string; href?: string; command?: string; tone?: "accent" | "muted" | Swatch; swatch?: Swatch; scheme?: ColorScheme };
type Line = Segment[];

type Effect =
  | { type: "clear" }
  | { type: "exit" }
  | { type: "scroll"; target: "projects" | "experience" }
  | { type: "open"; href: string }
  | { type: "download"; href: string }
  | { type: "theme"; value: Theme }
  | { type: "colors"; value: ColorScheme }
  | { type: "lang"; value: Lang }
  | { type: "snow"; value: boolean };

type ShellState = { theme: Theme; snow: boolean; colors: ColorScheme };
type ShellResult = { lines: Line[]; ok?: boolean; effect?: Effect; hang?: number };

const commands = [
  { name: "help", args: "" },
  { name: "whoami", args: "" },
  { name: "neofetch", args: "" },
  { name: "stack", args: "" },
  { name: "contact", args: "" },
  { name: "cv", args: "" },
  { name: "articles", args: "" },
  { name: "open", args: "<n>" },
  { name: "projects", args: "" },
  { name: "experience", args: "" },
  { name: "theme", args: "[light|dark]" },
  { name: "colors", args: "[name]" },
  { name: "lang", args: "[pt|en]" },
  { name: "snow", args: "[on|off]" },
  { name: "clear", args: "" },
  { name: "exit", args: "" },
] as const;

type CommandName = (typeof commands)[number]["name"];

type ShellContent = {
  lang: Lang;
  prompt: string;
  welcome: Line;
  help: { name: CommandName; args: string; description: string }[];
  whoami: string[];
  neofetch: { title: string; rows: { label: string; value: string }[]; colorsLabel: string };
  stack: string[];
  contact: { label: string; href: string }[];
  cv: { href: string; file: string };
  articles: { title: string; href: string }[];
  messages: {
    unknown: Line;
    cv: string;
    articlesHint: Line;
    articlesEmpty: string;
    openDone: string;
    openUsage: Line;
    openMissing: Line;
    projects: string;
    experience: string;
    themeSet: Record<Theme, string>;
    themeAlready: Record<Theme, string>;
    themeUsage: string;
    langSet: string;
    langAlready: string;
    langUsage: string;
    snowSet: { on: string; off: string };
    snowAlready: { on: string; off: string };
    snowUsage: string;
    colorsActive: string;
    colorsHint: Line;
    colorsSet: string;
    colorsAlready: string;
    colorsUsage: string;
    exit: string;
  };
};

const themeValues = new Map<string, Theme>([["light", "light"], ["claro", "light"], ["dark", "dark"], ["escuro", "dark"]]);
const langValues = new Map<string, Lang>([["pt", "pt-br"], ["pt-br", "pt-br"], ["en", "en"]]);
const snowValues = new Map<string, boolean>([["on", true], ["off", false]]);
const argumentValues = new Map<string, readonly string[]>([
  ["theme", ["light", "dark"]],
  ["colors", colorSchemes],
  ["lang", ["pt", "en"]],
  ["snow", ["on", "off"]],
]);
const CONTACT_LABEL_WIDTH = 10;

const text = (value: string): Line => [{ text: value }];

const fillText = (template: string, values: Record<string, string>) =>
  template.replace(/\{(\w+)\}/g, (match, key: string) => (Object.hasOwn(values, key) ? values[key] : match));

const fill = (line: Line, values: Record<string, string>): Line =>
  line.map((segment) => ({ ...segment, text: fillText(segment.text, values) }));

const listCommands = ({ help }: ShellContent): ShellResult => {
  const width = Math.max(...help.map(({ name, args }) => name.length + (args ? args.length + 1 : 0))) + 2;

  return {
    lines: help.map(({ name, args, description }) => [
      { text: name, command: name },
      { text: `${args ? ` ${args}` : ""}`.padEnd(width - name.length) + description },
    ]),
    hang: width,
  };
};

const listArticles = ({ articles, messages }: ShellContent): ShellResult => {
  if (!articles.length) return { lines: [text(messages.articlesEmpty)] };

  const width = String(articles.length).length;

  return {
    lines: [
      ...articles.map(({ title, href }, index) => [{ text: `${String(index + 1).padStart(width)}  ` }, { text: title, href }]),
      messages.articlesHint,
    ],
    hang: width + 2,
  };
};

const openArticle = ([value]: string[], { articles, messages }: ShellContent): ShellResult => {
  if (!value || !/^\d+$/.test(value)) return { ok: false, lines: [messages.openUsage] };

  const article = articles[Number(value) - 1];
  if (!article) return { ok: false, lines: [fill(messages.openMissing, { n: value })] };

  return {
    lines: [text(fillText(messages.openDone, { title: article.title }))],
    effect: { type: "open", href: article.href },
  };
};

const switchTheme = ([value]: string[], { messages }: ShellContent, state: ShellState): ShellResult => {
  const theme = value === undefined ? (state.theme === "dark" ? "light" : "dark") : themeValues.get(value);

  if (!theme) return { ok: false, lines: [text(messages.themeUsage)] };
  if (theme === state.theme) return { lines: [text(messages.themeAlready[theme])] };

  return { lines: [text(messages.themeSet[theme])], effect: { type: "theme", value: theme } };
};

const switchLanguage = ([value]: string[], { lang, messages }: ShellContent): ShellResult => {
  const next = value === undefined ? (lang === "en" ? "pt-br" : "en") : langValues.get(value);

  if (!next) return { ok: false, lines: [text(messages.langUsage)] };
  if (next === lang) return { lines: [text(messages.langAlready)] };

  return { lines: [text(messages.langSet)], effect: { type: "lang", value: next } };
};

const switchSnow = ([value]: string[], { messages }: ShellContent, state: ShellState): ShellResult => {
  const snow = value === undefined ? !state.snow : snowValues.get(value);

  if (snow === undefined) return { ok: false, lines: [text(messages.snowUsage)] };

  const key = snow ? "on" : "off";
  if (snow === state.snow) return { lines: [text(messages.snowAlready[key])] };

  return { lines: [text(messages.snowSet[key])], effect: { type: "snow", value: snow } };
};

const listColors = ({ messages }: ShellContent, state: ShellState): ShellResult => {
  const width = Math.max(...colorSchemes.map((name) => name.length)) + 2;

  return {
    lines: [
      ...colorSchemes.map((name): Line => [
        { text: name, command: `colors ${name}` },
        { text: " ".repeat(width - name.length) },
        ...swatchNames.map((swatch): Segment => ({ text: "  ", swatch, scheme: name })),
        ...(name === state.colors ? [{ text: `  ${messages.colorsActive}`, tone: "muted" } as const] : []),
      ]),
      messages.colorsHint,
    ],
    hang: width,
  };
};

const switchColors = ([value]: string[], content: ShellContent, state: ShellState): ShellResult => {
  if (value === undefined) return listColors(content, state);

  const { messages } = content;
  const colors = colorSchemes.find((name) => name === value);

  if (!colors) return { ok: false, lines: [text(messages.colorsUsage)] };
  if (colors === state.colors) return { lines: [text(fillText(messages.colorsAlready, { name: colors }))] };

  return { lines: [text(fillText(messages.colorsSet, { name: colors }))], effect: { type: "colors", value: colors } };
};

const dispatch = (input: string, content: ShellContent, state: ShellState): ShellResult => {
  const [typed = "", ...rest] = input.trim().split(/\s+/);
  const name = typed.toLowerCase();
  const args = rest.map((value) => value.toLowerCase());
  const { messages } = content;

  switch (name) {
    case "":
      return { lines: [] };
    case "help":
      return listCommands(content);
    case "whoami":
    case "about":
      return { lines: content.whoami.map(text) };
    case "neofetch": {
      const { title, rows, colorsLabel } = content.neofetch;
      return {
        lines: [
          [{ text: title, tone: "accent" }],
          text("-".repeat(title.length)),
          ...[...rows, { label: colorsLabel, value: state.colors }].map(({ label, value }): Line => [
            { text: label.padEnd(10), tone: "accent" }, { text: value },
          ]),
          text(" "),
          swatchNames.flatMap((swatch, index): Segment[] => [
            ...(index ? [{ text: " " }] : []), { text: "   ", swatch },
          ]),
        ],
        hang: 10,
      };
    }
    case "stack":
      return { lines: content.stack.map(text) };
    case "contact":
      return {
        lines: content.contact.map(({ label, href }) => [{ text: label.padEnd(CONTACT_LABEL_WIDTH) }, { text: href, href }]),
        hang: CONTACT_LABEL_WIDTH,
      };
    case "cv":
      return {
        lines: [text(fillText(messages.cv, { file: content.cv.file }))],
        effect: { type: "download", href: content.cv.href },
      };
    case "articles":
      return listArticles(content);
    case "open":
      return openArticle(args, content);
    case "projects":
    case "experience":
      return { lines: [text(messages[name])], effect: { type: "scroll", target: name } };
    case "theme":
      return switchTheme(args, content, state);
    case "colors":
      return switchColors(args, content, state);
    case "lang":
      return switchLanguage(args, content);
    case "snow":
      return switchSnow(args, content, state);
    case "clear":
      return { lines: [], effect: { type: "clear" } };
    case "exit":
      return { lines: [text(messages.exit)], effect: { type: "exit" } };
    default:
      return { ok: false, lines: [fill(messages.unknown, { name: typed })] };
  }
};

const runCommand = (input: string, content: ShellContent, state: ShellState): ShellResult => {
  const result = dispatch(input, content, state);
  return input.trim() ? { ok: true, ...result } : result;
};

const commonPrefix = (values: string[]) =>
  values.reduce((prefix, value) => {
    let length = 0;
    while (length < prefix.length && prefix[length] === value[length]) length += 1;
    return prefix.slice(0, length);
  });

const complete = (input: string): { value: string; candidates: string[] } => {
  const untouched = { value: input, candidates: [] };
  const typed = input.trimStart().toLowerCase();
  if (!typed) return untouched;

  const space = typed.search(/\s/);
  const name = space === -1 ? typed : typed.slice(0, space);
  const argument = space === -1 ? null : typed.slice(space).trimStart();
  const word = argument ?? name;
  if (/\s/.test(word)) return untouched;

  const options = argument === null ? commands.map((command) => command.name) : argumentValues.get(name) ?? [];
  const matches = options.filter((option) => option.startsWith(word));
  if (!matches.length) return untouched;

  const head = argument === null ? "" : `${name} `;
  if (matches.length === 1) return { value: `${head}${matches[0]} `, candidates: [] };

  return { value: `${head}${commonPrefix(matches)}`, candidates: matches };
};

const createHistory = () => {
  const entries: string[] = [];
  let cursor = 0;

  return {
    push(entry: string) {
      const value = entry.trim();
      if (value && entries.at(-1) !== value) entries.push(value);
      cursor = entries.length;
    },
    find(prefix: string): string | undefined {
      if (!prefix.trim()) return undefined;
      return entries.findLast((entry) => entry.toLowerCase().startsWith(prefix.toLowerCase()));
    },
    previous(): string | undefined {
      if (cursor > 0) cursor -= 1;
      return entries[cursor];
    },
    next(): string {
      if (cursor < entries.length) cursor += 1;
      return entries[cursor] ?? "";
    },
  };
};

type Highlight = { text: string; type: "command" | "unknown" | "plain" };

const highlight = (input: string): Highlight[] => {
  const match = /^(\s*)(\S+)([\s\S]*)$/.exec(input);
  if (!match) return input ? [{ text: input, type: "plain" }] : [];
  const [, spaces, word, rest] = match;
  const known = word.toLowerCase() === "about" || commands.some(({ name }) => name === word.toLowerCase());
  return [
    ...(spaces ? [{ text: spaces, type: "plain" } as const] : []),
    { text: word, type: known ? "command" : "unknown" },
    ...(rest ? [{ text: rest, type: "plain" } as const] : []),
  ];
};

const suggest = (input: string, recent?: string): string => {
  if (!input.trim()) return "";
  if (recent?.toLowerCase().startsWith(input.toLowerCase())) {
    return recent.length > input.length ? input + recent.slice(input.length) : "";
  }
  const { value, candidates } = complete(input);
  const candidate = input.slice(0, input.length - input.trimStart().length) + value.trimEnd();
  if (candidates.length || candidate.length <= input.length || !candidate.toLowerCase().startsWith(input.toLowerCase())) return "";
  return input + candidate.slice(input.length);
};

export { colorSchemes, commands, complete, createHistory, highlight, runCommand, suggest };
export type { ColorScheme, CommandName, Effect, Line, Segment, ShellContent, ShellResult, ShellState };
