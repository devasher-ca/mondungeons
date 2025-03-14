import './globals.css'
import type { Metadata } from 'next'
import { Inter, Press_Start_2P } from 'next/font/google'
import BackgroundMouse from './components/BackgroundMouse'
import BackgroundMusic from './components/BackgroundMusic'

import { Web3Provider } from '@/providers/Web3Provider'
import { MusicSettingsProvider } from '@/providers/MusicSettingsProvider'

import { Toaster } from '@/components/ui/toaster'

const inter = Inter({ subsets: ['latin'] })
const pixelFont = Press_Start_2P({
  weight: '400',
  subsets: ['latin'],
  variable: '--font-pixel',
})

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
      <body className={`${inter.className} ${pixelFont.variable}`}>
        <Web3Provider>
          <MusicSettingsProvider>
            {children}
            <BackgroundMouse />
            <BackgroundMusic />
            <Toaster />
          </MusicSettingsProvider>
        </Web3Provider>
      </body>
    </html>
  )
}
