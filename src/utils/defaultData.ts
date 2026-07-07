import type { CVData } from '../types/cv'
import type { Lang } from '../i18n/translations'

const BASE = {
  name:     'Alejandro Chataing Avila',
  email:    'a.chataing.a@gmail.com',
  phone:    '+58 424-166.88.76',
  location: 'Caracas, Venezuela',
  github:   'achatainga',
  linkedin: 'alejandro-chataing-90205a1b1',
}

const en: CVData = {
  ...BASE,
  title:   'Senior Full-Stack Engineer & AI-Augmented Tech Lead',
  summary: 'Self-taught engineer with 10+ years building production systems — WordPress plugins, Laravel APIs, React SPAs, Node.js services and Flutter apps. Author of mcp-code-context (v3.7.1), a published open-source MCP server using Tree-sitter WASM for surgical AST-based code editing that optimizes LLM context windows by up to 85%. Expert vibe coder: I work daily with Kiro IDE, Amazon Q, VS Code + AI extensions, Gemini AI Studio, and Antigravity IDE to multiply productivity and define AI-assisted development standards for teams. Strong communicator in English (C2 — former teacher at Berlitz, Wall Street Institute, Oxford Institute) and Spanish (native). Available 100% remote from Caracas, Venezuela.',
  experience: [
    {
      company:  'Detodo24.com',
      role:     'Senior Full-Stack Developer & AI Workflow Lead',
      period:   '2025 — Present',
      location: 'Remote, Venezuela',
      bullets: [
        'Lead architecture of a multi-vendor e-commerce platform: WordPress plugins + Laravel REST API + Flutter mobile app',
        'Built dt24-home-engine and dt24-product-wizard — production WordPress plugins with React Admin UIs, custom REST APIs and complex state management',
        'Authored and published mcp-code-context (v3.7.1 on NPM): MCP server using Tree-sitter WASM for surgical AST-based code editing — zero native deps, session-scoped state, SQLite cache, 15 language parsers',
        'Defined AI-assisted dev standards: daily workflow with Kiro IDE, Amazon Q, Gemini AI Studio, Antigravity IDE — multiplied solo output to team-scale velocity',
        'Established AI code review practices: adversarial audit prompts, finding lifecycle protocols (P0/P1/P2), multi-agent coordination via Trello + MCP',
        'Designed mobile↔API sync and distributed state architecture with Flutter + Laravel + MySQL',
      ],
      tech: ['PHP', 'WordPress', 'React', 'TypeScript', 'Laravel', 'Flutter', 'Node.js', 'MySQL', 'MCP', 'Tree-sitter', 'Kiro IDE', 'Amazon Q'],
    },
    {
      company:  'NonFungible.com',
      role:     'Senior Distributed Systems Engineer',
      period:   '2021',
      location: 'Remote (Canada / France / UK)',
      bullets: [
        'Built premium employee API for accessing Ethereum NFT token data at scale',
        'Designed REST endpoints consumed by analytics dashboards tracking blockchain transactions',
        'Improved data pipeline efficiency and accessibility for the NFT community',
      ],
      tech: ['Node.js', 'MongoDB', 'REST API', 'Ethereum', 'Web3'],
      url: 'https://nonfungible.com',
    },
    {
      company:  'Couponifier.com',
      role:     'Senior Full-Stack Developer',
      period:   '2019 — 2021',
      location: 'Remote, Venezuela',
      bullets: [
        'Developed full frontend and backend for an online coupon aggregation platform',
        'Built heuristic AI models to classify and score discount coupons automatically',
        'Integrated third-party retailer APIs and maintained data pipelines',
      ],
      tech: ['React', 'Node.js', 'PHP', 'MySQL', 'AI/Heuristics', 'REST APIs'],
    },
    {
      company:  'Freelance Clients',
      role:     'Full-Stack Developer — WordPress, Laravel, Node.js',
      period:   '2015 — 2019',
      location: 'Remote',
      bullets: [
        'Delivered custom WordPress themes and plugins for international clients',
        'Built RGCAdmin_Utilities and RGCAdminBot for rankedgaming.com (chat bot + admin panel)',
        'Developed listofwallets.com: React web + React Native iOS/Android/Windows/OSX with WordPress REST API v2 backend',
        'Chrome, Opera, Firefox browser extensions',
        'Official English↔Spanish Interpreter and Translator for the Venezuelan Ministry of Foreign Affairs (2016)',
      ],
      tech: ['WordPress', 'Laravel', 'React', 'React Native', 'Electron', 'PHP', 'JavaScript', 'jQuery'],
    },
    {
      company:  'English Teaching — Multiple Institutions',
      role:     'English Teacher & Lab Instructor',
      period:   '2006 — 2014',
      location: 'Caracas, Venezuela',
      bullets: [
        'Wall Street Institute (2006-2007), Berlitz (2008-2009), Plaza Sésamo (2009-2011)',
        'Alpha Learning (2012), Instituto Losher Ebbinghaus (2013), Oxford Institute (2014)',
        'Taught all levels from beginner to advanced; lab instructor for digital English learning tools',
      ],
      tech: ['English C2', 'Teaching', 'Communication'],
    },
  ],
  projects: [
    {
      name: 'mcp-code-context',
      description: 'Open-source MCP server (v3.7.1) — Tree-sitter WASM AST surgical code reading, editing and search for AI agents. Zero native dependencies. 15 language parsers, 2-phase write with diff preview, session-scoped state, SQLite persistent cache, crash recovery, ReDoS protection. Published on NPM. Used daily in production.',
      tech: ['Node.js', 'TypeScript', 'Tree-sitter WASM', 'MCP Protocol', 'SQLite', 'AST'],
      url: 'https://www.npmjs.com/package/mcp-code-context',
      highlight: true,
    },
    {
      name: 'dt24-home-engine',
      description: 'Production WordPress plugin powering Detodo24 marketplace. React Admin UI, custom REST API, advanced product configuration, event-driven hooks, and AI-assisted content generation.',
      tech: ['PHP', 'WordPress', 'React', 'TypeScript', 'REST API', 'MySQL'],
    },
    {
      name: 'dt24-product-wizard',
      description: 'Multi-step product configuration wizard plugin. Complex state management, real-time validation, WooCommerce deep integration, and AI-powered product data enrichment.',
      tech: ['PHP', 'WordPress', 'React', 'WooCommerce', 'MySQL'],
    },
    {
      name: 'Browser Extensions',
      description: 'Built cross-browser extensions for Chrome, Firefox, Opera and Safari. Full WebExtension API integration including content scripts, background workers, native messaging and OAuth flows.',
      tech: ['JavaScript', 'Chrome Extension API', 'Firefox WebExtension', 'OAuth', 'Content Scripts'],
    },
    {
      name: 'listofwallets.com',
      description: 'True cross-platform app from a single codebase: React web, React Native iOS/Android, Electron desktop (Windows/macOS). WordPress REST API v2 backend.',
      tech: ['React Native', 'WordPress', 'Electron', 'REST API', 'iOS', 'Android'],
    },
    {
      name: 'NonFungible.com API',
      description: 'Premium API for NFT analytics — Ethereum blockchain token data for professional subscribers. High-throughput Node.js + MongoDB service with blockchain data ingestion.',
      tech: ['Node.js', 'MongoDB', 'Ethereum', 'Web3', 'REST API'],
      url: 'https://nonfungible.com',
    },
  ],
  skillGroups: [
    {
      category: 'Backend',
      skills: [
        { name: 'PHP / Laravel / WordPress', level: 95 },
        { name: 'Node.js / TypeScript',       level: 90 },
        { name: 'Python / Bash',              level: 80 },
        { name: 'Ruby on Rails',              level: 62 },
        { name: 'C / C++ / .NET',             level: 70 },
      ],
    },
    {
      category: 'Frontend & Mobile',
      skills: [
        { name: 'React / React Native',                  level: 92 },
        { name: 'TypeScript',                            level: 90 },
        { name: 'Tailwind CSS / CSS3',                   level: 88 },
        { name: 'Flutter / Dart',                        level: 78 },
        { name: 'Browser Extensions (Chrome/FF/Opera)',  level: 82 },
      ],
    },
    {
      category: 'Infrastructure & Distributed',
      skills: [
        { name: 'MySQL / MongoDB',              level: 88 },
        { name: 'REST API / GraphQL',           level: 92 },
        { name: 'Git / CI/CD / GitHub Actions', level: 85 },
        { name: 'Docker / Kubernetes',          level: 65 },
        { name: 'Kafka / RabbitMQ / Event-driven', level: 63 },
      ],
    },
    {
      category: 'AI-Augmented Development',
      skills: [
        { name: 'mcp-code-context (author)',        level: 99 },
        { name: 'Vibe Coding Methodology',          level: 97 },
        { name: 'Kiro IDE / Amazon Q / VS Code AI', level: 95 },
        { name: 'Gemini AI Studio / Antigravity',   level: 92 },
        { name: 'Prompt Engineering & AI Review',   level: 93 },
      ],
    },
  ],
  languages: [
    { name: 'Spanish', level: 'Native', detail: 'C2' },
    { name: 'English', level: 'Expert / C2', detail: 'Former teacher at Berlitz, Wall Street Institute, Oxford Institute. Official translator for Venezuelan Foreign Affairs Ministry.' },
  ],
  education: [
    {
      institution: 'Universidad Central de Venezuela',
      degree:      'Computer Science — Faculty of Sciences',
      period:      '2004 — 2007',
      details: ['Programming & Algorithms', 'Software Engineering', 'C, C++, C#, Java Enterprise', 'Discrete Mathematics', 'Data Structures'],
    },
    {
      institution: 'Liceo Luisa Cáceres de Arismendi',
      degree:      'Bachiller en Ciencias',
      period:      '1998 — 2004',
    },
  ],
}

const es: CVData = {
  ...BASE,
  title:   'Ingeniero Full-Stack Senior & Tech Lead con IA',
  summary: 'Ingeniero autodidacta con más de 10 años construyendo sistemas en producción — plugins de WordPress, APIs con Laravel, SPAs en React, servicios Node.js y apps Flutter. Autor de mcp-code-context (v3.7.1), un servidor MCP open-source publicado en NPM que usa Tree-sitter WASM para edición quirúrgica de código basada en AST, optimizando las ventanas de contexto de LLMs hasta un 85%. Experto en vibe coding: trabajo diariamente con Kiro IDE, Amazon Q, VS Code + extensiones de IA, Gemini AI Studio y Antigravity IDE para multiplicar la productividad y definir estándares de desarrollo asistido por IA en equipos. Comunicador sólido en inglés (C2 — ex docente en Berlitz, Wall Street Institute, Oxford Institute) y español (nativo). Disponible 100% remoto desde Caracas, Venezuela.',
  experience: [
    {
      company:  'Detodo24.com',
      role:     'Desarrollador Full-Stack Senior & Líder de Flujos con IA',
      period:   '2025 — Presente',
      location: 'Remoto, Venezuela',
      bullets: [
        'Lideré la arquitectura de una plataforma e-commerce multi-vendedor: plugins WordPress + API REST Laravel + app móvil Flutter',
        'Construí dt24-home-engine y dt24-product-wizard — plugins WordPress en producción con UIs React Admin, APIs REST personalizadas y gestión de estado compleja',
        'Publiqué mcp-code-context (v3.7.1 en NPM): servidor MCP con Tree-sitter WASM para edición quirúrgica de código basada en AST — sin dependencias nativas, estado por sesión, caché SQLite, 15 parsers de lenguajes',
        'Definí estándares de desarrollo asistido por IA: flujo diario con Kiro IDE, Amazon Q, Gemini AI Studio, Antigravity IDE — multipliqué la productividad individual a escala de equipo',
        'Establecí prácticas de revisión de código con IA: prompts de auditoría adversarial, protocolos de ciclo de vida de hallazgos (P0/P1/P2), coordinación multi-agente vía Trello + MCP',
        'Diseñé la sincronización móvil↔API y la arquitectura de estado distribuido con Flutter + Laravel + MySQL',
      ],
      tech: ['PHP', 'WordPress', 'React', 'TypeScript', 'Laravel', 'Flutter', 'Node.js', 'MySQL', 'MCP', 'Tree-sitter', 'Kiro IDE', 'Amazon Q'],
    },
    {
      company:  'NonFungible.com',
      role:     'Ingeniero Senior de Sistemas Distribuidos',
      period:   '2021',
      location: 'Remoto (Canadá / Francia / Reino Unido)',
      bullets: [
        'Construí una API premium para empleados que accede a datos de tokens NFT de Ethereum a escala',
        'Diseñé endpoints REST consumidos por dashboards de analítica que rastrean transacciones blockchain',
        'Mejoré la eficiencia del pipeline de datos y la accesibilidad para la comunidad NFT',
      ],
      tech: ['Node.js', 'MongoDB', 'REST API', 'Ethereum', 'Web3'],
      url: 'https://nonfungible.com',
    },
    {
      company:  'Couponifier.com',
      role:     'Desarrollador Full-Stack Senior',
      period:   '2019 — 2021',
      location: 'Remoto, Venezuela',
      bullets: [
        'Desarrollé el frontend y backend completo de una plataforma de agregación de cupones en línea',
        'Construí modelos de IA heurísticos para clasificar y puntuar cupones de descuento automáticamente',
        'Integré APIs de terceros de minoristas y mantuve pipelines de datos',
      ],
      tech: ['React', 'Node.js', 'PHP', 'MySQL', 'IA/Heurísticas', 'REST APIs'],
    },
    {
      company:  'Clientes Freelance',
      role:     'Desarrollador Full-Stack — WordPress, Laravel, Node.js',
      period:   '2015 — 2019',
      location: 'Remoto',
      bullets: [
        'Entregué temas y plugins WordPress personalizados para clientes internacionales',
        'Construí RGCAdmin_Utilities y RGCAdminBot para rankedgaming.com (chat bot + panel de administración)',
        'Desarrollé listofwallets.com: web React + React Native iOS/Android/Windows/OSX con backend WordPress REST API v2',
        'Extensiones para Chrome, Opera y Firefox',
        'Intérprete y Traductor oficial Inglés↔Español para el Ministerio de Relaciones Exteriores de Venezuela (2016)',
      ],
      tech: ['WordPress', 'Laravel', 'React', 'React Native', 'Electron', 'PHP', 'JavaScript', 'jQuery'],
    },
    {
      company:  'Docencia de Inglés — Múltiples Instituciones',
      role:     'Profesor de Inglés e Instructor de Laboratorio',
      period:   '2006 — 2014',
      location: 'Caracas, Venezuela',
      bullets: [
        'Wall Street Institute (2006-2007), Berlitz (2008-2009), Plaza Sésamo (2009-2011)',
        'Alpha Learning (2012), Instituto Losher Ebbinghaus (2013), Oxford Institute (2014)',
        'Enseñé todos los niveles desde principiante hasta avanzado; instructor de laboratorio para herramientas digitales de aprendizaje de inglés',
      ],
      tech: ['Inglés C2', 'Docencia', 'Comunicación'],
    },
  ],
  projects: [
    {
      name: 'mcp-code-context',
      description: 'Servidor MCP open-source (v3.7.1) — lectura, edición y búsqueda quirúrgica de código basada en AST con Tree-sitter WASM para agentes de IA. Sin dependencias nativas. 15 parsers de lenguajes, escritura en 2 fases con vista previa de diff, estado por sesión, caché SQLite persistente, recuperación ante fallos, protección ReDoS. Publicado en NPM. Usado diariamente en producción.',
      tech: ['Node.js', 'TypeScript', 'Tree-sitter WASM', 'MCP Protocol', 'SQLite', 'AST'],
      url: 'https://www.npmjs.com/package/mcp-code-context',
      highlight: true,
    },
    {
      name: 'dt24-home-engine',
      description: 'Plugin WordPress en producción que impulsa el marketplace Detodo24. UI React Admin, API REST personalizada, configuración avanzada de productos, hooks event-driven y generación de contenido asistida por IA.',
      tech: ['PHP', 'WordPress', 'React', 'TypeScript', 'REST API', 'MySQL'],
    },
    {
      name: 'dt24-product-wizard',
      description: 'Plugin wizard de configuración de productos en múltiples pasos. Gestión de estado compleja, validación en tiempo real, integración profunda con WooCommerce y enriquecimiento de datos de productos con IA.',
      tech: ['PHP', 'WordPress', 'React', 'WooCommerce', 'MySQL'],
    },
    {
      name: 'Extensiones de Navegador',
      description: 'Construí extensiones multi-navegador para Chrome, Firefox, Opera y Safari. Integración completa de la WebExtension API incluyendo content scripts, background workers, native messaging y flujos OAuth.',
      tech: ['JavaScript', 'Chrome Extension API', 'Firefox WebExtension', 'OAuth', 'Content Scripts'],
    },
    {
      name: 'listofwallets.com',
      description: 'App verdaderamente multiplataforma desde un único código base: web React, React Native iOS/Android, escritorio Electron (Windows/macOS). Backend WordPress REST API v2.',
      tech: ['React Native', 'WordPress', 'Electron', 'REST API', 'iOS', 'Android'],
    },
    {
      name: 'API NonFungible.com',
      description: 'API premium para analítica NFT — datos de tokens blockchain Ethereum para suscriptores profesionales. Servicio Node.js + MongoDB de alto rendimiento con ingesta de datos blockchain.',
      tech: ['Node.js', 'MongoDB', 'Ethereum', 'Web3', 'REST API'],
      url: 'https://nonfungible.com',
    },
  ],
  skillGroups: [
    {
      category: 'Backend',
      skills: [
        { name: 'PHP / Laravel / WordPress', level: 95 },
        { name: 'Node.js / TypeScript',       level: 90 },
        { name: 'Python / Bash',              level: 80 },
        { name: 'Ruby on Rails',              level: 62 },
        { name: 'C / C++ / .NET',             level: 70 },
      ],
    },
    {
      category: 'Frontend & Mobile',
      skills: [
        { name: 'React / React Native',                   level: 92 },
        { name: 'TypeScript',                             level: 90 },
        { name: 'Tailwind CSS / CSS3',                    level: 88 },
        { name: 'Flutter / Dart',                         level: 78 },
        { name: 'Extensiones (Chrome/FF/Opera)',          level: 82 },
      ],
    },
    {
      category: 'Infraestructura & Distribuidos',
      skills: [
        { name: 'MySQL / MongoDB',                  level: 88 },
        { name: 'REST API / GraphQL',               level: 92 },
        { name: 'Git / CI/CD / GitHub Actions',     level: 85 },
        { name: 'Docker / Kubernetes',              level: 65 },
        { name: 'Kafka / RabbitMQ / Event-driven',  level: 63 },
      ],
    },
    {
      category: 'Desarrollo Aumentado con IA',
      skills: [
        { name: 'mcp-code-context (autor)',          level: 99 },
        { name: 'Metodología Vibe Coding',           level: 97 },
        { name: 'Kiro IDE / Amazon Q / VS Code IA',  level: 95 },
        { name: 'Gemini AI Studio / Antigravity',    level: 92 },
        { name: 'Prompt Engineering & Revisión IA',  level: 93 },
      ],
    },
  ],
  languages: [
    { name: 'Español', level: 'Nativo', detail: 'C2' },
    { name: 'Inglés',  level: 'Experto / C2', detail: 'Ex docente en Berlitz, Wall Street Institute, Oxford Institute. Traductor oficial para el Ministerio de Relaciones Exteriores de Venezuela.' },
  ],
  education: [
    {
      institution: 'Universidad Central de Venezuela',
      degree:      'Ciencias de la Computación — Facultad de Ciencias',
      period:      '2004 — 2007',
      details: ['Programación y Algoritmos', 'Ingeniería de Software', 'C, C++, C#, Java Enterprise', 'Matemáticas Discretas', 'Estructuras de Datos'],
    },
    {
      institution: 'Liceo Luisa Cáceres de Arismendi',
      degree:      'Bachiller en Ciencias',
      period:      '1998 — 2004',
    },
  ],
}

export const defaultCVData: Record<Lang, CVData> = { en, es }
