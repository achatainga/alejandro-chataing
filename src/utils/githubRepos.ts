export interface GitHubRepo {
  name: string
  description: string
  url: string
  homepage?: string
  language: string
  stars: number
  highlight?: boolean
}

export const githubRepos: GitHubRepo[] = [
  {
    name: 'mcp-code-context',
    description:
      'MCP server that compresses any codebase into LLM-ready semantic context. AST-based compression using Tree-sitter WASM — zero native dependencies. Works with Claude, Cursor, Amazon Q, Kiro and any MCP client. TypeScript · 15 language parsers · SQLite cache · session-scoped state.',
    url: 'https://github.com/achatainga/mcp-code-context',
    language: 'TypeScript',
    stars: 3,
    highlight: true,
  },
  {
    name: 'verboplay',
    description:
      'Interactive games PWA for live events. React 18 + TypeScript + Vite + Firebase + Firestore. Two full games: word-guessing ("Palabras Reveladas") and Who Wants to Be a Millionaire style. Admin panel with event branding, 300+ questions across 15 levels, offline PWA, audio system.',
    url: 'https://github.com/achatainga/verboplay',
    homepage: 'https://verboplay.vercel.app',
    language: 'TypeScript',
    stars: 0,
  },
  {
    name: 'bedrock-cli',
    description:
      'Universal PHP CLI tool for Roots Bedrock WordPress development. 78 commands, 22 services with Symfony DI Container, 4 type-safe DTOs. Features: profile management, Docker integration, premium plugin/theme support, WordPress API integration, and AI-powered assistance.',
    url: 'https://github.com/achatainga/bedrock-cli',
    language: 'PHP',
    stars: 0,
  },
  {
    name: 'proyecto-hechos',
    description:
      "Interactive ministerial SPA — Paul's Third Journey and road to Rome (Acts 18–28). Interactive timeline + geographic map with differentiated routes. React · Vite · Tailwind CSS · Leaflet.js · Live on Vercel.",
    url: 'https://github.com/achatainga/proyecto-hechos',
    homepage: 'https://proyecto-hechos.vercel.app',
    language: 'JavaScript',
    stars: 0,
  },
]

export const LANG_COLORS: Record<string, string> = {
  TypeScript: '#3178c6',
  JavaScript: '#f1e05a',
  PHP: '#777bb4',
  Python: '#3572A5',
  AutoHotkey: '#6594b9',
  HTML: '#e34c26',
  default: '#64748b',
}
