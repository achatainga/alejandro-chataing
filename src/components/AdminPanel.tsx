import { useState, useCallback, useEffect } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { X, Save, Download, Upload, Sparkles, Key, FileJson, Bell, MessageSquare, Mail, RefreshCw, CheckCheck } from 'lucide-react'
import { collection, query, orderBy, limit, getDocs, doc, updateDoc } from 'firebase/firestore'
import { db } from '../lib/firebase'
import type { CVData } from '../types/cv'
import type { Lang } from '../i18n/translations'

interface Props {
  open: boolean
  onClose: () => void
  data: CVData
  onUpdate: (data: CVData) => void
  lang: Lang
}

type Tab = 'notifications' | 'cv' | 'ai'

interface Notification {
  id: string
  source: 'email_form' | 'whatsapp_button'
  name: string
  company: string
  email?: string
  phone?: string
  message: string
  attachmentUrl?: string
  attachmentName?: string
  createdAt: { seconds: number } | null
  read: boolean
}

export default function AdminPanel({ open, onClose, data, onUpdate, lang }: Props) {
  const [tab, setTab] = useState<Tab>('notifications')

  // --- Notifications state ---
  const [notifications, setNotifications] = useState<Notification[]>([])
  const [nLoading, setNLoading]           = useState(false)
  const [nError, setNError]               = useState('')

  // --- CV Editor state ---
  const [json, setJson]         = useState(() => JSON.stringify(data, null, 2))
  const [jsonError, setJsonError] = useState('')

  // --- AI state ---
  const [geminiKey, setGeminiKey] = useState(() => sessionStorage.getItem('gemini_key') ?? '')
  const [jobDesc, setJobDesc]     = useState('')
  const [aiLoading, setAiLoading] = useState(false)
  const [aiStatus, setAiStatus]   = useState('')

  const fetchNotifications = useCallback(async () => {
    setNLoading(true); setNError('')
    try {
      const load = async (type: string) => {
        const q = query(
          collection(db, 'notifications', type, 'items'),
          orderBy('createdAt', 'desc'),
          limit(50)
        )
        const snap = await getDocs(q)
        return snap.docs.map((d) => ({ id: d.id, ...d.data() } as Notification))
      }
      const [hires, whatsapps] = await Promise.all([load('hire_me'), load('whatsapp')])
      setNotifications([...hires, ...whatsapps].sort((a, b) =>
        (b.createdAt?.seconds ?? 0) - (a.createdAt?.seconds ?? 0)
      ))
    } catch (e) {
      setNError(`Failed to load: ${e}`)
    }
    setNLoading(false)
  }, [])

  useEffect(() => {
    if (open && tab === 'notifications') fetchNotifications()
  }, [open, tab, fetchNotifications])

  const markRead = useCallback(async (n: Notification) => {
    if (n.read) return
    const type = n.source === 'email_form' ? 'hire_me' : 'whatsapp'
    await updateDoc(doc(db, 'notifications', type, 'items', n.id), { read: true })
    setNotifications((prev) => prev.map((x) => x.id === n.id ? { ...x, read: true } : x))
  }, [])

  // --- CV Editor ---
  const handleJsonChange = useCallback((e: React.ChangeEvent<HTMLTextAreaElement>) => {
    setJson(e.target.value); setJsonError('')
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
  }, [json, onUpdate, lang])

  const handleExport = useCallback(() => {
    const blob = new Blob([json], { type: 'application/json' })
    const url = URL.createObjectURL(blob)
    const a = document.createElement('a')
    a.href = url; a.download = 'alejandro-cv.json'; a.click()
    URL.revokeObjectURL(url)
  }, [json])

  const handleImport = useCallback((e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0]
    if (!file) return
    const reader = new FileReader()
    reader.onload = (ev) => { setJson(ev.target?.result as string); setJsonError('') }
    reader.readAsText(file)
  }, [])

  // --- AI Tailoring ---
  const handleSaveKey = useCallback(() => {
    sessionStorage.setItem('gemini_key', geminiKey)
    setAiStatus('API key saved to session')
  }, [geminiKey])

  const handleAITailor = useCallback(async () => {
    if (!geminiKey || !jobDesc.trim()) {
      setAiStatus('Add Gemini API key and paste job description first'); return
    }
    setAiLoading(true); setAiStatus('Calling Gemini...')

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

    for (let attempt = 1; attempt <= 5; attempt++) {
      try {
        const res = await fetch(url, {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({ contents: [{ parts: [{ text: prompt }] }] }),
        })
        if (!res.ok) throw new Error(`HTTP ${res.status}`)
        const result = await res.json()
        const text: string = result.candidates?.[0]?.content?.parts?.[0]?.text ?? ''
        setJson(text.replace(/```json|```/g, '').trim())
        setAiStatus('✓ CV optimized by Gemini AI')
        break
      } catch (err) {
        if (attempt >= 5) { setAiStatus(`Error after 5 attempts: ${err}`) }
        else { await new Promise((r) => setTimeout(r, 1000 * attempt)); setAiStatus(`Retry ${attempt}/5...`) }
      }
    }
    setAiLoading(false)
  }, [geminiKey, jobDesc, json])

  const unread = notifications.filter((n) => !n.read).length

  return (
    <AnimatePresence>
      {open && (
        <motion.div
          initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}
          className="admin-panel fixed inset-0 z-50 bg-black/80 backdrop-blur-sm flex items-center justify-center p-4 no-print"
          onClick={(e) => e.target === e.currentTarget && onClose()}
        >
          <motion.div
            initial={{ scale: 0.95, opacity: 0 }} animate={{ scale: 1, opacity: 1 }}
            exit={{ scale: 0.95, opacity: 0 }} transition={{ duration: 0.2 }}
            className="bg-cyber-surface border border-cyber-primary/40 rounded-2xl w-full max-w-4xl max-h-[90vh] overflow-hidden flex flex-col"
          >
            {/* Header */}
            <div className="flex items-center justify-between px-5 py-4 border-b border-cyber-border">
              <div className="flex items-center gap-2">
                <span className="w-2 h-2 rounded-full bg-cyber-primary animate-pulse-slow" />
                <span className="text-cyber-primary font-mono text-sm font-semibold">Admin Panel</span>
              </div>
              <button type="button" onClick={onClose} className="text-cyber-muted hover:text-cyber-text transition-colors">
                <X size={18} />
              </button>
            </div>

            {/* Tabs */}
            <div className="flex border-b border-cyber-border px-5">
              {([
                { id: 'notifications', label: 'Notifications', icon: <Bell size={13} />, badge: unread },
                { id: 'cv',            label: 'CV Editor',     icon: <FileJson size={13} /> },
                { id: 'ai',            label: 'AI Tailoring',  icon: <Sparkles size={13} /> },
              ] as const).map((t) => (
                <button
                  key={t.id}
                  type="button"
                  onClick={() => setTab(t.id)}
                  className={`flex items-center gap-1.5 px-4 py-3 text-xs font-medium border-b-2 transition-colors relative ${
                    tab === t.id
                      ? 'border-cyber-primary text-cyber-primary'
                      : 'border-transparent text-cyber-muted hover:text-cyber-text'
                  }`}
                >
                  {t.icon} {t.label}
                  {'badge' in t && t.badge > 0 && (
                    <span className="ml-1 px-1.5 py-0.5 bg-red-500 text-white text-[10px] rounded-full leading-none">
                      {t.badge}
                    </span>
                  )}
                </button>
              ))}
            </div>

            <div className="flex-1 overflow-y-auto p-5">

              {/* NOTIFICATIONS TAB */}
              {tab === 'notifications' && (
                <div className="space-y-3">
                  <div className="flex items-center justify-between">
                    <span className="text-xs text-cyber-muted">{notifications.length} contacts</span>
                    <button type="button" onClick={fetchNotifications} disabled={nLoading}
                      className="flex items-center gap-1 text-xs text-cyber-muted hover:text-cyber-primary transition-colors disabled:opacity-50">
                      <RefreshCw size={12} className={nLoading ? 'animate-spin' : ''} /> Refresh
                    </button>
                  </div>

                  {nError && <p className="text-red-400 text-xs">{nError}</p>}

                  {!nLoading && notifications.length === 0 && (
                    <p className="text-cyber-muted text-sm text-center py-12">No contacts yet.</p>
                  )}

                  {notifications.map((n) => (
                    <div
                      key={n.id}
                      onClick={() => markRead(n)}
                      className={`rounded-xl border p-4 cursor-pointer transition-colors ${
                        n.read
                          ? 'border-cyber-border bg-cyber-bg/40 opacity-60'
                          : 'border-cyber-primary/40 bg-cyber-primary/5 hover:bg-cyber-primary/10'
                      }`}
                    >
                      <div className="flex items-start justify-between gap-2">
                        <div className="flex items-center gap-2">
                          {n.source === 'email_form'
                            ? <Mail size={13} className="text-cyber-primary flex-shrink-0" />
                            : <MessageSquare size={13} className="text-cyber-accent flex-shrink-0" />
                          }
                          <span className="text-sm font-semibold text-cyber-text">{n.name || '(no name)'}</span>
                          {n.company && <span className="text-xs text-cyber-muted">· {n.company}</span>}
                        </div>
                        <div className="flex items-center gap-2 flex-shrink-0">
                          {n.read && <CheckCheck size={12} className="text-cyber-accent" />}
                          <span className="text-[10px] text-cyber-muted font-mono">
                            {n.createdAt ? new Date(n.createdAt.seconds * 1000).toLocaleString() : '—'}
                          </span>
                        </div>
                      </div>

                      {(n.email || n.phone) && (
                        <div className="flex gap-3 mt-1.5 text-xs text-cyber-muted">
                          {n.email && <a href={`mailto:${n.email}`} className="hover:text-cyber-primary transition-colors" onClick={(e) => e.stopPropagation()}>{n.email}</a>}
                          {n.phone && <a href={`https://wa.me/${n.phone.replace(/\D/g,'')}`} target="_blank" rel="noreferrer" className="hover:text-cyber-accent transition-colors" onClick={(e) => e.stopPropagation()}>{n.phone}</a>}
                        </div>
                      )}

                      {n.message && (
                        <p className="mt-2 text-xs text-cyber-muted leading-relaxed line-clamp-3">{n.message}</p>
                      )}

                      {n.attachmentUrl && (
                        <a href={n.attachmentUrl} target="_blank" rel="noreferrer"
                          className="inline-flex items-center gap-1 mt-2 text-xs text-cyber-primary hover:underline"
                          onClick={(e) => e.stopPropagation()}>
                          📎 {n.attachmentName || 'attachment'}
                        </a>
                      )}
                    </div>
                  ))}
                </div>
              )}

              {/* CV EDITOR TAB */}
              {tab === 'cv' && (
                <div className="space-y-5">
                  <Section icon={<FileJson size={14} />} title="CV Data (JSON)">
                    <textarea
                      value={json} onChange={handleJsonChange}
                      className="w-full h-64 bg-cyber-bg border border-cyber-border rounded-lg p-3 text-xs font-mono text-cyber-text outline-none resize-none focus:border-cyber-primary/50 transition-colors"
                      spellCheck={false}
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
                </div>
              )}

              {/* AI TAILORING TAB */}
              {tab === 'ai' && (
                <div className="space-y-5">
                  <Section icon={<Key size={14} />} title="Gemini API Key (session only)">
                    <div className="flex gap-2">
                      <input type="password" value={geminiKey} onChange={(e) => setGeminiKey(e.target.value)}
                        placeholder="AIza..."
                        className="flex-1 bg-cyber-bg border border-cyber-border rounded-lg px-3 py-2 text-xs font-mono text-cyber-text outline-none focus:border-cyber-primary/50 transition-colors"
                      />
                      <ActionBtn onClick={handleSaveKey} icon={<Save size={12} />}>Save</ActionBtn>
                    </div>
                    <p className="text-cyber-muted text-xs mt-1">Stored in sessionStorage only — never sent anywhere except Gemini.</p>
                  </Section>

                  <Section icon={<Sparkles size={14} />} title="AI CV Tailoring (Gemini)">
                    <textarea
                      value={jobDesc} onChange={(e) => setJobDesc(e.target.value)}
                      placeholder="Paste job description here..."
                      className="w-full h-40 bg-cyber-bg border border-cyber-border rounded-lg p-3 text-xs text-cyber-text outline-none resize-none focus:border-cyber-primary/50 transition-colors"
                    />
                    <div className="flex items-center gap-3 mt-2">
                      <ActionBtn onClick={handleAITailor} disabled={aiLoading} icon={<Sparkles size={12} />}>
                        {aiLoading ? 'Optimizing...' : 'Adapt CV with AI'}
                      </ActionBtn>
                      {aiStatus && <span className="text-xs text-cyber-muted">{aiStatus}</span>}
                    </div>
                  </Section>
                </div>
              )}

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
  onClick: () => void; icon: React.ReactNode; children: React.ReactNode; disabled?: boolean
}) {
  return (
    <button type="button" onClick={onClick} disabled={disabled}
      className="inline-flex items-center gap-1.5 px-3 py-1.5 text-xs bg-cyber-primary/10 hover:bg-cyber-primary/20 border border-cyber-primary/30 text-cyber-primary rounded-lg transition-colors disabled:opacity-50 disabled:cursor-not-allowed">
      {icon} {children}
    </button>
  )
}
