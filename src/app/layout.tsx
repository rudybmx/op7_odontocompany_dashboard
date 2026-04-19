import type { Metadata } from 'next'
import { Plus_Jakarta_Sans } from 'next/font/google'
import { ProvedorTema } from '@/components/provedores/provedor-tema'
import { TooltipProvider } from '@/components/ui/tooltip'
import './globals.css'

const plusJakartaSans = Plus_Jakarta_Sans({
  subsets: ['latin'],
  variable: '--font-plus-jakarta-sans',
})

export const metadata: Metadata = {
  title: "Wer'Sun Plataforma",
  description: "Shell da plataforma Wer'Sun",
}

export default function RootLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <html
      lang="pt-BR"
      suppressHydrationWarning
      className={`${plusJakartaSans.variable} h-full`}
    >
      <body suppressHydrationWarning className="min-h-full">
        <ProvedorTema>
          <TooltipProvider>
            {children}
          </TooltipProvider>
        </ProvedorTema>
      </body>
    </html>
  )
}
