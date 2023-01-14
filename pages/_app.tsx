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
import { publicProvider } from 'wagmi/providers/public'
import '../styles/globals.css'
import { Footer } from '../components/footer'
import { Sidebar } from '../components/sidebar'

const { chains, provider } = configureChains([goerli], [publicProvider()])

const { connectors } = getDefaultWallets({
  appName: 'zk blind',
  chains
})

const wagmiClient = createClient({
  autoConnect: true,
  connectors,
  provider
})

const theme = extendTheme({
  styles: {
    global: () => ({
      body: {
        bg: '#131322'
      }
    })
  }
})

export default function App({ Component, pageProps }: AppProps) {
  const { pathname } = useRouter()
  return (
    <WagmiConfig client={wagmiClient}>
      <RainbowKitProvider chains={chains} theme={darkTheme()}>
        <ChakraProvider theme={theme}>
          <Flex
            justifyContent="center"
            flexDirection="row"
            margin="0 auto"
            gap="4"
            padding="8"
          >
            {pathname !== '/login' && <Sidebar />}
            <Component {...pageProps} />
          </Flex>
        </ChakraProvider>
      </RainbowKitProvider>
      <Footer />
    </WagmiConfig>
  )
}
