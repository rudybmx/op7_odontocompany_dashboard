import * as React from 'react'
import { cn } from '@/lib/utils'

function Badge({ className, variant = 'default', ...props }: React.HTMLAttributes<HTMLDivElement> & { variant?: 'default' | 'secondary' | 'destructive' | 'outline' }) {
  const variants: Record<string, string> = {
    default: 'border-transparent bg-primary text-primary-foreground [a&]:hover:bg-primary/90',
    secondary: 'border-transparent bg-secondary text-secondary-foreground [a&]:hover:bg-secondary/90',
    destructive: 'border-transparent bg-destructive text-white [a&]:hover:bg-destructive/90',
    outline: 'text-foreground [a&]:hover:bg-accent [a&]:hover:text-accent-foreground',
  }
  return (
    <div
      data-slot="badge"
      className={cn(
        'inline-flex w-fit items-center justify-center gap-1 overflow-hidden rounded-md border px-2 py-0.5 text-xs font-medium whitespace-nowrap transition-[color,box-shadow]',
        variants[variant],
        className
      )}
      {...props}
    />
  )
}

export { Badge }