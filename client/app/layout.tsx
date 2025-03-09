import './globals.css'
import type { Metadata } from 'next'
import { Inter } from 'next/font/google'
import BackgroundMouse from './components/BackgroundMouse'

const inter = Inter({ subsets: ['latin'] })

export const metadata: Metadata = {
  title: 'Modungeons',
  description: 'A Dungeons & Dragons inspired on-chain RPG built on Monad',
}

export default function RootLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <html lang="en">
      <body className={inter.className}>
        {children}
        <BackgroundMouse />
      </body>
    </html>
  )
}
