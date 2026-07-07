import { useEffect, useRef, useState } from 'react'

export function useParallax(factor: number) {
  const [offset, setOffset] = useState(0)
  const rafRef = useRef<number>(0)
  const lastScrollRef = useRef(0)

  useEffect(() => {
    const onScroll = () => {
      const scroll = window.scrollY
      if (scroll === lastScrollRef.current) return
      lastScrollRef.current = scroll

      cancelAnimationFrame(rafRef.current)
      rafRef.current = requestAnimationFrame(() => {
        setOffset(scroll * factor)
      })
    }

    window.addEventListener('scroll', onScroll, { passive: true })
    return () => {
      window.removeEventListener('scroll', onScroll)
      cancelAnimationFrame(rafRef.current)
    }
  }, [factor])

  return offset
}
