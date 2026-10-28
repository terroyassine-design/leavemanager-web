import type { ReactNode } from 'react'
import { Label } from '@/components/ui/label'

interface FormFieldProps {
  label: string
  htmlFor: string
  error?: string
  children: ReactNode
}

/** Label + control + validation message, with consistent spacing everywhere. */
export function FormField({ label, htmlFor, error, children }: FormFieldProps) {
  return (
    <div className="grid gap-2">
      <Label htmlFor={htmlFor}>{label}</Label>
      {children}
      {error && <p className="text-sm text-destructive">{error}</p>}
    </div>
  )
}
