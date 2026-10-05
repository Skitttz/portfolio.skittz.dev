import { projectContent, projectPath } from "@/constants/projects";

const projectLines = (lang: "en" | "pt-br"): string[] => {
  const content = projectContent[lang];
  return [
    ...[...content.projects, ...content.otherProjects].flatMap((project) => [
      project.name,
      `  ${project.summary}`,
      ...(project.stack.length ? [`  stack: ${project.stack.join(", ")}`] : []),
      `  case: https://portfolio.skittz.dev${projectPath(lang, project.slug)}`,
      ...(project.href ? [`  repo: ${project.href}`] : []),
      ...(project.live && !project.livePaused ? [`  demo: ${project.live}`] : []),
      ...(project.livePaused ? [`  ${content.pausedLabel}`] : []),
      "",
    ]),
  ];
};

export type TerminalCommand = {
  name: string;
  description: string;
  output: string[];
};

export type TerminalContent = {
  label: string;
  title: string;
  hint?: string;
  closedHint: string;
  restoreLabel: string;
  prompt: string;
  welcome: string[];
  boot: string[];
  unknown: string;
  commands: TerminalCommand[];
};

export const terminalContent = {
  en: {
    label: "Extra / interactive terminal",
    title: "Portfolio terminal.",
    closedHint: "Terminal closed. Press the button below to boot a new session.",
    restoreLabel: "boot terminal",
    prompt: "skittz@portfolio:~$",
    welcome: ["type `help` to list available commands"],
    boot: [
      "starting terminal...",
      "preparing session...",
      "checking commands...",
      "ready",
    ],
    unknown: "Command not found. Type `help` to list available commands",
    commands: [
      {
        name: "help",
        description: "list commands",
        output: [
          "about     short profile",
          "projects  selected builds and decisions",
          "stack     tools and technical context",
          "contact   useful links",
          "clear     reset terminal",
        ],
      },
      {
        name: "about",
        description: "profile",
        output: [
          "Front-end developer focused on responsive, maintainable interfaces.",
          "I work close to product context: flows, states, performance and handoff.",
          "Main ecosystem: React, Astro, Next.js, Vite and Tailwind.",
        ],
      },
      {
        name: "projects",
        description: "featured work",
        output: projectLines("en"),
      },
      {
        name: "stack",
        description: "technical index",
        output: [
          "ui:      React, Astro, Next.js, Tailwind",
          "build:   Vite, component-driven structure",
          "backend: Node.js, Express, REST APIs",
          "cms:     Strapi, WordPress Headless",
        ],
      },
      {
        name: "contact",
        description: "links",
        output: [
          "linkedin: https://linkedin.com/in/carlos-vinicius-dev",
          "github:   https://github.com/skitttz",
          "cv        use the Download CV button above",
        ],
      },
    ],
  },
  "pt-br": {
    label: "Extra / terminal interativo",
    title: "Terminal do portfólio.",
    closedHint: "Terminal fechado. Pressione o botão abaixo para iniciar uma nova sessão.",
    restoreLabel: "iniciar terminal",
    prompt: "skittz@portfolio:~$",
    welcome: ["digite `help` para listar os comandos"],
    boot: [
      "iniciando terminal...",
      "preparando sessão...",
      "verificando comandos...",
      "pronto",
    ],
    unknown: "Comando não encontrado. Digite `help` para listar os comandos",
    commands: [
      {
        name: "help",
        description: "lista os comandos",
        output: [
          "about     perfil curto",
          "projects  projetos selecionados e decisões",
          "stack     ferramentas e contexto técnico",
          "contact   links úteis",
          "clear     limpa o terminal",
        ],
      },
      {
        name: "about",
        description: "perfil",
        output: [
          "Desenvolvedor front-end focado em interfaces responsivas e sustentáveis.",
          "Trabalho perto do contexto de produto: fluxos, estados, performance e handoff.",
          "Ecossistema principal: React, Astro, Next.js, Vite e Tailwind.",
        ],
      },
      {
        name: "projects",
        description: "destaques",
        output: projectLines("pt-br"),
      },
      {
        name: "stack",
        description: "índice técnico",
        output: [
          "ui:      React, Astro, Next.js, Tailwind",
          "build:   Vite, estrutura orientada a componentes",
          "backend: Node.js, Express, APIs REST",
          "cms:     Strapi, WordPress Headless",
        ],
      },
      {
        name: "contact",
        description: "links",
        output: [
          "linkedin: https://linkedin.com/in/carlos-vinicius-dev",
          "github:   https://github.com/skitttz",
          "cv        use o botão Baixar CV acima",
        ],
      },
    ],
  },
} satisfies Record<string, TerminalContent>;
