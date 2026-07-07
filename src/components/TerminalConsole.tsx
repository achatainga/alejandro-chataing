import { useState, useRef, useEffect, useCallback } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { Terminal, X, Minus, Square } from 'lucide-react'
import type { Translations } from '../i18n/translations'

interface Line {
  type: 'input' | 'output' | 'error' | 'success' | 'info'
  text: string
}

const COLOR: Record<Line['type'], string> = {
  input:   'text-cyber-accent',
  output:  'text-cyber-muted',
  error:   'text-red-400',
  success: 'text-cyber-primary',
  info:    'text-cyber-warn',
}

const COMMANDS: Record<string, () => Line[]> = {
  help: () => [
    { type: 'success', text: '  help        -- Show this menu' },
    { type: 'output',  text: '  whoami      -- Profile summary' },
    { type: 'output',  text: '  mcp-status  -- Scan mcp-code-context server' },
    { type: 'output',  text: '  ai-stack    -- Daily AI development tools' },
    { type: 'output',  text: '  skills      -- Skill matrix' },
    { type: 'output',  text: '  contact     -- Contact information' },
    { type: 'output',  text: '  clear       -- Clear terminal' },
  ],
  whoami: () => [
    { type: 'success', text: '> Alejandro Chataing Avila' },
    { type: 'output',  text: '  Senior Full-Stack Engineer & AI-Augmented Tech Lead' },
    { type: 'output',  text: '  Caracas, Venezuela -- 100% Remote' },
    { type: 'output',  text: '  10+ years production experience' },
    { type: 'output',  text: '  Author: mcp-code-context (NPM v3.7.1)' },
    { type: 'output',  text: '  English C2 | Spanish Native' },
    { type: 'output',  text: '  Autodidact: if I do not know it, I learn it fast' },
  ],
  'mcp-status': () => [
    { type: 'info',    text: '$ scanning mcp-code-context@3.7.1...' },
    { type: 'output',  text: '  [####################] 100%' },
    { type: 'success', text: '  OK  Tree-sitter WASM: 15 language parsers loaded' },
    { type: 'success', text: '  OK  SQLite cache: 847 AST nodes indexed' },
    { type: 'success', text: '  OK  Session state: isolated (zero leakage)' },
    { type: 'success', text: '  OK  File watcher: active, auto-cache invalidation' },
    { type: 'success', text: '  OK  ReDoS protection: 15+ patterns blocked' },
    { type: 'success', text: '  OK  Crash recovery: SQLite-backed pending ops' },
    { type: 'info',    text: '  Context reduction vs full-file read: ~85%' },
    { type: 'success', text: '  STATUS: OPERATIONAL' },
    { type: 'output',  text: '  npmjs.com/package/mcp-code-context' },
  ],
  'ai-stack': () => [
    { type: 'success', text: '> Daily AI Development Stack' },
    { type: 'output',  text: '' },
    { type: 'info',    text: '  IDEs & Agents' },
    { type: 'output',  text: '  Kiro IDE         -- AI-native IDE (spec + vibe modes)' },
    { type: 'output',  text: '  Amazon Q         -- VS Code AI agent (code + chat)' },
    { type: 'output',  text: '  Antigravity IDE  -- AI-augmented environment' },
    { type: 'output',  text: '  VS Code          -- primary editor + AI extensions' },
    { type: 'output',  text: '' },
    { type: 'info',    text: '  AI Models & Services' },
    { type: 'output',  text: '  Gemini AI Studio -- 1M token context window' },
    { type: 'output',  text: '  Claude / Sonnet  -- adversarial code audits' },
    { type: 'output',  text: '' },
    { type: 'info',    text: '  Custom MCP Tools (authored)' },
    { type: 'output',  text: '  mcp-code-context -- AST surgical editing for LLMs' },
    { type: 'output',  text: '  agent-memory     -- session state across agents' },
    { type: 'output',  text: '' },
    { type: 'success', text: '  I define what. AI executes how. I own the output.' },
  ],
  skills: () => [
    { type: 'info',    text: '$ skill matrix' },
    { type: 'output',  text: '' },
    { type: 'success', text: '  Backend' },
    { type: 'output',  text: '  PHP / Laravel / WP   [###################.] 95%' },
    { type: 'output',  text: '  Node.js / TypeScript [##################..] 90%' },
    { type: 'output',  text: '  Python / Bash        [################....] 80%' },
    { type: 'output',  text: '' },
    { type: 'success', text: '  Frontend & Mobile' },
    { type: 'output',  text: '  React / React Native [##################..] 92%' },
    { type: 'output',  text: '  TypeScript           [##################..] 90%' },
    { type: 'output',  text: '  Flutter / Dart       [###############.....] 78%' },
    { type: 'output',  text: '  Browser Extensions   [################....] 82%' },
    { type: 'output',  text: '' },
    { type: 'success', text: '  AI-Augmented Dev' },
    { type: 'output',  text: '  mcp-code-context     [####################] 99%' },
    { type: 'output',  text: '  Vibe Coding          [###################.] 97%' },
    { type: 'output',  text: '  Prompt Engineering   [##################..] 93%' },
  ],
  contact: () => [
    { type: 'success', text: '> Contact' },
    { type: 'output',  text: '  Email:    a.chataing.a@gmail.com' },
    { type: 'output',  text: '  WhatsApp: +58 424-166.88.76' },
    { type: 'output',  text: '  GitHub:   github.com/achatainga' },
    { type: 'output',  text: '  LinkedIn: linkedin.com/in/alejandro-chataing-90205a1b1' },
    { type: 'output',  text: '  NPM:      npmjs.com/package/mcp-code-context' },
  ],
}

export default function TerminalConsole({ embedded = false, tr }: { embedded?: boolean; tr?: Translations }) {
  const typeHelp   = tr?.typeHelp   ?? 'Type "help" to see available commands.'
  const cmdNotFound = tr?.cmdNotFound ?? 'command not found'

  const banner: Line[] = [
    { type: 'info',   text: '\u2554\u2550\u2550\u2550\u2550\u2550\u2550\u2550\u2550\u2550\u2550\u2550\u2550\u2550\u2550\u2550\u2550\u2550\u2550\u2550\u2550\u2550\u2550\u2550\u2550\u2550\u2550\u2550\u2550\u2550\u2550\u2550\u2550\u2550\u2550\u2550\u2550\u2550\u2550\u2550\u2550\u2550\u2550\u2550\u2550\u2550\u2550\u2550\u2550\u2550\u2550\u2550\u2550\u2550\u2557' },
    { type: 'info',   text: '\u2551  Alejandro Chataing -- AI-Augmented Tech Lead v3.7.1  \u2551' },
    { type: 'info',   text: '\u2551  Node: caracas-ve-01 | MCP: mcp-code-context           \u2551' },
    { type: 'info',   text: '\u2551  Kiro IDE | Amazon Q | Gemini | Antigravity IDE        \u2551' },
    { type: 'info',   text: '\u255a\u2550\u2550\u2550\u2550\u2550\u2550\u2550\u2550\u2550\u2550\u2550\u2550\u2550\u2550\u2550\u2550\u2550\u2550\u2550\u2550\u2550\u2550\u2550\u2550\u2550\u2550\u2550\u2550\u2550\u2550\u2550\u2550\u2550\u2550\u2550\u2550\u2550\u2550\u2550\u2550\u2550\u2550\u2550\u2550\u2550\u2550\u2550\u2550\u2550\u2550\u2550\u2550\u2550\u255d' },
    { type: 'output', text: typeHelp },
  ]

  const [lines,   setLines]   = useState<Line[]>(banner)
  const [input,   setInput]   = useState('')
  const [history, setHistory] = useState<string[]>([])
  const [histIdx, setHistIdx] = useState(-1)
  const outputRef = useRef<HTMLDivElement>(null)   // scroll container
  const bottomRef = useRef<HTMLDivElement>(null)   // scroll target
  const inputRef  = useRef<HTMLInputElement>(null)

  useEffect(() => {
    // Scroll only the terminal output div — never the page
    const el = outputRef.current
    if (!el) return
    el.scrollTop = el.scrollHeight
  }, [lines])

  const run = useCallback((cmd: string) => {
    const trimmed = cmd.trim().toLowerCase()
    const echo: Line = { type: 'input', text: `alejandro@caracas-ve-01:~$ ${cmd}` }

    if (trimmed === 'clear') { setLines(banner); return }

    const handler = COMMANDS[trimmed]
    const result: Line[] = handler
      ? handler()
      : [{ type: 'error', text: `${cmdNotFound}: ${trimmed}. Type "help".` }]

    setLines((prev) => [...prev, echo, ...result])
    setHistory((prev) => [cmd, ...prev].slice(0, 50))
    setHistIdx(-1)
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [cmdNotFound])

  const onKeyDown = (e: React.KeyboardEvent<HTMLInputElement>) => {
    if (e.key === 'Enter' && input.trim()) {
      run(input); setInput('')
    } else if (e.key === 'ArrowUp') {
      e.preventDefault()
      const next = Math.min(histIdx + 1, history.length - 1)
      setHistIdx(next); setInput(history[next] ?? '')
    } else if (e.key === 'ArrowDown') {
      e.preventDefault()
      const next = Math.max(histIdx - 1, -1)
      setHistIdx(next); setInput(next === -1 ? '' : history[next])
    }
  }

  const body = (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true }}
      className="bg-cyber-bg border border-cyber-border rounded-xl overflow-hidden font-mono text-sm"
    >
      <div className="flex items-center gap-2 px-4 py-2.5 bg-cyber-surface border-b border-cyber-border">
        <span className="w-3 h-3 rounded-full bg-red-500 flex-shrink-0" />
        <span className="w-3 h-3 rounded-full bg-yellow-500 flex-shrink-0" />
        <span className="w-3 h-3 rounded-full bg-green-500 flex-shrink-0" />
        <span className="ml-2 text-cyber-muted text-xs flex items-center gap-1.5 truncate min-w-0">
          <Terminal size={11} className="flex-shrink-0" /> alejandro@caracas-ve-01
        </span>
        <div className="ml-auto flex gap-2 text-cyber-muted flex-shrink-0">
          <Minus size={12} /><Square size={12} /><X size={12} />
        </div>
      </div>

      <div
        ref={outputRef}
        className="p-4 h-72 overflow-y-auto overflow-x-hidden space-y-0.5 cursor-text"
        onClick={() => inputRef.current?.focus()}
      >
        <AnimatePresence initial={false}>
          {lines.map((line, i) => (
            <motion.div
              key={i}
              initial={{ opacity: 0, x: -4 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ duration: 0.12 }}
              className={`leading-5 whitespace-pre-wrap break-words ${COLOR[line.type]}`}
            >
              {line.text || '\u00A0'}
            </motion.div>
          ))}
        </AnimatePresence>
        <div ref={bottomRef} />
      </div>

      <div className="flex items-center gap-2 px-4 py-2 border-t border-cyber-border bg-cyber-surface overflow-hidden">
        <span className="text-cyber-accent text-xs select-none flex-shrink-0">~$</span>
        <input
          ref={inputRef}
          value={input}
          onChange={(e) => setInput(e.target.value)}
          onKeyDown={onKeyDown}
          className="flex-1 bg-transparent outline-none text-cyber-text text-sm font-mono caret-cyber-primary min-w-0"
          placeholder="type a command..."
          autoComplete="off"
          spellCheck={false}
          aria-label="Terminal input"
        />
      </div>
    </motion.div>
  )

  if (embedded) return body

  return (
    <section className="relative z-10 max-w-4xl mx-auto px-6 py-10 no-print">
      {body}
    </section>
  )
}
