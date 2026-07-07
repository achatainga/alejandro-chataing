import { useState, useCallback, useEffect } from 'react'
import type { Lang } from '../i18n/translations'

const STORAGE_KEY = 'cv_lang'

const detectLang = (): Lang => {
  // 1. Query param ?lang=es or ?lang=en
  const param = new URLSearchParams(window.location.search).get('lang')
  if (param === 'es' || param === 'en') return param

  // 2. localStorage
  const stored = localStorage.getItem(STORAGE_KEY)
  if (stored === 'es' || stored === 'en') return stored

  // 3. Browser locale
  return navigator.language.startsWith('es') ? 'es' : 'en'
}

export function useLang() {
  const [lang, setLangState] = useState<Lang>(detectLang)

  const setLang = useCallback((l: Lang) => {
    setLangState(l)
    localStorage.setItem(STORAGE_KEY, l)
    // Update URL param without reload
    const url = new URL(window.location.href)
    url.searchParams.set('lang', l)
    window.history.replaceState(null, '', url.toString())
  }, [])

  const toggle = useCallback(() => setLang(lang === 'en' ? 'es' : 'en'), [lang, setLang])

  // Sync if query param changes externally
  useEffect(() => {
    const param = new URLSearchParams(window.location.search).get('lang')
    if (param === 'es' || param === 'en') setLangState(param)
  }, [])

  return { lang, setLang, toggle }
}
