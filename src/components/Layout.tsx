import { NavLink, Outlet } from 'react-router'
import { useAuth } from '@/auth/useAuth'
import { buttonVariants } from '@/components/ui/button'
import { cn } from '@/lib/utils'
import { Logo } from './Logo'
import { ThemeToggle } from './ThemeToggle'
import { UserMenu } from './UserMenu'

const navLinkClass = ({ isActive }: { isActive: boolean }) =>
  cn(buttonVariants({ variant: 'ghost' }), isActive && 'bg-accent text-accent-foreground hover:bg-accent')

/** Page frame for logged-in users: top bar with navigation + the current page. */
export function Layout() {
  const { user } = useAuth()
  if (!user) return null

  return (
    <div className="min-h-screen">
      <header className="sticky top-0 z-10 border-b bg-card/80 backdrop-blur">
        <div className="mx-auto flex h-14 max-w-5xl items-center justify-between gap-3 px-4">
          <div className="flex items-center gap-4 sm:gap-6">
            <Logo />
            <nav className="flex gap-1">
              <NavLink to="/" end className={navLinkClass}>
                Mes congés
              </NavLink>
              {user.role === 'MANAGER' && (
                <NavLink to="/manager" className={navLinkClass}>
                  Validation
                </NavLink>
              )}
            </nav>
          </div>
          <div className="flex items-center gap-1">
            <ThemeToggle />
            <UserMenu />
          </div>
        </div>
      </header>
      <main className="mx-auto max-w-5xl px-4 py-8">
        <Outlet />
      </main>
    </div>
  )
}
