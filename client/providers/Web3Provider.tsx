'use client'

import { WagmiProvider, createConfig, http } from 'wagmi'
import { monadTestnet } from 'wagmi/chains'
import { QueryClient, QueryClientProvider } from '@tanstack/react-query'
import { ConnectKitProvider, getDefaultConfig } from 'connectkit'
import { CharacterProvider } from './CharacterProvider'

// Define the target chain for easy reference
export const targetChain = monadTestnet

const config = createConfig(
  getDefaultConfig({
    chains: [monadTestnet],
    transports: {
      [monadTestnet.id]: http(`https://testnet-rpc.monad.xyz`),
    },

    walletConnectProjectId:
      process.env.NEXT_PUBLIC_WALLETCONNECT_PROJECT_ID || '',

    appName: 'Modungeons',

    appDescription: 'A Dungeons & Dragons inspired on-chain RPG built on Monad',
    appUrl: 'https://mondungeons.xyz',
    appIcon: '/favicon.ico',
  }),
)

// Create a client with default options
const queryClient = new QueryClient({
  defaultOptions: {
    queries: {
      staleTime: 60 * 1000, // 1 minute
      refetchOnWindowFocus: false,
    },
  },
})

export const Web3Provider = ({ children }: { children: React.ReactNode }) => {
  return (
    <WagmiProvider config={config}>
      <QueryClientProvider client={queryClient}>
        <ConnectKitProvider
          // Configure ConnectKit to enforce the correct chain
          options={{
            // This will show a warning when on the wrong chain
            enforceSupportedChains: true,
            // This will automatically try to switch to the correct chain
            initialChainId: targetChain.id,
          }}
          customTheme={{
            '--ck-connectbutton-color': 'rgb(252, 211, 77)',
            '--ck-connectbutton-background': 'rgba(127, 29, 29, 1)',
            '--ck-connectbutton-hover-background': 'rgba(153, 27, 27, 1)',
            '--ck-connectbutton-border-radius': '2px',
            '--ck-primary-button-color': 'rgb(252, 211, 77)',
            '--ck-primary-button-background': 'rgba(127, 29, 29, 1)',
            '--ck-primary-button-border-radius': '2px',
            '--ck-primary-button-hover-background': 'rgba(153, 27, 27, 1)',
            '--ck-font-family': 'var(--font-pixel), cursive',
            '--ck-border-radius': 8,
            '--ck-body-background': 'rgba(127, 29, 29, 0.8)',
            '--ck-body-background-transparent': 'rgba(127, 29, 29, 0.8)',
          }}
        >
          <CharacterProvider>{children}</CharacterProvider>
        </ConnectKitProvider>
      </QueryClientProvider>
    </WagmiProvider>
  )
}
