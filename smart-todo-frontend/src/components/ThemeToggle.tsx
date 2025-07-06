'use client'
import { useEffect, useState } from 'react'

export default function ThemeToggle() {
  const [theme, setTheme] = useState<'light'|'dark'>('light')

  useEffect(() => {
    const stored = localStorage.getItem('theme') as 'light'|'dark'|null
    const prefersDark = window.matchMedia('(prefers-color-scheme: dark)').matches
    const initial = stored ?? (prefersDark ? 'dark' : 'light')
    console.log('[ThemeToggle] initial theme:', initial)
    setTheme(initial)
    document.documentElement.classList.toggle('dark', initial === 'dark')
  }, [])

  const toggle = () => {
    const next = theme === 'dark' ? 'light' : 'dark'
    console.log('[ThemeToggle] toggling to', next)
    setTheme(next)
    localStorage.setItem('theme', next)
    document.documentElement.classList.toggle('dark', next === 'dark')
  }

  return (
    <button onClick={toggle} aria-label="Toggle dark mode" className="p-2">
      {theme === 'dark' ? '🌞' : '🌙'}
    </button>
  )
}
