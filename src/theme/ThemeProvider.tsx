import { useEffect, useMemo, useState, type ReactNode } from 'react'
import { ThemeContext, type Theme } from './ThemeContext'

const STORAGE_KEY = 'theme' // also read by public/theme-init.js
const DARK_QUERY = '(prefers-color-scheme: dark)'

function readSavedTheme(): Theme {
  try {
    const saved = localStorage.getItem(STORAGE_KEY)
    return saved === 'light' || saved === 'dark' ? saved : 'system'
  } catch {
    return 'system'
  }
}

/** Light / dark mode: toggles the "dark" class on <html>, which switches the CSS tokens. */
export function ThemeProvider({ children }: { children: ReactNode }) {
  const [theme, setThemeState] = useState<Theme>(readSavedTheme)
  const [systemDark, setSystemDark] = useState(() => window.matchMedia(DARK_QUERY).matches)

  // Follow the OS setting live while the user has not chosen a theme
  useEffect(() => {
    const media = window.matchMedia(DARK_QUERY)
    const onChange = (event: MediaQueryListEvent) => setSystemDark(event.matches)
    media.addEventListener('change', onChange)
    return () => media.removeEventListener('change', onChange)
  }, [])

  const resolvedTheme = theme === 'system' ? (systemDark ? 'dark' : 'light') : theme

  useEffect(() => {
    document.documentElement.classList.toggle('dark', resolvedTheme === 'dark')
  }, [resolvedTheme])

  const value = useMemo(
    () => ({
      theme,
      resolvedTheme,
      setTheme: (next: Theme) => {
        try {
          localStorage.setItem(STORAGE_KEY, next)
        } catch {
          // ignore: the choice just won't be remembered
        }
        setThemeState(next)
      },
    }),
    [theme, resolvedTheme],
  )

  return <ThemeContext value={value}>{children}</ThemeContext>
}
