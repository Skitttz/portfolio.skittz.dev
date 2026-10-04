export type Project = {
  slug: string;
  name: string;
  category: string;
  summary: string;
  challenge: string;
  solution: string;
  evidence: string;
  stack: string[];
  details?: string[];
  href?: string;
  live?: string;
  livePaused?: boolean;
  featured?: boolean;
  feature?: {
    label: string;
    title: string;
    description: string;
    href: string;
    linkLabel: string;
  };
};

export type OtherProject = Project;

export type Experience = {
  period: string;
  role: string;
  company: string;
  location: string;
  description: string;
  contributions: string[];
  stack: string;
  icon: string;
  impact: string;
  impactLabel: string;
};

export type ProjectContent = {
  eyebrow: string;
  title: string;
  intro: string;
  challengeLabel: string;
  solutionLabel: string;
  evidenceLabel: string;
  sourceLabel: string;
  demoLabel: string;
  caseLabel: string;
  pausedLabel: string;
  visualLabel: string;
  otherLabel: string;
  liveLabel: string;
  experienceEyebrow: string;
  experienceTitle: string;
  experienceIntro: string;
  experience: Experience[];
  resumeLabel: string;
  projects: Project[];
  otherProjects: OtherProject[];
};

export const projectContent: Record<"pt-br" | "en", ProjectContent> = {
  "pt-br": {
    eyebrow: "Trabalho selecionado / 01",
    title: "Por dentro de projetos pessoais.",
    intro:
      "Uma marca com história jogável, um produto financeiro, conversas em tempo real e arquivos compartilhados entre navegadores.",
    challengeLabel: "Desafio",
    solutionLabel: "Como resolvi",
    evidenceLabel: "O que pode ser visto",
    sourceLabel: "Ver código",
    demoLabel: "Abrir demo",
    caseLabel: "Ver detalhes",
    pausedLabel: "Demo pausada no momento",
    visualLabel: "Visual conceitual",
    otherLabel: "Outros projetos",
    liveLabel: "Abrir site",
    experienceEyebrow: "Experiência profissional / 02",
    experienceTitle: "Trajetória profissional.",
    experienceIntro:
      "De entregas diretas para clientes a produtos desenvolvidos em equipe. Cada etapa ampliou o escopo do meu trabalho no front-end.",
    experience: [
      {
        period: "Nov 2024 — atual",
        role: "Desenvolvedor Front-end Pleno",
        company: "WeFit",
        location: "Remoto · São Paulo, SP",
        description: "Atuação em produtos de banking, seguros e saúde, levando sistemas de design definidos pelo time de UX/UI para mais de oito aplicações.",
        contributions: [
          "Bibliotecas de componentes e documentação no Storybook para dar consistência às interfaces.",
          "Suíte E2E com Playwright integrada ao cliente para cobrir fluxos críticos.",
          "Diagnóstico de falhas em pipelines de CI/CD para manter a integração estável.",
        ],
        stack: "React · Next.js · TypeScript · Playwright · Storybook",
        icon: "mdi:layers-triple-outline",
        impact: "4h → 1h20",
        impactLabel: "ciclo de validação QA",
      },
      {
        period: "Out 2023 — Out 2024",
        role: "Desenvolvedor Fullstack Júnior",
        company: "SergipeTec",
        location: "Presencial · Aracaju, SE",
        description: "Desenvolvimento de um portal institucional com gestão de arquivos e autenticação JWT, do front-end à infraestrutura local.",
        contributions: [
          "Migração e validação de registros legados, eliminando cerca de 50 horas de trabalho manual.",
          "Ambiente em Docker e documentação arquitetural C4 para facilitar a continuidade do projeto.",
        ],
        stack: "Next.js · React · Node.js · Strapi · PostgreSQL · Docker",
        icon: "mdi:database-arrow-right-outline",
        impact: "200+",
        impactLabel: "registros legados migrados",
      },
      {
        period: "Jan 2023 — Set 2023",
        role: "Desenvolvedor Front-end Freelancer",
        company: "Autônomo",
        location: "Remoto · Brasil",
        description: "Criação de landing pages para escritórios jurídicos e consultorias, acompanhando o trabalho desde o levantamento de requisitos até a entrega.",
        contributions: [
          "Páginas com atenção a UX, acessibilidade, SEO e desempenho.",
          "Contato direto com clientes para transformar objetivos comerciais em páginas utilizáveis.",
        ],
        stack: "React · JavaScript · HTML · CSS · Figma",
        icon: "mdi:briefcase-outline",
        impact: "8+",
        impactLabel: "páginas entregues a clientes",
      },
    ],
    resumeLabel: "Ver currículo completo",
    projects: [
      {
        slug: "fates",
        name: "Fates v2",
        category: "Vitrine streetwear · Front-end",
        summary:
          "Vitrine de streetwear com catálogo, fluxo de pedido simulado e uma história de origem que o visitante pode jogar.",
        challenge:
          "Apresentar produtos e simular o fluxo de pedido sem acoplar a interface ao formato da API.",
        solution:
          "Organizei o front-end em camadas, injetei os casos de uso em Server Components e criei um modo demo com os mesmos contratos da API.",
        evidence:
          "Catálogo, carrinho, login e pedido simulado em modo demo; sem compra real nem pagamento.",
        details: [
          "A vitrine funciona em modo demo com os mesmos contratos dos casos de uso usados pela integração com a API: é possível percorrer catálogo, produto, carrinho e checkout simulado sem backend. Os pedidos do mock não são persistidos e não existe pagamento.",
          "A página Sobre transforma a origem da marca em uma história interativa. O ollie e a escolha do primeiro adesivo alteram cenas e falas; há alternativa em texto para quem não usa o canvas.",
          "A separação entre domínio, aplicação, infraestrutura e apresentação ajuda a testar regras sem renderizar a interface. Vitest cobre unidades e integrações; Cypress percorre os fluxos no navegador.",
        ],
        stack: ["Next.js", "React", "TypeScript", "Clean Architecture", "Vitest", "Cypress"],
        href: "https://github.com/Skitttz/fates-v2",
        featured: true,
        feature: {
          label: "Além da vitrine",
          title: "O Sobre é um minijogo",
          description:
            "A origem da Fates começa numa pista em Aracaju. O visitante tenta um ollie, atravessa um cenário em pixel art e escolhe onde colar o primeiro adesivo da marca. Falas e desfecho respondem às escolhas; há controles de toque, áudio e versão em texto.",
          href: "https://github.com/Skitttz/fates-v2/tree/main/src/presentation/components/story",
          linkLabel: "Explorar a implementação do jogo",
        },
      },
      {
        slug: "athow",
        name: "Athow",
        category: "Finanças · Full stack · MCP",
        summary:
          "Um MVP de finanças pessoais que transforma extratos em visão de gastos, limites e metas.",
        challenge:
          "Unificar dados de extratos CSV e OFX e permitir consultas seguras também por assistentes.",
        solution:
          "Construí dashboard, API modular e integração MCP com OAuth; cada consulta é vinculada à conta do usuário.",
        evidence:
          "Importação, categorização, revisão mensal e resumos apresentados no dashboard e no chat.",
        details: [
          "O produto reúne extratos CSV e OFX, regras de categorização, limites por categoria, metas e revisão do mês em um fluxo único.",
          "A API organiza as regras por módulos. O servidor MCP usa OAuth: o assistente recebe autorização do usuário e cada ferramenta consulta apenas os dados daquela conta.",
          "O resumo mensal aparece tanto no dashboard quanto na interface do assistente, mantendo a leitura financeira consistente entre os dois canais.",
        ],
        stack: ["Next.js", "React", "FastAPI", "PostgreSQL", "OAuth", "MCP"],
        live: "https://athow.vercel.app/",
        featured: true,
      },
      {
        slug: "cats",
        name: "Cats",
        category: "Rede social · Tempo real",
        summary: "Rede social de gatos com feed infinito, chat ao vivo e detecção de gatos no navegador.",
        challenge: "Evoluir um projeto React em uma experiência social com publicações, contas e mensagens em tempo real sem pesar o carregamento inicial.",
        solution: "Integrei a interface a uma API WordPress headless e ao Socket.io, carregando chat, gráficos e detector apenas quando necessários.",
        evidence: "Feed de fotos, curtidas, comentários, estatísticas, chat público e privado, detector de gatos e instalação como PWA.",
        details: [
          "O projeto começou como conclusão de um curso de React e cresceu para uma aplicação com API WordPress headless, sessões JWT, perfis e feed com carregamento infinito.",
          "Ao publicar uma foto, o navegador usa TensorFlow.js e COCO-SSD para detectar gatos na imagem antes do envio. O detector é carregado sob demanda.",
          "O chat reúne sala pública e conversas privadas com presença, indicador de digitação, reconexão e histórico paginado. Mensagens novas aparecem de forma otimista; as não lidas têm contador e podem gerar notificação enquanto a aba está oculta.",
          "Como PWA, o Cats mantém a estrutura estática disponível offline. Consultas autenticadas e mensagens via Socket.io continuam dependentes da rede.",
        ],
        stack: ["React", "Vite", "WordPress Headless", "Socket.io", "TensorFlow.js", "PWA"],
        href: "https://github.com/Skitttz/cats",
        live: "https://cats.skittz.dev/",
      },
      {
        slug: "passai",
        name: "Passai",
        category: "Arquivos · WebRTC",
        summary:
          "Salas privadas para enviar arquivos diretamente entre navegadores, sem armazená-los no servidor.",
        challenge: "Compartilhar arquivos sem criar conta nem deixar uma cópia permanente em um serviço.",
        solution: "Criação de salas por chave e transferência direta via WebRTC, com rota de relay quando necessária.",
        evidence: "Criar ou entrar em uma sala, enviar arquivos e pastas e acompanhar os downloads.",
        details: [
          "Uma chave dá acesso à sala. Os navegadores negociam a conexão e transferem arquivos e pastas por WebRTC, com rota de relay quando a conexão direta não é possível.",
          "A demo permite testar o fluxo sem cadastro e deixa claro que os arquivos não ficam guardados no servidor após a transferência.",
        ],
        stack: ["React", "WebRTC", "Connect RPC"],
        live: "https://mepassai.vercel.app/",
      },
    ],
    otherProjects: [
      {
        slug: "nights4films",
        name: "Nights4Films",
        category: "Catálogo · Conteúdo",
        summary: "Catálogo de filmes com busca, filtros e conteúdo gerenciado por Strapi.",
        challenge: "Facilitar a descoberta de filmes em um catálogo que pode ser atualizado sem mudar o front-end.",
        solution: "Integrei a interface React a um CMS headless e organizei busca, filtros, paginação e fluxos de conta.",
        evidence: "Catálogo navegável, pesquisa, filtros e páginas alimentadas por conteúdo do Strapi.",
        details: [
          "A busca e os filtros ajudam a explorar o catálogo; a paginação mantém a navegação controlada conforme o conteúdo cresce.",
          "O Strapi separa edição de conteúdo da interface pública, permitindo atualizar os dados sem alterar componentes de apresentação.",
        ],
        stack: ["React", "Strapi", "Tailwind CSS"],
        href: "https://github.com/Skitttz/nights4films",
        live: "https://nights4films.vercel.app/",
      },
      {
        slug: "quertc",
        name: "Quertc",
        category: "Chat · Tempo real",
        summary:
          "Uma aplicação de chat no navegador com salas e mensagens atualizadas em tempo real.",
        challenge:
          "Fazer a experiência de conversa responder imediatamente e manter acesso por usuário às salas.",
        solution:
          "Integrei Socket.io ao servidor Next.js, autenticação no handshake e persistência com MongoDB.",
        evidence:
          "Salas públicas e privadas, mensagens em tempo real e interface responsiva.",
        details: [
          "A comunicação via Socket.io atualiza a conversa sem recarregar a página, enquanto o MongoDB guarda o histórico das salas.",
          "A autenticação é validada na conexão em tempo real para associar mensagens e permissões ao usuário.",
        ],
        stack: ["Next.js", "React", "Socket.io", "Clerk", "MongoDB"],
        href: "https://github.com/Skitttz/quertc",
      },
      {
        slug: "surfcurse",
        name: "SurfCurse",
        category: "Landing page · Produto",
        summary: "Landing page para uma marca de pranchas de surf personalizadas.",
        challenge: "Explicar um produto personalizável e orientar o visitante até as opções e o contato.",
        solution: "Estruturei uma página responsiva com apresentação do produto, seleção de pranchas, planos e chamada para contato.",
        evidence: "Navegação entre as seções comerciais e interface publicada para consulta.",
        details: [
          "A página apresenta a proposta da marca antes das escolhas comerciais, para que o visitante entenda o produto sem precisar sair do fluxo.",
          "A organização responsiva mantém seleção, planos e contato acessíveis em telas menores.",
        ],
        stack: ["HTML", "CSS", "JavaScript"],
        href: "https://github.com/Skitttz/SurfCurse",
        live: "https://skitttz.github.io/SurfCurse/",
      },
    ],
  },
  en: {
    eyebrow: "Selected work / 01",
    title: "Inside my personal projects.",
    intro:
      "A brand with a playable origin story, a finance product, real-time conversations, and files shared between browsers.",
    challengeLabel: "Challenge",
    solutionLabel: "My approach",
    evidenceLabel: "What you can inspect",
    sourceLabel: "View code",
    demoLabel: "Open demo",
    caseLabel: "View details",
    pausedLabel: "Demo currently paused",
    visualLabel: "Concept visual",
    otherLabel: "Other projects",
    liveLabel: "Open site",
    experienceEyebrow: "Professional experience / 02",
    experienceTitle: "Professional experience.",
    experienceIntro:
      "From direct client work to products built with a team. Each role expanded the scope of my front-end work.",
    experience: [
      {
        period: "Nov 2024 — present",
        role: "Mid-level Front-end Developer",
        company: "WeFit",
        location: "Remote · São Paulo, Brazil",
        description: "Work on banking, insurance, and healthcare products, bringing design systems defined by the UX/UI team into more than eight applications.",
        contributions: [
          "Component libraries and Storybook documentation to keep interfaces consistent.",
          "A Playwright E2E suite integrated with the client to cover critical flows.",
          "Diagnosing CI/CD pipeline failures to keep integration stable.",
        ],
        stack: "React · Next.js · TypeScript · Playwright · Storybook",
        icon: "mdi:layers-triple-outline",
        impact: "4h → 1h20",
        impactLabel: "QA validation cycle",
      },
      {
        period: "Oct 2023 — Oct 2024",
        role: "Junior Full-stack Developer",
        company: "SergipeTec",
        location: "On-site · Aracaju, Brazil",
        description: "Built an institutional portal with file management and JWT authentication, from front-end to local infrastructure.",
        contributions: [
          "Migrated and validated legacy records, eliminating roughly 50 hours of manual work.",
          "A Docker environment and C4 architecture documentation to support continued development.",
        ],
        stack: "Next.js · React · Node.js · Strapi · PostgreSQL · Docker",
        icon: "mdi:database-arrow-right-outline",
        impact: "200+",
        impactLabel: "legacy records migrated",
      },
      {
        period: "Jan 2023 — Sep 2023",
        role: "Freelance Front-end Developer",
        company: "Self-employed",
        location: "Remote · Brazil",
        description: "Built landing pages for law firms and consultancies, from requirements gathering through delivery.",
        contributions: [
          "Pages with attention to UX, accessibility, SEO, and performance.",
          "Direct client communication to turn business goals into usable pages.",
        ],
        stack: "React · JavaScript · HTML · CSS · Figma",
        icon: "mdi:briefcase-outline",
        impact: "8+",
        impactLabel: "client pages delivered",
      },
    ],
    resumeLabel: "Read full resume",
    projects: [
      {
        slug: "fates",
        name: "Fates v2",
        category: "Streetwear showcase · Front-end",
        summary:
          "A streetwear showcase with a catalog, simulated order flow, and an origin story visitors can play.",
        challenge:
          "Present products and simulate an order flow without coupling the interface to the API response shape.",
        solution:
          "I separated the front-end into layers, injected use cases into Server Components, and built a demo mode using the same API contracts.",
        evidence:
          "Catalog, cart, login, and simulated orders in demo mode; no real purchase or payment.",
        details: [
          "The showcase runs in demo mode using the same use-case contracts as the API integration, so visitors can explore the catalog, product, cart, and simulated checkout without a backend. Mock orders are not persisted and there is no payment.",
          "The About page turns the brand's origin into an interactive story. The ollie and first sticker placement change scenes and dialogue; a text alternative is available outside the canvas.",
          "Separating domain, application, infrastructure, and presentation makes rules testable without rendering the UI. Vitest covers units and integration; Cypress covers browser flows.",
        ],
        stack: ["Next.js", "React", "TypeScript", "Clean Architecture", "Vitest", "Cypress"],
        href: "https://github.com/Skitttz/fates-v2",
        featured: true,
        feature: {
          label: "Beyond the showcase",
          title: "The About page is a game",
          description:
            "Fates starts at a skate spot in Aracaju. Visitors try an ollie, move through a pixel-art scene, and choose where to place the brand's first sticker. Dialogue and ending change with those choices; touch controls, audio, and a text version are available.",
          href: "https://github.com/Skitttz/fates-v2/tree/main/src/presentation/components/story",
          linkLabel: "Explore the game implementation",
        },
      },
      {
        slug: "athow",
        name: "Athow",
        category: "Finance · Full stack · MCP",
        summary:
          "A personal finance MVP that turns bank statements into a clear view of spending, limits, and goals.",
        challenge:
          "Bring CSV and OFX statement data together and support secure queries through assistants.",
        solution:
          "I built a dashboard, modular API, and OAuth protected MCP integration; each query is scoped to its user.",
        evidence:
          "Import, categorization, monthly review, and summaries shown in the dashboard and chat.",
        details: [
          "The product brings CSV and OFX statements, categorization rules, category budgets, goals, and monthly review into one flow.",
          "The API groups business rules by module. The MCP server uses OAuth: the assistant acts with the user's permission and each tool can access only that user's data.",
          "The monthly summary appears in both the dashboard and assistant interface, keeping the financial view consistent across channels.",
        ],
        stack: ["Next.js", "React", "FastAPI", "PostgreSQL", "OAuth", "MCP"],
        live: "https://athow.vercel.app/",
        featured: true,
      },
      {
        slug: "cats",
        name: "Cats",
        category: "Social network · Real time",
        summary: "A social app for cat photos with an infinite feed, live chat, and in-browser cat detection.",
        challenge: "Grow a React project into a social experience with posts, accounts, and real-time messaging without weighing down the initial load.",
        solution: "I connected the interface to a headless WordPress API and Socket.io, loading chat, charts, and the detector only when needed.",
        evidence: "Photo feed, likes, comments, stats, public and private chat, cat detection, and PWA installation.",
        details: [
          "The project began as a React course capstone and grew into an app with a headless WordPress API, JWT sessions, profiles, and an infinitely loading feed.",
          "When someone posts a photo, TensorFlow.js and COCO-SSD detect cats in the browser before upload. The detector loads on demand.",
          "Chat combines a public room and private conversations with presence, typing indicators, reconnection, and paginated history. New messages appear optimistically; unread counts and notifications cover activity while the tab is hidden.",
          "As a PWA, Cats keeps its static shell available offline. Authenticated requests and Socket.io messages still require the network.",
        ],
        stack: ["React", "Vite", "WordPress Headless", "Socket.io", "TensorFlow.js", "PWA"],
        href: "https://github.com/Skitttz/cats",
        live: "https://cats.skittz.dev/",
      },
      {
        slug: "passai",
        name: "Passai",
        category: "Files · WebRTC",
        summary:
          "Private rooms for sending files directly between browsers without storing them on the server.",
        challenge: "Share files without creating an account or leaving a permanent copy on a service.",
        solution: "Room keys and direct WebRTC transfer, with a relay route when needed.",
        evidence: "Create or join a room, send files and folders, and track downloads.",
        details: [
          "A key opens the room. Browsers negotiate their connection and transfer files and folders through WebRTC, with a relay route when a direct connection is unavailable.",
          "The demo lets visitors try the flow without an account and makes clear that files are not stored on the server after transfer.",
        ],
        stack: ["React", "WebRTC", "Connect RPC"],
        live: "https://mepassai.vercel.app/",
      },
    ],
    otherProjects: [
      {
        slug: "nights4films",
        name: "Nights4Films",
        category: "Catalog · Content",
        summary: "A movie catalog with search, filters, and content managed with Strapi.",
        challenge: "Help visitors discover films in a catalog that can be updated without changing the front-end.",
        solution: "I connected the React interface to a headless CMS and organized search, filters, pagination, and account flows.",
        evidence: "Browsable catalog, search, filters, and Strapi-powered content pages.",
        details: [
          "Search and filters help explore the catalog; pagination keeps navigation manageable as content grows.",
          "Strapi separates editing from the public interface, allowing content updates without changing presentation components.",
        ],
        stack: ["React", "Strapi", "Tailwind CSS"],
        href: "https://github.com/Skitttz/nights4films",
        live: "https://nights4films.vercel.app/",
      },
      {
        slug: "quertc",
        name: "Quertc",
        category: "Chat · Real time",
        summary:
          "A browser chat app with rooms and messages delivered in real time.",
        challenge:
          "Make conversations feel immediate while keeping access to rooms tied to each user.",
        solution:
          "I integrated Socket.io with the Next.js server, authentication at the handshake, and MongoDB persistence.",
        evidence:
          "Public and private rooms, live messages, and a responsive interface.",
        details: [
          "Socket.io updates the conversation without a page reload, while MongoDB stores room history.",
          "Authentication is checked during the real-time connection to associate messages and permissions with the user.",
        ],
        stack: ["Next.js", "React", "Socket.io", "Clerk", "MongoDB"],
        href: "https://github.com/Skitttz/quertc",
      },
      {
        slug: "surfcurse",
        name: "SurfCurse",
        category: "Landing page · Product",
        summary: "A landing page for a custom surfboard brand.",
        challenge: "Explain a customizable product and guide visitors through the options and contact path.",
        solution: "I built a responsive page with product storytelling, board selection, plans, and a contact call to action.",
        evidence: "Navigation across the commercial sections and a published interface to inspect.",
        details: [
          "The page presents the brand proposition before commercial choices, so visitors understand the product without leaving the flow.",
          "The responsive structure keeps board selection, plans, and contact accessible on smaller screens.",
        ],
        stack: ["HTML", "CSS", "JavaScript"],
        href: "https://github.com/Skitttz/SurfCurse",
        live: "https://skitttz.github.io/SurfCurse/",
      },
    ],
  },
};

export const projectPath = (lang: string, slug: string) => `/${lang}/projects/${slug}`;
