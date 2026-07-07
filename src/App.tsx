import { useState, useEffect, useCallback, useRef } from 'react'
import { X } from 'lucide-react'
import CanvasBackground from './components/CanvasBackground'
import Navbar from './components/Navbar'
import Hero from './components/Hero'
import ExperienceTimeline from './components/ExperienceTimeline'
import SkillsRadar from './components/SkillsRadar'
import ProjectsGrid from './components/ProjectsGrid'
import ShowcaseSection from './components/ShowcaseSection'
import GitHubSection from './components/GitHubSection'
import AdminPanel from './components/AdminPanel'
import HireMeModal from './components/HireMeModal'
import AIChatWidget from './components/AIChatWidget'
import PrintCV from './components/PrintCV'
import { defaultCVData } from './utils/defaultData'
import { t } from './i18n/translations'
import { useLang } from './hooks/useLang'
import type { CVData } from './types/cv'
import type { Translations } from './i18n/translations'

const LOGO_CLICKS_REQUIRED = 5
const LOGO_CLICK_TIMEOUT_MS = 3000

export default function App() {
  const { lang, toggle } = useLang()
  const tr = t[lang]

  const [cvData, setCVData] = useState<CVData>(() => {
    const saved = localStorage.getItem(`cv_data_${lang}`)
    if (!saved) return defaultCVData[lang]
    try { return JSON.parse(saved) as CVData } catch { return defaultCVData[lang] }
  })

  // Swap CV dataset when language changes
  useEffect(() => {
    const saved = localStorage.getItem(`cv_data_${lang}`)
    if (saved) {
      try { setCVData(JSON.parse(saved) as CVData); return } catch { /* fall through */ }
    }
    setCVData(defaultCVData[lang])
  }, [lang])

  const [adminOpen, setAdminOpen] = useState(false)
  const [adminAuthOpen, setAdminAuthOpen] = useState(false)
  const [hireMeOpen, setHireMeOpen] = useState(false)
  const [hireMePrefill, setHireMePrefill] = useState<{ name: string; company: string; email: string; phone: string; message: string } | undefined>()
  const [installPrompt, setInstallPrompt] = useState<BeforeInstallPromptEvent | null>(null)

  const logoClicksRef = useRef(0)
  const logoTimerRef = useRef<ReturnType<typeof setTimeout> | null>(null)

  const openAdmin = useCallback(() => setAdminAuthOpen(true), [])

  useEffect(() => {
    const onKeyDown = (e: KeyboardEvent) => {
      if (e.ctrlKey && e.shiftKey && e.key === 'A') {
        e.preventDefault()
        openAdmin()
      }
    }
    window.addEventListener('keydown', onKeyDown)
    return () => window.removeEventListener('keydown', onKeyDown)
  }, [openAdmin])

  useEffect(() => {
    const handler = (e: Event) => {
      e.preventDefault()
      setInstallPrompt(e as BeforeInstallPromptEvent)
    }
    window.addEventListener('beforeinstallprompt', handler)
    return () => window.removeEventListener('beforeinstallprompt', handler)
  }, [])

  const handleLogoClick = useCallback(() => {
    logoClicksRef.current += 1
    if (logoTimerRef.current) clearTimeout(logoTimerRef.current)
    logoTimerRef.current = setTimeout(() => { logoClicksRef.current = 0 }, LOGO_CLICK_TIMEOUT_MS)
    if (logoClicksRef.current >= LOGO_CLICKS_REQUIRED) {
      logoClicksRef.current = 0
      openAdmin()
    }
  }, [])

  const handleInstall = useCallback(async () => {
    if (!installPrompt) return
    await installPrompt.prompt()
    setInstallPrompt(null)
  }, [installPrompt])

  return (
    <div className="relative min-h-screen bg-cyber-bg">
      <CanvasBackground />

      <Navbar
        tr={tr}
        onHireMe={() => setHireMeOpen(true)}
        onLangToggle={toggle}
        onInstall={installPrompt ? handleInstall : undefined}
      />

      <main className="relative">
        <Hero data={cvData} onLogoClick={handleLogoClick} tr={tr} />
        <ExperienceTimeline experience={cvData.experience} tr={tr} />
        <ProjectsGrid projects={cvData.projects} tr={tr} />
        <SkillsRadar skillGroups={cvData.skillGroups} tr={tr} />
        <ShowcaseSection tr={tr} />
        <GitHubSection tr={tr} />
        <EducationSection data={cvData} tr={tr} />
        <Footer data={cvData} tr={tr} onHireMe={() => setHireMeOpen(true)} />
      </main>

      <AdminAuthModal
        open={adminAuthOpen}
        onClose={() => setAdminAuthOpen(false)}
        onSuccess={() => { setAdminAuthOpen(false); setAdminOpen(true) }}
      />
      <AdminPanel open={adminOpen} onClose={() => setAdminOpen(false)} data={cvData} onUpdate={setCVData} lang={lang} />
      <HireMeModal open={hireMeOpen} onClose={() => setHireMeOpen(false)} tr={tr} prefill={hireMePrefill} />
      <AIChatWidget
        cvData={cvData}
        onOpenHireMe={(prefill) => { setHireMePrefill(prefill); setHireMeOpen(true) }}
      />
      <AIChatWidget
        cvData={cvData}
        onOpenHireMe={(prefill) => { setHireMePrefill(prefill); setHireMeOpen(true) }}
      />
      <div className="print-cv-root">
        <PrintCV data={cvData} />
      </div>
    </div>
  )
}

function EducationSection({ data, tr }: { data: CVData; tr: Translations }) {
  return (
    <section id="education" className="relative z-10 max-w-4xl mx-auto px-6 py-16">
      <h2 className="text-2xl font-bold text-cyber-text mb-8 flex items-center gap-3">
        <span className="text-cyber-primary font-mono text-lg">{'>'}</span>
        {tr.education}
        <span className="flex-1 h-px bg-cyber-border" />
      </h2>
      <div className="grid md:grid-cols-2 gap-6">
        <div className="space-y-4">
          {data.education.map((edu, i) => (
            <div key={i} className="bg-cyber-surface border border-cyber-border rounded-xl p-4">
              <h3 className="font-semibold text-cyber-text">{edu.institution}</h3>
              <p className="text-cyber-primary text-sm">{edu.degree}</p>
              <p className="text-cyber-muted text-xs mt-0.5">{edu.period}</p>
              {edu.details && (
                <ul className="mt-2 space-y-0.5">
                  {edu.details.map((d, j) => (
                    <li key={j} className="text-cyber-muted text-xs flex gap-1.5">
                      <span className="text-cyber-accent">›</span>{d}
                    </li>
                  ))}
                </ul>
              )}
            </div>
          ))}
        </div>
        <div className="space-y-4">
          {data.languages.map((lang, i) => (
            <div key={i} className="bg-cyber-surface border border-cyber-border rounded-xl p-4">
              <div className="flex items-center justify-between mb-1">
                <h3 className="font-semibold text-cyber-text">{lang.name}</h3>
                <span className="text-xs font-mono px-2 py-0.5 bg-cyber-primary/10 text-cyber-primary rounded">{lang.level}</span>
              </div>
              {lang.detail && <p className="text-cyber-muted text-xs leading-relaxed">{lang.detail}</p>}
            </div>
          ))}
        </div>
      </div>
    </section>
  )
}

function Footer({ data, tr, onHireMe }: { data: CVData; tr: Translations; onHireMe: () => void }) {
  return (
    <footer className="relative z-10 text-center py-12 border-t border-cyber-border no-print">
      <button
        type="button"
        onClick={onHireMe}
        className="inline-flex items-center gap-2 px-8 py-3 bg-cyber-primary text-cyber-bg font-bold rounded-xl hover:bg-cyber-primary/90 transition-colors mb-6 text-base"
      >
        <svg viewBox="0 0 24 24" width="16" height="16" fill="none" stroke="currentColor" strokeWidth="2.5">
          <path d="M20 21v-2a4 4 0 0 0-4-4H8a4 4 0 0 0-4 4v2" />
          <circle cx="12" cy="7" r="4" />
        </svg>
        {tr.hireMe}
      </button>
      <p className="text-cyber-muted text-sm font-mono">
        <span className="text-cyber-primary">{data.name}</span> · Built with React + Vite + mcp-code-context
      </p>
    </footer>
  )
}

interface BeforeInstallPromptEvent extends Event {
  prompt(): Promise<void>
}

const ADMIN_PWD = import.meta.env.VITE_ADMIN_PASSWORD ?? ''

function AdminAuthModal({ open, onClose, onSuccess }: {
  open: boolean; onClose: () => void; onSuccess: () => void
}) {
  const [pwd, setPwd] = useState('')
  const [err, setErr]  = useState(false)

  const handleSubmit = useCallback((e: React.FormEvent) => {
    e.preventDefault()
    if (pwd === ADMIN_PWD) { setPwd(''); setErr(false); onSuccess() }
    else { setErr(true); setPwd('') }
  }, [pwd, onSuccess])

  const handleClose = useCallback(() => { setPwd(''); setErr(false); onClose() }, [onClose])

  if (!open) return null

  return (
    <div className="fixed inset-0 z-50 bg-black/80 backdrop-blur-sm flex items-center justify-center p-4 no-print"
      onClick={(e) => e.target === e.currentTarget && handleClose()}>
      <div className="bg-cyber-surface border border-cyber-primary/40 rounded-2xl w-full max-w-xs overflow-hidden">
        <div className="flex items-center justify-between px-5 py-4 border-b border-cyber-border">
          <span className="text-cyber-primary font-mono text-sm">{'> admin_access'}</span>
          <button type="button" onClick={handleClose} className="text-cyber-muted hover:text-cyber-text transition-colors">
            <X size={16} />
          </button>
        </div>
        <form onSubmit={handleSubmit} className="p-5 space-y-3">
          <input type="text" name="username" value="admin" readOnly className="hidden" autoComplete="username" />
          <input
            type="password"
            name="password"
            value={pwd}
            onChange={(e) => { setPwd(e.target.value); setErr(false) }}
            placeholder="Password"
            autoFocus
            autoComplete="current-password"
            className="w-full bg-cyber-bg border border-cyber-border rounded-lg px-3 py-2 text-sm text-cyber-text outline-none focus:border-cyber-primary/50 transition-colors font-mono"
          />
          {err && <p className="text-red-400 text-xs font-mono">Access denied.</p>}
          <button type="submit"
            className="w-full py-2 bg-cyber-primary text-cyber-bg text-sm font-semibold rounded-lg hover:bg-cyber-primary/90 transition-colors">
            Enter
          </button>
        </form>
      </div>
    </div>
  )
}
