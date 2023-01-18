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
import { Footer } from '../components/footer'
import { Sidebar } from '../components/sidebar'

import { alchemyProvider } from 'wagmi/providers/alchemy'
import { AppProvider } from '../contexts/AppProvider'
import '../styles/globals.css'

const { chains, provider } = configureChains(
  [goerli],
  [alchemyProvider({ apiKey: process.env.NEXT_PUBLIC_ALCHEMY_API as any })]
)

const { connectors } = getDefaultWallets({
  appName: 'zk blind',
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
            <Footer />
            <Flex
              position="absolute"
              bottom="0"
              // top="56px"
              top="0"
              left="0"
              right="0"
              // justifyContent="center"
              // flexDirection="row"
              // margin="0 auto"
              // gap="4"
              // padding="8"
              // maxWidth="1200px"
              // margin="0 auto"
              // position="relative"
            >
              {/* <Flex position="relative"> */}
              {pathname !== '/login' && <Sidebar />}
              <Component {...pageProps} />
              {/* </Flex> */}
            </Flex>
          </AppProvider>
        </ChakraProvider>
      </RainbowKitProvider>
    </WagmiConfig>
  )
}
