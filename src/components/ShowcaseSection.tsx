import { useState } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { Terminal, GitBranch, Cpu } from 'lucide-react'
import TerminalConsole from './TerminalConsole'
import ASTVisualizer from './ASTVisualizer'
import type { Translations } from '../i18n/translations'

type Tab = 'terminal' | 'ast'

export default function ShowcaseSection({ tr, onAskAI }: { tr: Translations; onAskAI?: (question?: string) => void }) {
  const [active, setActive] = useState<Tab>('terminal')

  const TABS: { id: Tab; label: string; icon: React.ReactNode; desc: string }[] = [
    {
      id: 'terminal',
      label: tr.tabTerminal,
      icon: <Terminal size={14} />,
      desc: tr.tabTerminalDesc,
    },
    {
      id: 'ast',
      label: tr.tabAST,
      icon: <Cpu size={14} />,
      desc: tr.tabASTDesc,
    },
  ]

  return (
    <section id="showcase" className="relative z-10 max-w-4xl mx-auto px-6 py-20 no-print">
      <h2 className="text-2xl font-bold text-cyber-text mb-2 flex items-center gap-3">
        <span className="text-cyber-primary font-mono text-lg">{'>'}</span>
        {tr.showcase}
        <span className="flex-1 h-px bg-cyber-border" />
      </h2>
      <p className="text-cyber-muted text-sm mb-6 ml-8 flex items-center gap-2">
        <GitBranch size={12} className="text-cyber-accent" />
        {tr.showcaseDesc}
      </p>

      <div className="flex gap-2 mb-6 border-b border-cyber-border pb-1">
        {TABS.map((tab) => (
          <button
            key={tab.id}
            type="button"
            onClick={() => setActive(tab.id)}
            className={`flex items-center gap-2 px-4 py-2 rounded-t-lg text-sm font-medium transition-colors border-b-2 -mb-px ${
              active === tab.id
                ? 'border-cyber-primary text-cyber-primary bg-cyber-primary/5'
                : 'border-transparent text-cyber-muted hover:text-cyber-text'
            }`}
          >
            {tab.icon}
            {tab.label}
          </button>
        ))}
      </div>

      <AnimatePresence mode="wait">
        {TABS.filter((tab) => tab.id === active).map((tab) => (
          <motion.p
            key={tab.id}
            initial={{ opacity: 0, y: -6 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.2 }}
            className="text-xs text-cyber-muted bg-cyber-surface border border-cyber-border rounded-lg px-4 py-2 mb-4"
          >
            <span className="text-cyber-accent mr-1">i</span>
            {tab.desc}
          </motion.p>
        ))}
      </AnimatePresence>

      <AnimatePresence mode="wait">
        <motion.div
          key={active}
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          exit={{ opacity: 0, y: -10 }}
          transition={{ duration: 0.25 }}
        >
          {active === 'terminal' && <TerminalConsole embedded tr={tr} onAskAI={onAskAI} />}
          {active === 'ast' && <ASTVisualizer embedded tr={tr} />}
        </motion.div>
      </AnimatePresence>
    </section>
  )
}
