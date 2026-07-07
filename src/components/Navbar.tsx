import { useState, useEffect, useCallback } from 'react'
import type { Translations } from '../i18n/translations'

interface Props {
  tr: Translations
  onHireMe: () => void
  onLangToggle: () => void
  onInstall?: () => void
}

const NAV_LINKS = [
  { id: 'experience', labelKey: 'experience' },
  { id: 'projects',   labelKey: 'projects'   },
  { id: 'skills',     labelKey: 'skills'     },
  { id: 'showcase',   labelKey: 'showcase'   },
  { id: 'github',     labelKey: 'githubRepos'},
  { id: 'education',  labelKey: 'education'  },
] as const

type LabelKey = typeof NAV_LINKS[number]['labelKey']

const scrollTo = (id: string) =>
  document.getElementById(id)?.scrollIntoView({ behavior: 'smooth' })

export default function Navbar({ tr, onHireMe, onLangToggle, onInstall }: Props) {
  const [scrolled,     setScrolled]     = useState(false)
  const [menuOpen,     setMenuOpen]     = useState(false)

  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 20)
    window.addEventListener('scroll', onScroll, { passive: true })
    return () => window.removeEventListener('scroll', onScroll)
  }, [])

  const handleNavClick = useCallback((id: string) => {
    scrollTo(id)
    setMenuOpen(false)
  }, [])

  return (
    <header
      className={`fixed top-0 left-0 right-0 z-40 no-print transition-all duration-300 ${
        scrolled ? 'bg-cyber-bg/90 backdrop-blur-md border-b border-cyber-border' : 'bg-transparent'
      }`}
    >
      <nav className="max-w-6xl mx-auto px-4 h-14 flex items-center justify-between gap-4">

        {/* Logo */}
        <button
          type="button"
          onClick={() => scrollTo('hero')}
          className="font-mono text-cyber-primary font-bold text-sm tracking-widest hover:text-cyber-text transition-colors flex-shrink-0"
        >
          AC<span className="text-cyber-accent">.</span>
        </button>

        {/* Desktop links */}
        <ul className="hidden md:flex items-center gap-1">
          {NAV_LINKS.map(({ id, labelKey }) => (
            <li key={id}>
              <button
                type="button"
                onClick={() => handleNavClick(id)}
                className="px-3 py-1.5 text-xs text-cyber-muted hover:text-cyber-primary transition-colors rounded font-mono"
              >
                {tr[labelKey as LabelKey]}
              </button>
            </li>
          ))}
        </ul>

        {/* Right actions */}
        <div className="flex items-center gap-2 flex-shrink-0">
          {onInstall && (
            <button
              type="button"
              onClick={onInstall}
              title={tr.installApp}
              className="hidden sm:flex items-center gap-1.5 px-3 py-1.5 bg-cyber-surface border border-cyber-border rounded-lg text-xs text-cyber-muted hover:text-cyber-text transition-colors"
            >
              <svg viewBox="0 0 24 24" width="13" height="13" fill="none" stroke="currentColor" strokeWidth="2">
                <path d="M12 2a10 10 0 1 0 0 20A10 10 0 0 0 12 2z" />
                <path d="M8 12l4 4 4-4M12 8v8" />
              </svg>
              {tr.installApp}
            </button>
          )}

          {/* Lang toggle */}
          <button
            type="button"
            onClick={onLangToggle}
            title={tr.switchLang}
            className="flex items-center gap-1.5 px-2 py-1.5 bg-cyber-surface border border-cyber-border rounded-lg text-xs text-cyber-muted hover:text-cyber-primary transition-colors font-mono"
          >
            <svg viewBox="0 0 24 24" width="13" height="13" fill="none" stroke="currentColor" strokeWidth="2">
              <circle cx="12" cy="12" r="10" />
              <path d="M2 12h20M12 2a15.3 15.3 0 0 1 4 10 15.3 15.3 0 0 1-4 10 15.3 15.3 0 0 1-4-10 15.3 15.3 0 0 1 4-10z" />
            </svg>
            {tr.language}
          </button>

          {/* Hire Me */}
          <button
            type="button"
            onClick={onHireMe}
            className="flex items-center gap-1.5 px-4 py-1.5 bg-cyber-primary text-cyber-bg text-xs font-bold rounded-lg hover:bg-cyber-primary/90 transition-colors"
          >
            <svg viewBox="0 0 24 24" width="13" height="13" fill="none" stroke="currentColor" strokeWidth="2.5">
              <path d="M20 21v-2a4 4 0 0 0-4-4H8a4 4 0 0 0-4 4v2" />
              <circle cx="12" cy="7" r="4" />
            </svg>
            <span className="hidden sm:inline">{tr.hireMe}</span>
            <span className="sm:hidden">Hire</span>
          </button>

          {/* Mobile hamburger */}
          <button
            type="button"
            onClick={() => setMenuOpen((v) => !v)}
            className="md:hidden flex flex-col gap-1 p-2 text-cyber-muted hover:text-cyber-primary transition-colors"
            aria-label="Toggle menu"
          >
            <span className={`block w-4 h-0.5 bg-current transition-transform duration-200 ${menuOpen ? 'rotate-45 translate-y-1.5' : ''}`} />
            <span className={`block w-4 h-0.5 bg-current transition-opacity duration-200 ${menuOpen ? 'opacity-0' : ''}`} />
            <span className={`block w-4 h-0.5 bg-current transition-transform duration-200 ${menuOpen ? '-rotate-45 -translate-y-1.5' : ''}`} />
          </button>
        </div>
      </nav>

      {/* Mobile menu */}
      {menuOpen && (
        <div className="md:hidden bg-cyber-bg/95 backdrop-blur-md border-b border-cyber-border px-4 pb-4">
          <ul className="flex flex-col gap-1 pt-2">
            {NAV_LINKS.map(({ id, labelKey }) => (
              <li key={id}>
                <button
                  type="button"
                  onClick={() => handleNavClick(id)}
                  className="w-full text-left px-3 py-2 text-sm text-cyber-muted hover:text-cyber-primary transition-colors rounded font-mono"
                >
                  {tr[labelKey as LabelKey]}
                </button>
              </li>
            ))}
          </ul>
        </div>
      )}
    </header>
  )
}
