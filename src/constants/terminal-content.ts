export type TerminalCommand = {
  name: string;
  description: string;
  output: string[];
};

export type TerminalContent = {
  label: string;
  title: string;
  hint: string;
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
    label: "interactive terminal",
    title: "Inspect portfolio from terminal.",
    hint: "Type a command and press Enter.",
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
        output: [
          "cats",
          "  live: https://cats.skittz.dev/",
          "  repo: https://github.com/Skitttz/cats",
          "  context: social platform for cat lovers, focused on photo sharing and real-time interaction.",
          "  highlights: photo feed, authentication, likes, comments, infinite scroll and real-time chat.",
          "  stack: React, Vite, WordPress Headless, Node.js, Socket.io, TensorFlow.js and COCO-SSD.",
          "",
          "nights4films",
          "  live: https://nights4films.vercel.app/",
          "  repo: https://github.com/Skitttz/nights4films",
          "  context: movie catalog built with React, Strapi Headless CMS and Tailwind.",
          "  highlights: content management, search filters, pagination and user account flows.",
          "",
          "SurfCurse",
          "  live: https://skitttz.github.io/SurfCurse/",
          "  repo: https://github.com/Skitttz/SurfCurse",
          "  context: landing page for custom surfboards, with product selection, insurance plans and contact sections.",
          "  highlights: product storytelling, responsive layout and clear navigation between commercial sections.",
        ],
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
    label: "terminal interativo",
    title: "Inspecione o portfólio via terminal.",
    hint: "Digite um comando e pressione Enter.",
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
        output: [
          "cats",
          "  live: https://cats.skittz.dev/",
          "  repo: https://github.com/Skitttz/cats",
          "  contexto: rede social para amantes de gatos, focada em compartilhamento de fotos e interação em tempo real.",
          "  destaques: feed de fotos, autenticação, curtidas, comentários, infinite scroll e chat em tempo real.",
          "  stack: React, Vite, WordPress Headless, Node.js, Socket.io, TensorFlow.js e COCO-SSD.",
          "",
          "nights4films",
          "  live: https://nights4films.vercel.app/",
          "  repo: https://github.com/Skitttz/nights4films",
          "  contexto: catálogo de filmes construído com React, Strapi Headless CMS e Tailwind.",
          "  destaques: gestão de conteúdo, filtros de busca, paginação e fluxos de conta do usuário.",
          "",
          "SurfCurse",
          "  live: https://skitttz.github.io/SurfCurse/",
          "  repo: https://github.com/Skitttz/SurfCurse",
          "  contexto: landing page para pranchas de surf personalizadas, com seleção de produtos, planos de seguro e contato.",
          "  destaques: apresentação de produto, layout responsivo e navegação clara entre seções comerciais.",
        ],
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
