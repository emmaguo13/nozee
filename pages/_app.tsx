import { ChakraProvider, extendTheme, Flex } from '@chakra-ui/react'
import {
  darkTheme,
  getDefaultWallets,
  RainbowKitProvider
} from '@rainbow-me/rainbowkit'
import '@rainbow-me/rainbowkit/styles.css'
import localforage from 'localforage'
import type { AppProps } from 'next/app'
import { useRouter } from 'next/router'
import { useEffect } from 'react'
import { configureChains, createClient, goerli, WagmiConfig } from 'wagmi'
import { publicProvider } from 'wagmi/providers/public'
import { Footer } from '../components/footer'
import { Sidebar } from '../components/sidebar'

import '../styles/globals.css'
import { downloadFromFilename } from '../utils/utils'

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

export default function App({ Component, pageProps }: AppProps) {
  const { pathname } = useRouter()
  const theme = extendTheme({
    styles: {
      global: () => ({
        body: {
          bg: pathname === '/login' ? '#000000' : '#131322'
        }
      })
    }
  })
  useEffect(() => {
    const fetchZkey = async () => {
      const zkeyDb = await localforage.getItem('jwt_single-real.zkey')
      if (!zkeyDb) {
        await downloadFromFilename()
      }
      if (zkeyDb) {
        console.log('zkey already exists')
        return
      }
      //@ts-ignore
      if (zkeyDB && new Uint8Array(zkeyDb).byteLength !== 606835450) {
        console.log('Malformed zkey, clear application cache and reload')
      }
    }
    fetchZkey()
  }, [])

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
