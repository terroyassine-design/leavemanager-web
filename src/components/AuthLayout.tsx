import { CalendarCheckIcon, HistoryIcon, ShieldCheckIcon } from 'lucide-react'
import type { ReactNode } from 'react'
import { Logo } from './Logo'
import { ThemeToggle } from './ThemeToggle'

const FEATURES = [
  { icon: CalendarCheckIcon, text: 'Solde de congés calculé automatiquement' },
  { icon: ShieldCheckIcon, text: 'Détection des demandes qui se chevauchent' },
  { icon: HistoryIcon, text: 'Historique clair de chaque décision' },
]

/** Two-column frame for the login and register pages. */
export function AuthLayout({ title, subtitle, children }: { title: string; subtitle: string; children: ReactNode }) {
  return (
    <div className="grid min-h-screen lg:grid-cols-2">
      <aside className="hidden flex-col justify-between bg-panel p-12 text-panel-foreground lg:flex">
        <Logo inverted />
        <div className="max-w-md space-y-8">
          <h2 className="text-4xl leading-tight font-semibold tracking-tight">
            Posez vos congés.
            <br />
            Votre manager valide en un clic.
          </h2>
          <ul className="space-y-4">
            {FEATURES.map(({ icon: Icon, text }) => (
              <li key={text} className="flex items-center gap-3 text-panel-foreground/85">
                <span className="flex size-8 items-center justify-center rounded-lg bg-panel-foreground/10">
                  <Icon className="size-4" />
                </span>
                {text}
              </li>
            ))}
          </ul>
        </div>
        <p className="text-sm text-panel-foreground/70">Projet portfolio · Spring Boot + React</p>
      </aside>

      <main className="relative flex items-center justify-center px-4 py-12">
        <div className="absolute top-4 right-4">
          <ThemeToggle />
        </div>
        <div className="w-full max-w-sm space-y-6">
          <div className="lg:hidden">
            <Logo />
          </div>
          <div className="space-y-1">
            <h1 className="text-2xl font-semibold tracking-tight">{title}</h1>
            <p className="text-sm text-muted-foreground">{subtitle}</p>
          </div>
          {children}
        </div>
      </main>
    </div>
  )
}
