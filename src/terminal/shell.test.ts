import assert from "node:assert/strict";
import { describe, test } from "node:test";
import { complete, createHistory, runCommand } from "./shell.ts";
import type { ShellContent, ShellState } from "./shell.ts";

// A small content written by hand, so every expectation below is a literal.
const content: ShellContent = {
  lang: "en",
  prompt: "test@shell:~$",
  welcome: [{ text: "welcome" }],
  help: [
    { name: "help", args: "", description: "list commands" },
    { name: "whoami", args: "", description: "who" },
    { name: "stack", args: "", description: "tools" },
    { name: "contact", args: "", description: "links" },
    { name: "cv", args: "", description: "resume" },
    { name: "articles", args: "", description: "posts" },
    { name: "open", args: "<n>", description: "open post" },
    { name: "projects", args: "", description: "projects" },
    { name: "experience", args: "", description: "experience" },
    { name: "theme", args: "[light|dark]", description: "theme" },
    { name: "lang", args: "[pt|en]", description: "language" },
    { name: "snow", args: "[on|off]", description: "snow" },
    { name: "clear", args: "", description: "clear" },
    { name: "exit", args: "", description: "leave" },
  ],
  whoami: ["Ada Lovelace", "Engineer"],
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
    exit: "bye",
  },
};

const dark: ShellState = { theme: "dark", snow: true };
const light: ShellState = { theme: "light", snow: false };
const run = (input: string, state = dark, source = content) => runCommand(input, source, state);

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

  test("open with a listed number navigates to that post", () => {
    assert.deepEqual(run("open 2"), {
      lines: [[{ text: "opening: First post" }]],
      effect: { type: "navigate", href: "/en/articles/first" },
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

  test("projects and experience ask to scroll to their sections", () => {
    assert.deepEqual(run("projects"), {
      lines: [[{ text: "to projects" }]],
      effect: { type: "scroll", target: "projects" },
    });
    assert.deepEqual(run("experience"), {
      lines: [[{ text: "to experience" }]],
      effect: { type: "scroll", target: "experience" },
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
    assert.deepEqual(lines[6], [{ text: "open", command: "open" }, { text: " <n>            open post" }]);
    assert.deepEqual(lines[9], [{ text: "theme", command: "theme" }, { text: " [light|dark]  theme" }]);
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
  });

  test("an ambiguous prefix completes to the common part and lists the candidates", () => {
    assert.deepEqual(complete("e"), { value: "ex", candidates: ["experience", "exit"] });
    assert.deepEqual(complete("c"), { value: "c", candidates: ["contact", "cv", "clear"] });
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
