import assert from "node:assert/strict";
import { describe, test } from "node:test";
import { colorSchemes, complete, createHistory, highlight, runCommand, suggest } from "./shell.ts";
import type { ShellContent, ShellState } from "./shell.ts";

const content: ShellContent = {
  lang: "en",
  prompt: "test@shell:~$",
  welcome: [{ text: "welcome" }],
  help: [
    { name: "help", args: "", description: "list commands" },
    { name: "whoami", args: "", description: "who" },
    { name: "neofetch", args: "", description: "summary" },
    { name: "stack", args: "", description: "tools" },
    { name: "contact", args: "", description: "links" },
    { name: "cv", args: "", description: "resume" },
    { name: "articles", args: "", description: "posts" },
    { name: "open", args: "<n>", description: "open post" },
    { name: "projects", args: "", description: "projects" },
    { name: "experience", args: "", description: "experience" },
    { name: "theme", args: "[light|dark]", description: "theme" },
    { name: "colors", args: "[name]", description: "colors" },
    { name: "lang", args: "[pt|en]", description: "language" },
    { name: "snow", args: "[on|off]", description: "snow" },
    { name: "clear", args: "", description: "clear" },
    { name: "exit", args: "", description: "leave" },
  ],
  whoami: ["Ada Lovelace", "Engineer"],
  neofetch: {
    title: "ada@shell",
    rows: [
      { label: "role", value: "Engineer" },
      { label: "uptime", value: "1 year" },
    ],
    colorsLabel: "colors",
  },
  stack: ["ui: a", "build: b"],
  contact: [{ label: "site", href: "https://example.com" }],
  cv: { href: "/cv.pdf", file: "cv.pdf" },
  articles: [
    { title: "Second post", href: "/en/articles/second" },
    { title: "First post", href: "/en/articles/first" },
  ],
  messages: {
    unknown: [{ text: "not found: {name}. try " }, { text: "help", command: "help" }],
    cv: "downloading {file}",
    articlesHint: [{ text: "type " }, { text: "open 1", command: "open 1" }],
    articlesEmpty: "no posts",
    openDone: "opening: {title}",
    openUsage: [{ text: "usage: open <n>" }],
    openMissing: [{ text: "no post {n}" }],
    projects: "to projects",
    experience: "to experience",
    themeSet: { light: "light on", dark: "dark on" },
    themeAlready: { light: "already light", dark: "already dark" },
    themeUsage: "usage: theme",
    langSet: "switching",
    langAlready: "already english",
    langUsage: "usage: lang",
    snowSet: { on: "snow on", off: "snow off" },
    snowAlready: { on: "already on", off: "already off" },
    snowUsage: "usage: snow",
    colorsActive: "(active)",
    colorsHint: [{ text: "type " }, { text: "colors dracula", command: "colors dracula" }],
    colorsSet: "colors: {name}",
    colorsAlready: "already {name}",
    colorsUsage: "usage: colors",
    exit: "bye",
  },
};

const dark: ShellState = { theme: "dark", snow: true, colors: "default" };
const light: ShellState = { theme: "light", snow: false, colors: "default" };
const run = (input: string, state = dark, source = content) => {
  const { ok, ...result } = runCommand(input, source, state);
  return result;
};

describe("runCommand", () => {
  test("an empty line prints nothing and has no effect", () => {
    assert.deepEqual(run(""), { lines: [] });
    assert.deepEqual(run("   "), { lines: [] });
  });

  test("command names ignore case and surrounding spaces", () => {
    assert.deepEqual(run("  WhoAmI  "), run("whoami"));
  });

  test("whoami prints the identity lines", () => {
    assert.deepEqual(run("whoami"), { lines: [[{ text: "Ada Lovelace" }], [{ text: "Engineer" }]] });
  });

  test("about is an alias of whoami", () => {
    assert.deepEqual(run("about"), run("whoami"));
  });

  test("neofetch prints the card, the active scheme and the color strip", () => {
    assert.deepEqual(run("neofetch", { ...dark, colors: "dracula" }), {
      lines: [
        [{ text: "ada@shell", tone: "accent" }],
        [{ text: "---------" }],
        [{ text: "role      ", tone: "accent" }, { text: "Engineer" }],
        [{ text: "uptime    ", tone: "accent" }, { text: "1 year" }],
        [{ text: "colors    ", tone: "accent" }, { text: "dracula" }],
        [{ text: " " }],
        [
          { text: "   ", swatch: "red" },
          { text: " " },
          { text: "   ", swatch: "green" },
          { text: " " },
          { text: "   ", swatch: "yellow" },
          { text: " " },
          { text: "   ", swatch: "blue" },
          { text: " " },
          { text: "   ", swatch: "magenta" },
          { text: " " },
          { text: "   ", swatch: "cyan" },
        ],
      ],
      hang: 10,
    });
  });

  test("neofetch names the scheme that is active when it runs", () => {
    assert.deepEqual(run("neofetch").lines[4], [{ text: "colors    ", tone: "accent" }, { text: "default" }]);
    assert.deepEqual(run("NeoFetch", { ...light, colors: "tokyo-night" }).lines[4][1], { text: "tokyo-night" });
  });

  test("stack prints one line per entry", () => {
    assert.deepEqual(run("stack"), { lines: [[{ text: "ui: a" }], [{ text: "build: b" }]] });
  });

  test("contact renders each entry as a link", () => {
    assert.deepEqual(run("contact"), {
      lines: [[{ text: "site      " }, { text: "https://example.com", href: "https://example.com" }]],
      hang: 10,
    });
  });

  test("cv names the file and downloads it", () => {
    assert.deepEqual(run("cv"), {
      lines: [[{ text: "downloading cv.pdf" }]],
      effect: { type: "download", href: "/cv.pdf" },
    });
  });

  test("articles numbers the posts, links each title and ends with the hint", () => {
    assert.deepEqual(run("articles"), {
      lines: [
        [{ text: "1  " }, { text: "Second post", href: "/en/articles/second" }],
        [{ text: "2  " }, { text: "First post", href: "/en/articles/first" }],
        [{ text: "type " }, { text: "open 1", command: "open 1" }],
      ],
      hang: 3,
    });
  });

  test("articles without posts prints the empty message", () => {
    assert.deepEqual(run("articles", dark, { ...content, articles: [] }), { lines: [[{ text: "no posts" }]] });
  });

  test("open with a listed number asks to open that post", () => {
    assert.deepEqual(run("open 2"), {
      lines: [[{ text: "opening: First post" }]],
      effect: { type: "open", href: "/en/articles/first" },
    });
  });

  test("open without a whole number prints the usage", () => {
    for (const input of ["open", "open abc", "open 1.5", "open -1", "open 1e3"]) {
      assert.deepEqual(run(input), { lines: [[{ text: "usage: open <n>" }]] }, input);
    }
  });

  test("open with a number outside the list says the post does not exist", () => {
    assert.deepEqual(run("open 3"), { lines: [[{ text: "no post 3" }]] });
    assert.deepEqual(run("open 0"), { lines: [[{ text: "no post 0" }]] });
    assert.deepEqual(run("open 99999999999999999999"), { lines: [[{ text: "no post 99999999999999999999" }]] });
  });

  test("projects and experience ask to open a panel inside the terminal", () => {
    assert.deepEqual(run("projects"), {
      lines: [[{ text: "to projects" }]],
      effect: { type: "panel", target: "projects" },
    });
    assert.deepEqual(run("experience"), {
      lines: [[{ text: "to experience" }]],
      effect: { type: "panel", target: "experience" },
    });
  });

  test("theme without an argument switches to the other theme", () => {
    assert.deepEqual(run("theme", dark), { lines: [[{ text: "light on" }]], effect: { type: "theme", value: "light" } });
    assert.deepEqual(run("theme", light), { lines: [[{ text: "dark on" }]], effect: { type: "theme", value: "dark" } });
  });

  test("theme accepts the English and the Portuguese values", () => {
    assert.deepEqual(run("theme light", dark).effect, { type: "theme", value: "light" });
    assert.deepEqual(run("theme claro", dark).effect, { type: "theme", value: "light" });
    assert.deepEqual(run("theme dark", light).effect, { type: "theme", value: "dark" });
    assert.deepEqual(run("theme ESCURO", light).effect, { type: "theme", value: "dark" });
  });

  test("theme with the active value changes nothing", () => {
    assert.deepEqual(run("theme dark", dark), { lines: [[{ text: "already dark" }]] });
    assert.deepEqual(run("theme light", light), { lines: [[{ text: "already light" }]] });
  });

  test("theme with an unknown value prints the usage", () => {
    for (const input of ["theme blue", "theme constructor", "theme __proto__"]) {
      assert.deepEqual(run(input), { lines: [[{ text: "usage: theme" }]] }, input);
    }
  });

  test("lang without an argument switches to the other language", () => {
    assert.deepEqual(run("lang"), { lines: [[{ text: "switching" }]], effect: { type: "lang", value: "pt-br" } });
    assert.deepEqual(run("lang", dark, { ...content, lang: "pt-br" }).effect, { type: "lang", value: "en" });
  });

  test("lang accepts pt, pt-br and en", () => {
    assert.deepEqual(run("lang pt").effect, { type: "lang", value: "pt-br" });
    assert.deepEqual(run("lang pt-br").effect, { type: "lang", value: "pt-br" });
    assert.deepEqual(run("lang en", dark, { ...content, lang: "pt-br" }).effect, { type: "lang", value: "en" });
  });

  test("lang with the current language changes nothing", () => {
    assert.deepEqual(run("lang en"), { lines: [[{ text: "already english" }]] });
  });

  test("lang with an unknown value prints the usage", () => {
    for (const input of ["lang fr", "lang toString"]) {
      assert.deepEqual(run(input), { lines: [[{ text: "usage: lang" }]] }, input);
    }
  });

  test("snow without an argument flips the current state", () => {
    assert.deepEqual(run("snow", dark), { lines: [[{ text: "snow off" }]], effect: { type: "snow", value: false } });
    assert.deepEqual(run("snow", light), { lines: [[{ text: "snow on" }]], effect: { type: "snow", value: true } });
  });

  test("snow on and snow off set the state", () => {
    assert.deepEqual(run("snow on", light).effect, { type: "snow", value: true });
    assert.deepEqual(run("snow off", dark).effect, { type: "snow", value: false });
  });

  test("snow with the active value changes nothing", () => {
    assert.deepEqual(run("snow on", dark), { lines: [[{ text: "already on" }]] });
    assert.deepEqual(run("snow off", light), { lines: [[{ text: "already off" }]] });
  });

  test("snow with an unknown value prints the usage", () => {
    for (const input of ["snow maybe", "snow valueOf"]) {
      assert.deepEqual(run(input), { lines: [[{ text: "usage: snow" }]] }, input);
    }
  });

  test("the five color schemes are exported in listing order", () => {
    assert.deepEqual(colorSchemes, ["default", "dracula", "gruvbox", "catppuccin", "tokyo-night"]);
  });

  test("colors without an argument lists every scheme with its own swatches and marks the active one", () => {
    const strip = (scheme: string) =>
      ["red", "green", "yellow", "blue", "magenta", "cyan"].map((swatch) => ({ text: "  ", swatch, scheme }));

    assert.deepEqual(run("colors", { ...dark, colors: "gruvbox" }), {
      lines: [
        [{ text: "default", command: "colors default" }, { text: "      " }, ...strip("default")],
        [{ text: "dracula", command: "colors dracula" }, { text: "      " }, ...strip("dracula")],
        [{ text: "gruvbox", command: "colors gruvbox" }, { text: "      " }, ...strip("gruvbox"), { text: "  (active)", tone: "muted" }],
        [{ text: "catppuccin", command: "colors catppuccin" }, { text: "   " }, ...strip("catppuccin")],
        [{ text: "tokyo-night", command: "colors tokyo-night" }, { text: "  " }, ...strip("tokyo-night")],
        [{ text: "type " }, { text: "colors dracula", command: "colors dracula" }],
      ],
      hang: 13,
    });
  });

  test("colors with a scheme name asks to switch to it", () => {
    assert.deepEqual(run("colors dracula"), {
      lines: [[{ text: "colors: dracula" }]],
      effect: { type: "colors", value: "dracula" },
    });
    assert.deepEqual(run("colors DEFAULT", { ...dark, colors: "dracula" }).effect, { type: "colors", value: "default" });
    assert.deepEqual(run("colors tokyo-night").effect, { type: "colors", value: "tokyo-night" });
  });

  test("colors with the active scheme changes nothing", () => {
    assert.deepEqual(run("colors default"), { lines: [[{ text: "already default" }]] });
    assert.deepEqual(run("colors gruvbox", { ...dark, colors: "gruvbox" }), { lines: [[{ text: "already gruvbox" }]] });
  });

  test("colors with an unknown name prints the usage", () => {
    for (const input of ["colors solarized", "colors constructor", "colors __proto__", "colors 0", "colors length", "colors dracula-pro"]) {
      assert.deepEqual(run(input), { lines: [[{ text: "usage: colors" }]] }, input);
    }
  });

  test("clear asks to empty the screen", () => {
    assert.deepEqual(run("clear"), { lines: [], effect: { type: "clear" } });
  });

  test("exit says goodbye and leaves", () => {
    assert.deepEqual(run("exit"), { lines: [[{ text: "bye" }]], effect: { type: "exit" } });
  });

  test("an unknown command is named as it was typed", () => {
    assert.deepEqual(run("Sudo rm -rf"), {
      lines: [[{ text: "not found: Sudo. try " }, { text: "help", command: "help" }]],
    });
  });

  test("object property names are not commands", () => {
    for (const input of ["constructor", "__proto__", "toString", "hasOwnProperty"]) {
      assert.deepEqual(run(input), {
        lines: [[{ text: `not found: ${input}. try ` }, { text: "help", command: "help" }]],
      });
    }
  });

  test("text that looks like markup or a placeholder stays plain text", () => {
    assert.deepEqual(run("<img/src=x>"), {
      lines: [[{ text: "not found: <img/src=x>. try " }, { text: "help", command: "help" }]],
    });
    assert.deepEqual(run("{name}"), {
      lines: [[{ text: "not found: {name}. try " }, { text: "help", command: "help" }]],
    });
  });

  test("help lists every command with a runnable name and aligned descriptions", () => {
    const { lines, effect, hang } = run("help");

    assert.equal(effect, undefined);
    assert.equal(hang, 20);
    assert.deepEqual(lines.map((line) => line[0]), content.help.map(({ name }) => ({ text: name, command: name })));
    assert.deepEqual(lines[0], [{ text: "help", command: "help" }, { text: "                list commands" }]);
    assert.deepEqual(lines[2], [{ text: "neofetch", command: "neofetch" }, { text: "            summary" }]);
    assert.deepEqual(lines[7], [{ text: "open", command: "open" }, { text: " <n>            open post" }]);
    assert.deepEqual(lines[10], [{ text: "theme", command: "theme" }, { text: " [light|dark]  theme" }]);
  });
});

describe("complete", () => {
  test("an empty field completes nothing", () => {
    assert.deepEqual(complete(""), { value: "", candidates: [] });
    assert.deepEqual(complete("   "), { value: "   ", candidates: [] });
  });

  test("a unique command prefix completes with a trailing space", () => {
    assert.deepEqual(complete("he"), { value: "help ", candidates: [] });
    assert.deepEqual(complete("exi"), { value: "exit ", candidates: [] });
    assert.deepEqual(complete("n"), { value: "neofetch ", candidates: [] });
  });

  test("an ambiguous prefix completes to the common part and lists the candidates", () => {
    assert.deepEqual(complete("e"), { value: "ex", candidates: ["experience", "exit"] });
    assert.deepEqual(complete("c"), { value: "c", candidates: ["contact", "cv", "colors", "clear"] });
  });

  test("an unknown prefix is left alone", () => {
    assert.deepEqual(complete("zz"), { value: "zz", candidates: [] });
  });

  test("the about alias is not offered", () => {
    assert.deepEqual(complete("ab"), { value: "ab", candidates: [] });
  });

  test("completion ignores case", () => {
    assert.deepEqual(complete("TH"), { value: "theme ", candidates: [] });
  });

  test("the fixed arguments of theme, lang and snow complete", () => {
    assert.deepEqual(complete("theme l"), { value: "theme light ", candidates: [] });
    assert.deepEqual(complete("lang "), { value: "lang ", candidates: ["pt", "en"] });
    assert.deepEqual(complete("snow o"), { value: "snow o", candidates: ["on", "off"] });
    assert.deepEqual(complete("snow of"), { value: "snow off ", candidates: [] });
  });

  test("the scheme names of colors complete", () => {
    assert.deepEqual(complete("col"), { value: "colors ", candidates: [] });
    assert.deepEqual(complete("colors tok"), { value: "colors tokyo-night ", candidates: [] });
    assert.deepEqual(complete("colors d"), { value: "colors d", candidates: ["default", "dracula"] });
  });

  test("commands without fixed arguments complete nothing after the name", () => {
    assert.deepEqual(complete("open 1"), { value: "open 1", candidates: [] });
    assert.deepEqual(complete("help x"), { value: "help x", candidates: [] });
    assert.deepEqual(complete("constructor x"), { value: "constructor x", candidates: [] });
  });

  test("a second argument is left alone", () => {
    assert.deepEqual(complete("theme light d"), { value: "theme light d", candidates: [] });
  });
});

describe("createHistory", () => {
  test("previous walks back from the newest entry and stops at the oldest", () => {
    const history = createHistory();
    history.push("whoami");
    history.push("stack");

    assert.equal(history.previous(), "stack");
    assert.equal(history.previous(), "whoami");
    assert.equal(history.previous(), "whoami");
  });

  test("next walks forward and ends on an empty line", () => {
    const history = createHistory();
    history.push("whoami");
    history.push("stack");
    history.previous();
    history.previous();

    assert.equal(history.next(), "stack");
    assert.equal(history.next(), "");
    assert.equal(history.next(), "");
  });

  test("empty lines and immediate repeats are not recorded", () => {
    const history = createHistory();
    history.push("help");
    history.push("   ");
    history.push("help");

    assert.equal(history.previous(), "help");
    assert.equal(history.previous(), "help");
    assert.equal(history.next(), "");
  });

  test("sending a command returns the cursor to the newest entry", () => {
    const history = createHistory();
    history.push("whoami");
    history.push("stack");
    history.previous();
    history.previous();
    history.push("help");

    assert.equal(history.previous(), "help");
  });

  test("with nothing recorded there is nothing to recall", () => {
    const history = createHistory();

    assert.equal(history.previous(), undefined);
    assert.equal(history.next(), "");
  });
});

describe("prompt status and typing aids", () => {
  test("invalid commands and arguments fail while successful or repeated actions succeed", () => {
    for (const input of ["nope", "open", "open abc", "open 0", "open 3", "theme blue", "lang constructor", "snow __proto__", "colors solarized"]) {
      assert.equal(runCommand(input, content, dark).ok, false, input);
    }
    for (const input of ["help", "whoami", "about", "neofetch", "stack", "contact", "cv", "articles", "open 1", "projects", "experience", "theme light", "theme dark", "lang en", "lang pt", "snow on", "snow off", "colors", "colors default", "colors dracula", "clear", "exit"]) {
      assert.equal(runCommand(input, content, dark).ok, true, input);
    }
    assert.equal(runCommand("   ", content, dark).ok, undefined);
  });

  test("highlight preserves whitespace, recognizes case and aliases, and leaves arguments plain", () => {
    assert.deepEqual(highlight(""), []);
    assert.deepEqual(highlight("  "), [{ text: "  ", type: "plain" }]);
    assert.deepEqual(highlight("  THEME light"), [
      { text: "  ", type: "plain" }, { text: "THEME", type: "command" }, { text: " light", type: "plain" },
    ]);
    assert.deepEqual(highlight("about"), [{ text: "about", type: "command" }]);
    assert.deepEqual(highlight("constructor x"), [{ text: "constructor", type: "unknown" }, { text: " x", type: "plain" }]);
  });

  test("history finds the newest prefix without moving the recall cursor", () => {
    const history = createHistory();
    history.push("colors dracula");
    history.push("colors gruvbox");
    history.push("help");
    assert.equal(history.find("COL"), "colors gruvbox");
    assert.equal(history.find(""), undefined);
    assert.equal(history.find("nope"), undefined);
    assert.equal(history.previous(), "help");
  });

  test("suggestion prefers recent history and otherwise uses only a unique completion", () => {
    assert.equal(suggest("co", "colors gruvbox"), "colors gruvbox");
    assert.equal(suggest("COL", "colors dracula"), "COLors dracula");
    assert.equal(suggest("he"), "help");
    assert.equal(suggest("  he"), "  help");
    assert.equal(suggest("colors tok"), "colors tokyo-night");
    for (const input of ["", "  ", "help", "c", "colors d", "zzz"]) assert.equal(suggest(input), "", input);
    assert.equal(suggest("help", "help"), "");
    assert.equal(suggest("help", "HELPer"), "helper");
  });
});
