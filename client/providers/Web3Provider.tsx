'use client'

import { WagmiProvider, createConfig, http } from 'wagmi'
import { mainnet } from 'wagmi/chains'
import { QueryClient, QueryClientProvider } from '@tanstack/react-query'
import { ConnectKitProvider, getDefaultConfig } from 'connectkit'

const config = createConfig(
  getDefaultConfig({
    chains: [mainnet],
    transports: {
      [mainnet.id]: http(
        `https://eth-mainnet.g.alchemy.com/v2/${process.env.NEXT_PUBLIC_ALCHEMY_ID}`,
      ),
    },

    walletConnectProjectId:
      process.env.NEXT_PUBLIC_WALLETCONNECT_PROJECT_ID || '',

    appName: 'Modungeons',

    appDescription: 'A Dungeons & Dragons inspired on-chain RPG built on Monad',
    appUrl: 'https://family.co',
    appIcon: '/favicon.ico',
  }),
)

const queryClient = new QueryClient()

export const Web3Provider = ({ children }: { children: React.ReactNode }) => {
  return (
    <WagmiProvider config={config}>
      <QueryClientProvider client={queryClient}>
        <ConnectKitProvider
          customTheme={{
            '--ck-connectbutton-color': 'rgb(252, 211, 77)',
            '--ck-connectbutton-background': 'rgba(127, 29, 29, 1)',
            '--ck-connectbutton-hover-background': 'rgba(153, 27, 27, 1)',
            '--ck-connectbutton-border-radius': '2px',
            '--ck-primary-button-color': 'rgb(252, 211, 77)',
            '--ck-primary-button-background': 'rgba(127, 29, 29, 1)',
            '--ck-primary-button-border-radius': '2px',
            '--ck-primary-button-hover-background': 'rgba(153, 27, 27, 1)',
            '--ck-body-background': 'rgba(127, 29, 29, 1)',
            '--ck-font-family': 'var(--font-pixel), cursive',
          }}
        >
          {children}
        </ConnectKitProvider>
      </QueryClientProvider>
    </WagmiProvider>
  )
}
