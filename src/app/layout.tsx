import type { Metadata, Viewport } from 'next'
import { Lora, Playfair_Display, Montserrat, Inter, Open_Sans } from 'next/font/google'
import './globals.css'
import 'katex/dist/katex.min.css'

const lora = Lora({ subsets: ['latin'], variable: '--font-lora' })
const playfair = Playfair_Display({ subsets: ['latin'], variable: '--font-playfair' })
const montserrat = Montserrat({ subsets: ['latin'], variable: '--font-montserrat' })
const inter = Inter({ subsets: ['latin'], variable: '--font-inter' })
const openSans = Open_Sans({ subsets: ['latin'], variable: '--font-open-sans' })

export const metadata: Metadata = {
  title: 'Questão Certeira Interativo',
  description:
    'Revisão interativa de Matemática por missões. Treino, foco e resultado.',
  icons: {
    icon: '/favicon.ico',
  },
}

export const viewport: Viewport = {
  width: 'device-width',
  initialScale: 1,
  themeColor: '#022648',
}

export default function RootLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <html lang="pt-BR" className={`${lora.variable} ${playfair.variable} ${montserrat.variable} ${inter.variable} ${openSans.variable}`}>
      <body className="min-h-screen bg-brand-bg-light font-sans">{children}</body>
    </html>
  )
}
