import { ChakraProvider, extendTheme, Flex } from '@chakra-ui/react'
import type { AppProps } from 'next/app'
import { useRouter } from 'next/router'
import { Sidebar } from '../components/Sidebar'
import { TopBar } from '../components/TopBar'
import { AppProvider } from '../contexts/AppProvider'

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
  )
}
