import { InfoIcon, MailIcon, PalmtreeIcon, ShieldIcon } from 'lucide-react'
import { useAuth } from '@/auth/useAuth'
import { PageHeader } from '@/components/PageHeader'
import { PasswordForm } from '@/components/PasswordForm'
import { ProfileForm } from '@/components/ProfileForm'
import { Alert, AlertDescription, AlertTitle } from '@/components/ui/alert'
import { Avatar, AvatarFallback } from '@/components/ui/avatar'
import { Badge } from '@/components/ui/badge'
import { Card, CardContent } from '@/components/ui/card'
import { formatDays, initials, ROLE_LABELS } from '@/lib/format'

export function ProfilePage() {
  const { user } = useAuth()
  if (!user) return null

  return (
    <div className="space-y-8">
      <PageHeader title="Mon profil" description="Vos informations personnelles et la sécurité de votre compte." />

      {user.demo && (
        <Alert>
          <InfoIcon />
          <AlertTitle>Compte de démonstration</AlertTitle>
          <AlertDescription>
            Ce compte est partagé avec les autres visiteurs : son profil ne peut pas être modifié. Créez votre propre
            compte pour tester la modification du profil.
          </AlertDescription>
        </Alert>
      )}

      <div className="grid items-start gap-6 lg:grid-cols-[1fr_2fr]">
        <Card>
          <CardContent className="flex flex-col items-center gap-4 text-center">
            <Avatar className="size-20">
              <AvatarFallback className="bg-accent text-2xl font-semibold text-accent-foreground">
                {initials(user.fullName)}
              </AvatarFallback>
            </Avatar>
            <div className="space-y-1">
              <p className="text-lg font-semibold">{user.fullName}</p>
              <Badge variant="secondary">{ROLE_LABELS[user.role]}</Badge>
            </div>
            <dl className="grid w-full gap-3 border-t pt-4 text-left">
              <ProfileDetail icon={MailIcon} label="Email" value={user.email} />
              <ProfileDetail icon={ShieldIcon} label="Rôle" value={ROLE_LABELS[user.role]} />
              <ProfileDetail icon={PalmtreeIcon} label="Solde de congés" value={formatDays(user.leaveBalance)} />
            </dl>
          </CardContent>
        </Card>

        <div className="grid gap-6">
          {/* key: re-create the form with fresh values when the saved profile changes */}
          <ProfileForm key={`${user.fullName}|${user.email}`} user={user} />
          <PasswordForm disabled={user.demo} />
        </div>
      </div>
    </div>
  )
}

function ProfileDetail({ icon: Icon, label, value }: { icon: typeof MailIcon; label: string; value: string }) {
  return (
    <div className="flex items-center gap-3">
      <span className="flex size-8 shrink-0 items-center justify-center rounded-lg bg-muted text-muted-foreground">
        <Icon className="size-4" />
      </span>
      <div className="min-w-0">
        <dt className="text-xs text-muted-foreground">{label}</dt>
        <dd className="truncate">{value}</dd>
      </div>
    </div>
  )
}
