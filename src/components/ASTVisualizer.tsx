import { useState, useMemo, useCallback } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { ChevronRight, ChevronDown, Code2 } from 'lucide-react'
import type { Translations } from '../i18n/translations'

interface ASTNode {
  type: string
  name?: string
  children?: ASTNode[]
  line?: number
}

const SAMPLE_CODE = `// Paste any JS, TS, PHP or Ruby code here
function processOrder(order) {
  const { items, userId } = order
  if (!userId) return null
  const total = items.reduce((sum, item) => sum + item.price, 0)
  return { userId, total, status: 'pending' }
}`

// Lightweight heuristic lexer — not a real parser, simulates mcp-code-context output
function parseCode(code: string): ASTNode {
  const lines = code.split('\n')
  const root: ASTNode = { type: 'Program', children: [] }

  for (let i = 0; i < lines.length; i++) {
    const line = lines[i].trim()
    if (!line || line.startsWith('//') || line.startsWith('#')) continue

    // Function declarations
    const fnMatch = line.match(/(?:function\s+(\w+)|const\s+(\w+)\s*=\s*(?:async\s*)?\(|def\s+(\w+)|def\s+self\.(\w+))/)
    if (fnMatch) {
      const name = fnMatch[1] || fnMatch[2] || fnMatch[3] || fnMatch[4]
      root.children!.push({
        type: 'FunctionDeclaration',
        name,
        line: i + 1,
        children: extractFunctionBody(lines, i),
      })
      continue
    }

    // Class declarations
    const classMatch = line.match(/(?:class\s+(\w+)|interface\s+(\w+))/)
    if (classMatch) {
      root.children!.push({ type: 'ClassDeclaration', name: classMatch[1] || classMatch[2], line: i + 1 })
      continue
    }

    // Imports
    const importMatch = line.match(/(?:import\s+|require\s*\(|use\s+)(.+)/)
    if (importMatch) {
      root.children!.push({ type: 'ImportDeclaration', name: importMatch[1].replace(/['"`;]/g, '').trim(), line: i + 1 })
      continue
    }

    // Variables
    const varMatch = line.match(/(?:const|let|var|my|local)\s+(\w+)\s*=/)
    if (varMatch) {
      root.children!.push({ type: 'VariableDeclaration', name: varMatch[1], line: i + 1 })
      continue
    }

    // Return / conditionals
    if (line.startsWith('return ')) root.children!.push({ type: 'ReturnStatement', line: i + 1 })
    else if (line.startsWith('if ') || line.startsWith('if(')) root.children!.push({ type: 'IfStatement', line: i + 1 })
  }

  return root
}

function extractFunctionBody(lines: string[], start: number): ASTNode[] {
  const body: ASTNode[] = []
  for (let i = start + 1; i < Math.min(start + 8, lines.length); i++) {
    const l = lines[i].trim()
    if (!l || l === '{' || l === '}') continue
    const retMatch = l.match(/return\s+(.+)/)
    if (retMatch) body.push({ type: 'ReturnStatement', name: retMatch[1].slice(0, 30), line: i + 1 })
    const varMatch = l.match(/(?:const|let|var)\s+(\w+)/)
    if (varMatch) body.push({ type: 'VariableDeclaration', name: varMatch[1], line: i + 1 })
  }
  return body
}

const NODE_COLORS: Record<string, string> = {
  Program: 'text-cyber-primary',
  FunctionDeclaration: 'text-cyber-warn',
  ClassDeclaration: 'text-cyber-secondary',
  ImportDeclaration: 'text-cyber-accent',
  VariableDeclaration: 'text-blue-400',
  ReturnStatement: 'text-pink-400',
  IfStatement: 'text-orange-400',
}

function ASTNodeView({ node, depth = 0 }: { node: ASTNode; depth?: number }) {
  const [open, setOpen] = useState(depth < 2)
  const hasChildren = (node.children?.length ?? 0) > 0
  const color = NODE_COLORS[node.type] ?? 'text-cyber-muted'

  return (
    <div className="font-mono text-xs" style={{ paddingLeft: depth * 14 }}>
      <button
        type="button"
        className={`flex items-center gap-1 hover:opacity-80 transition-opacity ${color}`}
        onClick={() => hasChildren && setOpen((v) => !v)}
      >
        {hasChildren ? (open ? <ChevronDown size={11} /> : <ChevronRight size={11} />) : <span className="w-3" />}
        <span className="text-cyber-muted">{node.type}</span>
        {node.name && <span className="text-cyber-text ml-1">→ {node.name}</span>}
        {node.line && <span className="text-cyber-border ml-1">:{node.line}</span>}
      </button>

      <AnimatePresence>
        {open && hasChildren && (
          <motion.div
            initial={{ height: 0, opacity: 0 }}
            animate={{ height: 'auto', opacity: 1 }}
            exit={{ height: 0, opacity: 0 }}
            transition={{ duration: 0.2 }}
            className="overflow-hidden"
          >
            {node.children!.map((child, i) => (
              <ASTNodeView key={i} node={child} depth={depth + 1} />
            ))}
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  )
}

export default function ASTVisualizer({ embedded = false, tr }: { embedded?: boolean; tr?: Translations }) {
  const [code, setCode] = useState(SAMPLE_CODE)

  const ast = useMemo(() => parseCode(code), [code])

  const nodeCount = useMemo(() => {
    const count = (n: ASTNode): number => 1 + (n.children?.reduce((s, c) => s + count(c), 0) ?? 0)
    return count(ast)
  }, [ast])

  const reduction = useMemo(() => Math.min(95, Math.round((1 - nodeCount / (code.split('\n').length || 1)) * 100 + 60)), [nodeCount, code])

  const handleChange = useCallback((e: React.ChangeEvent<HTMLTextAreaElement>) => {
    setCode(e.target.value)
  }, [])

  const content = (
    <>
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        whileInView={{ opacity: 1, y: 0 }}
        viewport={{ once: true }}
        className="grid md:grid-cols-2 gap-4"
      >
        <div className="bg-cyber-surface border border-cyber-border rounded-xl overflow-hidden">
          <div className="flex items-center gap-2 px-3 py-2 border-b border-cyber-border bg-cyber-bg">
            <Code2 size={13} className="text-cyber-accent" />
            <span className="text-xs text-cyber-muted font-mono">{tr?.pasteCode ?? 'Paste any JS / TS / PHP / Ruby'}</span>
          </div>
          <textarea
            value={code}
            onChange={handleChange}
            className="w-full h-64 bg-transparent p-3 text-xs font-mono text-cyber-text outline-none resize-none"
            spellCheck={false}
            aria-label="Code input for AST analysis"
          />
        </div>
        <div className="bg-cyber-surface border border-cyber-border rounded-xl overflow-hidden">
          <div className="flex items-center justify-between px-3 py-2 border-b border-cyber-border bg-cyber-bg">
            <span className="text-xs text-cyber-muted font-mono">{tr?.astTree ?? 'Abstract Syntax Tree'}</span>
            <span className="text-xs font-mono px-2 py-0.5 rounded bg-cyber-accent/20 text-cyber-accent">
              {tr?.contextReduction ?? 'Context reduction'}: {reduction}%
            </span>
          </div>
          <div className="p-3 h-64 overflow-y-auto">
            <ASTNodeView node={ast} />
          </div>
        </div>
      </motion.div>
      <p className="text-center text-xs text-cyber-muted mt-3">
        {tr?.poweredByMcp ?? 'Powered by mcp-code-context'} ·{' '}
        <a href="https://www.npmjs.com/package/mcp-code-context" target="_blank" rel="noopener noreferrer" className="text-cyber-primary hover:underline">NPM</a>
      </p>
    </>
  )

  if (embedded) return content

  return (
    <section className="ast-section relative z-10 max-w-4xl mx-auto px-6 py-10 no-print">
      <SectionTitle>AST Visualizer — mcp-code-context Live Demo</SectionTitle>
      {content}
    </section>
  )
}

function SectionTitle({ children }: { children: React.ReactNode }) {
  return (
    <h2 className="text-2xl font-bold text-cyber-text mb-6 flex items-center gap-3">
      <span className="text-cyber-primary font-mono text-lg">{'>'}</span>
      {children}
      <span className="flex-1 h-px bg-cyber-border" />
    </h2>
  )
}
