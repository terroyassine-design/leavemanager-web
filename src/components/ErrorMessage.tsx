import { CircleAlertIcon } from 'lucide-react'
import { ApiError } from '@/api/client'
import { Alert, AlertDescription } from '@/components/ui/alert'

/** Shows the message of a failed request (the API "detail"), or nothing. */
export function ErrorMessage({ error }: { error: unknown }) {
  if (!error) return null
  const message = error instanceof ApiError ? error.message : 'Une erreur inattendue est survenue'
  return (
    <Alert variant="destructive">
      <CircleAlertIcon />
      <AlertDescription>{message}</AlertDescription>
    </Alert>
  )
}
