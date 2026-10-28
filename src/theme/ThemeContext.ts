import { createContext } from 'react'

export type Theme = 'light' | 'dark' | 'system'

export interface ThemeContextValue {
  /** What the user chose. */
  theme: Theme
  /** What is actually displayed ("system" resolved with the OS preference). */
  resolvedTheme: 'light' | 'dark'
  setTheme: (theme: Theme) => void
}

// Default value lets components render outside the provider (e.g. in unit tests)
export const ThemeContext = createContext<ThemeContextValue>({
  theme: 'system',
  resolvedTheme: 'light',
  setTheme: () => {},
})
