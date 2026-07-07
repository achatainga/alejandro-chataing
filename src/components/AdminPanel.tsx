import { useState, useCallback } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { X, Save, Download, Upload, Sparkles, Key, FileJson } from 'lucide-react'
import type { CVData } from '../types/cv'
import type { Lang } from '../i18n/translations'

interface Props {
  open: boolean
  onClose: () => void
  data: CVData
  onUpdate: (data: CVData) => void
  lang: Lang
}

export default function AdminPanel({ open, onClose, data, onUpdate, lang }: Props) {
  const [json, setJson] = useState(() => JSON.stringify(data, null, 2))
  const [jsonError, setJsonError] = useState('')
  const [geminiKey, setGeminiKey] = useState(() => sessionStorage.getItem('gemini_key') ?? '')
  const [jobDesc, setJobDesc] = useState('')
  const [aiLoading, setAiLoading] = useState(false)
  const [aiStatus, setAiStatus] = useState('')

  const handleJsonChange = useCallback((e: React.ChangeEvent<HTMLTextAreaElement>) => {
    setJson(e.target.value)
    setJsonError('')
  }, [])

  const handleSave = useCallback(() => {
    try {
      const parsed = JSON.parse(json) as CVData
      onUpdate(parsed)
      localStorage.setItem(`cv_data_${lang}`, json)
      setJsonError('')
    } catch {
      setJsonError('Invalid JSON — check syntax')
    }
  }, [json, onUpdate])

  const handleExport = useCallback(() => {
    const blob = new Blob([json], { type: 'application/json' })
    const url = URL.createObjectURL(blob)
    const a = document.createElement('a')
    a.href = url
    a.download = 'alejandro-cv.json'
    a.click()
    URL.revokeObjectURL(url)
  }, [json])

  const handleImport = useCallback((e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0]
    if (!file) return
    const reader = new FileReader()
    reader.onload = (ev) => {
      const text = ev.target?.result as string
      setJson(text)
      setJsonError('')
    }
    reader.readAsText(file)
  }, [])

  const handleSaveKey = useCallback(() => {
    sessionStorage.setItem('gemini_key', geminiKey)
    setAiStatus('API key saved to session (not persisted to disk)')
  }, [geminiKey])

  const handleAITailor = useCallback(async () => {
    if (!geminiKey || !jobDesc.trim()) {
      setAiStatus('Add Gemini API key and paste job description first')
      return
    }
    setAiLoading(true)
    setAiStatus('Calling Gemini API...')

    const prompt = `You are a senior tech recruiter and CV writer. 
Rewrite and optimize this CV JSON to best match the job description below.
Rules: return ONLY valid JSON with the same structure as the input. 
Rewrite the "summary" field. Reorder "skillGroups" skills by relevance. 
Emphasize relevant bullets in "experience". Keep all data truthful.

JOB DESCRIPTION:
${jobDesc}

CURRENT CV JSON:
${json}

Return only the optimized JSON, no markdown, no explanation.`

    const url = `https://generativelanguage.googleapis.com/v1beta/models/gemini-2.0-flash:generateContent?key=${geminiKey}`

    let attempt = 0
    while (attempt < 5) {
      try {
        const res = await fetch(url, {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({ contents: [{ parts: [{ text: prompt }] }] }),
        })
        if (!res.ok) throw new Error(`HTTP ${res.status}`)
        const result = await res.json()
        const text: string = result.candidates?.[0]?.content?.parts?.[0]?.text ?? ''
        const cleaned = text.replace(/```json|```/g, '').trim()
        setJson(cleaned)
        setAiStatus('✓ CV optimized by Gemini AI')
        break
      } catch (err) {
        attempt++
        if (attempt >= 5) {
          setAiStatus(`Error after 5 attempts: ${err}`)
        } else {
          await new Promise((r) => setTimeout(r, 1000 * attempt))
          setAiStatus(`Retry ${attempt}/5...`)
        }
      }
    }
    setAiLoading(false)
  }, [geminiKey, jobDesc, json])

  return (
    <AnimatePresence>
      {open && (
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          className="admin-panel fixed inset-0 z-50 bg-black/80 backdrop-blur-sm flex items-center justify-center p-4 no-print"
          onClick={(e) => e.target === e.currentTarget && onClose()}
        >
          <motion.div
            initial={{ scale: 0.95, opacity: 0 }}
            animate={{ scale: 1, opacity: 1 }}
            exit={{ scale: 0.95, opacity: 0 }}
            transition={{ duration: 0.2 }}
            className="bg-cyber-surface border border-cyber-primary/40 rounded-2xl w-full max-w-4xl max-h-[90vh] overflow-hidden flex flex-col"
          >
            {/* Header */}
            <div className="flex items-center justify-between px-5 py-4 border-b border-cyber-border">
              <div className="flex items-center gap-2">
                <span className="w-2 h-2 rounded-full bg-cyber-primary animate-pulse-slow" />
                <span className="text-cyber-primary font-mono text-sm font-semibold">Admin Panel — CV Editor</span>
              </div>
              <button type="button" onClick={onClose} className="text-cyber-muted hover:text-cyber-text transition-colors">
                <X size={18} />
              </button>
            </div>

            <div className="flex-1 overflow-y-auto p-5 space-y-5">
              {/* JSON Editor */}
              <Section icon={<FileJson size={14} />} title="CV Data (JSON)">
                <textarea
                  value={json}
                  onChange={handleJsonChange}
                  className="w-full h-48 bg-cyber-bg border border-cyber-border rounded-lg p-3 text-xs font-mono text-cyber-text outline-none resize-none focus:border-cyber-primary/50 transition-colors"
                  spellCheck={false}
                  aria-label="CV JSON editor"
                />
                {jsonError && <p className="text-red-400 text-xs mt-1">{jsonError}</p>}
                <div className="flex gap-2 mt-2 flex-wrap">
                  <ActionBtn onClick={handleSave} icon={<Save size={12} />}>Save</ActionBtn>
                  <ActionBtn onClick={handleExport} icon={<Download size={12} />}>Export JSON</ActionBtn>
                  <label className="inline-flex items-center gap-1.5 px-3 py-1.5 text-xs bg-cyber-border hover:bg-cyber-border/70 text-cyber-text rounded-lg cursor-pointer transition-colors">
                    <Upload size={12} /> Import JSON
                    <input type="file" accept=".json" className="hidden" onChange={handleImport} />
                  </label>
                </div>
              </Section>

              {/* Gemini API key */}
              <Section icon={<Key size={14} />} title="Gemini API Key (session only)">
                <div className="flex gap-2">
                  <input
                    type="password"
                    value={geminiKey}
                    onChange={(e) => setGeminiKey(e.target.value)}
                    placeholder="AIza..."
                    className="flex-1 bg-cyber-bg border border-cyber-border rounded-lg px-3 py-2 text-xs font-mono text-cyber-text outline-none focus:border-cyber-primary/50 transition-colors"
                    aria-label="Gemini API key"
                  />
                  <ActionBtn onClick={handleSaveKey} icon={<Save size={12} />}>Save</ActionBtn>
                </div>
                <p className="text-cyber-muted text-xs mt-1">Stored in sessionStorage only — never sent anywhere except Gemini.</p>
              </Section>

              {/* AI Tailoring */}
              <Section icon={<Sparkles size={14} />} title="AI CV Tailoring (Gemini)">
                <textarea
                  value={jobDesc}
                  onChange={(e) => setJobDesc(e.target.value)}
                  placeholder="Paste job description here..."
                  className="w-full h-32 bg-cyber-bg border border-cyber-border rounded-lg p-3 text-xs text-cyber-text outline-none resize-none focus:border-cyber-primary/50 transition-colors"
                  aria-label="Job description for AI tailoring"
                />
                <div className="flex items-center gap-3 mt-2">
                  <ActionBtn onClick={handleAITailor} disabled={aiLoading} icon={<Sparkles size={12} />}>
                    {aiLoading ? 'Optimizing...' : 'Adapt CV with AI'}
                  </ActionBtn>
                  {aiStatus && <span className="text-xs text-cyber-muted">{aiStatus}</span>}
                </div>
              </Section>
            </div>
          </motion.div>
        </motion.div>
      )}
    </AnimatePresence>
  )
}

function Section({ icon, title, children }: { icon: React.ReactNode; title: string; children: React.ReactNode }) {
  return (
    <div>
      <h3 className="flex items-center gap-2 text-xs font-semibold text-cyber-primary uppercase tracking-wider mb-3">
        {icon} {title}
      </h3>
      {children}
    </div>
  )
}

function ActionBtn({ onClick, icon, children, disabled }: {
  onClick: () => void
  icon: React.ReactNode
  children: React.ReactNode
  disabled?: boolean
}) {
  return (
    <button
      type="button"
      onClick={onClick}
      disabled={disabled}
      className="inline-flex items-center gap-1.5 px-3 py-1.5 text-xs bg-cyber-primary/10 hover:bg-cyber-primary/20 border border-cyber-primary/30 text-cyber-primary rounded-lg transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
    >
      {icon} {children}
    </button>
  )
}
