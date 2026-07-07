export type Lang = 'en' | 'es'

export type Translations = {
  // Nav / global
  available: string
  downloadPDF: string
  hireMe: string
  installApp: string
  language: string
  switchLang: string

  // Sections
  experience: string
  projects: string
  skills: string
  showcase: string
  showcaseDesc: string
  education: string
  openSource: string
  githubRepos: string
  present: string

  // GitHub
  viewOnGitHub: string
  liveDemo: string
  viewProfile: string

  // Showcase tabs
  tabTerminal: string
  tabAST: string
  tabTerminalDesc: string
  tabASTDesc: string

  // AST Visualizer
  pasteCode: string
  astTree: string
  contextReduction: string
  poweredByMcp: string

  // Terminal
  typeHelp: string
  cmdNotFound: string

  // Hire Me modal
  letsWorkTogether: string
  messageSent: string
  replySoon: string
  close: string
  sending: string
  nameLabel: string
  companyLabel: string
  emailLabel: string
  phoneLabel: string
  messageLabel: string
  messagePlaceholder: string
  attachmentLabel: string
  attachmentHint: string
  chooseFile: string
  fileReady: string
  sendFailed: string
  fileTooLarge: string
  nameRequired: string
  poweredBy: string
  sendEmail: string
  whatsapp: string

  // i18n legacy (kept for compatibility)
  hireMeSubject: string
  hireMeBody: string
  npmPackage: string
  contactSection: string
}

export const t: Record<Lang, Translations> = {
  en: {
    // Nav / global
    available:      'Available for remote roles · Caracas, Venezuela',
    downloadPDF:    'Download PDF Resume',
    hireMe:         'Hire Me',
    installApp:     'Install App',
    language:       'ES',
    switchLang:     'Switch to Spanish',

    // Sections
    experience:     'Experience',
    projects:       'Projects',
    skills:         'Skills',
    showcase:       'Interactive Showcase',
    showcaseDesc:   'Live tools built and used daily — not mockups',
    education:      'Education & Languages',
    openSource:     'Open Source',
    githubRepos:    'GitHub Repositories',
    present:        'Present',

    // GitHub
    viewOnGitHub:   'View on GitHub',
    liveDemo:       'Live Demo',
    viewProfile:    'View profile',

    // Showcase tabs
    tabTerminal:    'Vibe Coding Terminal',
    tabAST:         'AST Visualizer',
    tabTerminalDesc:'Interactive shell — run commands to explore skills and see AI tooling in action',
    tabASTDesc:     'Live demo of mcp-code-context — paste any code, watch Tree-sitter parse it into an interactive AST',

    // AST Visualizer
    pasteCode:      'Paste any JS / TS / PHP / Ruby',
    astTree:        'Abstract Syntax Tree',
    contextReduction: 'Context reduction',
    poweredByMcp:   'Powered by mcp-code-context — Tree-sitter AST surgical editing for LLMs',

    // Terminal
    typeHelp:       'Type "help" to see available commands.',
    cmdNotFound:    'command not found',

    // Hire Me modal
    letsWorkTogether: "Let's work together",
    messageSent:    'Message sent!',
    replySoon:      "I'll reply within 24 hours.",
    close:          'Close',
    sending:        'Sending...',
    nameLabel:      'Name *',
    companyLabel:   'Company',
    emailLabel:     'Email *',
    phoneLabel:     'Phone / WhatsApp',
    messageLabel:   'Message',
    messagePlaceholder: 'Tell me about the opportunity, role, or project...',
    attachmentLabel:'Attachment',
    attachmentHint: '(PDF, DOC, DOCX, TXT, PNG, JPG — max 5 MB)',
    chooseFile:     'Choose file',
    fileReady:      'ready',
    sendFailed:     'Send failed. Try WhatsApp or email directly.',
    fileTooLarge:   'File too large (max 5 MB)',
    nameRequired:   'Name and email are required.',
    poweredBy:      'Powered by EmailJS · No data stored on this site',
    sendEmail:      'Send Email',
    whatsapp:       'WhatsApp',

    // Legacy
    hireMeSubject:  'Job Opportunity — Alejandro Chataing',
    hireMeBody:     "Hi Alejandro,\n\nI found your portfolio and I'd like to discuss a potential opportunity.\n\n",
    npmPackage:     'NPM Package',
    contactSection: 'Contact',
  },

  es: {
    // Nav / global
    available:      'Disponible para trabajo remoto · Caracas, Venezuela',
    downloadPDF:    'Descargar CV en PDF',
    hireMe:         'Contrátame',
    installApp:     'Instalar App',
    language:       'EN',
    switchLang:     'Cambiar a inglés',

    // Sections
    experience:     'Experiencia',
    projects:       'Proyectos',
    skills:         'Habilidades',
    showcase:       'Demo Interactivo',
    showcaseDesc:   'Herramientas reales usadas a diario — no maquetas',
    education:      'Educación e Idiomas',
    openSource:     'Código Abierto',
    githubRepos:    'Repositorios GitHub',
    present:        'Presente',

    // GitHub
    viewOnGitHub:   'Ver en GitHub',
    liveDemo:       'Demo en vivo',
    viewProfile:    'Ver perfil',

    // Showcase tabs
    tabTerminal:    'Terminal Vibe Coding',
    tabAST:         'Visualizador AST',
    tabTerminalDesc:'Shell interactivo — ejecuta comandos para explorar habilidades y ver el stack de IA en acción',
    tabASTDesc:     'Demo en vivo de mcp-code-context — pega código y mira Tree-sitter construir el AST interactivo',

    // AST Visualizer
    pasteCode:      'Pega código JS / TS / PHP / Ruby',
    astTree:        'Árbol de Sintaxis Abstracta',
    contextReduction: 'Reducción de contexto',
    poweredByMcp:   'Desarrollado con mcp-code-context — edición quirúrgica AST con Tree-sitter para LLMs',

    // Terminal
    typeHelp:       'Escribe "help" para ver los comandos disponibles.',
    cmdNotFound:    'comando no encontrado',

    // Hire Me modal
    letsWorkTogether: 'Trabajemos juntos',
    messageSent:    '¡Mensaje enviado!',
    replySoon:      'Responderé en menos de 24 horas.',
    close:          'Cerrar',
    sending:        'Enviando...',
    nameLabel:      'Nombre *',
    companyLabel:   'Empresa',
    emailLabel:     'Email *',
    phoneLabel:     'Teléfono / WhatsApp',
    messageLabel:   'Mensaje',
    messagePlaceholder: 'Cuéntame sobre la oportunidad, rol o proyecto...',
    attachmentLabel:'Adjunto',
    attachmentHint: '(PDF, DOC, DOCX, TXT, PNG, JPG — máx 5 MB)',
    chooseFile:     'Elegir archivo',
    fileReady:      'listo',
    sendFailed:     'Error al enviar. Intenta por WhatsApp o email directamente.',
    fileTooLarge:   'Archivo muy grande (máx 5 MB)',
    nameRequired:   'Nombre y email son requeridos.',
    poweredBy:      'Enviado con EmailJS · No se almacenan datos en este sitio',
    sendEmail:      'Enviar Email',
    whatsapp:       'WhatsApp',

    // Legacy
    hireMeSubject:  'Oportunidad de trabajo — Alejandro Chataing',
    hireMeBody:     'Hola Alejandro,\n\nEncontré tu portafolio y me gustaría hablar sobre una oportunidad.\n\n',
    npmPackage:     'Paquete NPM',
    contactSection: 'Contacto',
  },
}
