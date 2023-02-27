import { ChakraProvider, extendTheme, Flex } from '@chakra-ui/react'
import {
  darkTheme,
  getDefaultWallets,
  RainbowKitProvider
} from '@rainbow-me/rainbowkit'
import '@rainbow-me/rainbowkit/styles.css'
import type { AppProps } from 'next/app'
import { useRouter } from 'next/router'
import { configureChains, createClient, goerli, WagmiConfig } from 'wagmi'
import { alchemyProvider } from 'wagmi/providers/alchemy'
import { Sidebar } from '../components/Sidebar'
import { TopBar } from '../components/TopBar'
import { AppProvider } from '../contexts/AppProvider'

const { chains, provider } = configureChains(
  [goerli],
  [alchemyProvider({ apiKey: process.env.NEXT_PUBLIC_ALCHEMY_API as any })]
)

const { connectors } = getDefaultWallets({
  appName: 'nozee',
  chains
})

const wagmiClient = createClient({
  autoConnect: true,
  connectors,
  provider
})

export default function App({ Component, pageProps }: AppProps) {
  const { pathname } = useRouter()

  const theme = extendTheme({
    initialColorMode: 'dark',
    useSystemColorMode: false,
    styles: {
      global: () => ({
        body: {
          bg: '#131322'
        }
      })
    }
  })

  return (
    <WagmiConfig client={wagmiClient}>
      <RainbowKitProvider chains={chains} theme={darkTheme()}>
        <ChakraProvider theme={theme}>
          <AppProvider>
            <TopBar />
            <Flex
              maxWidth={pathname !== '/login' ? '1200px' : '100%'}
              margin="0 auto"
            >
              {pathname !== '/login' && <Sidebar />}
              <Component {...pageProps} />
            </Flex>
          </AppProvider>
        </ChakraProvider>
      </RainbowKitProvider>
    </WagmiConfig>
  )
}
