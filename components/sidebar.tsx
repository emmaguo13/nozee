import { Button, Container, Flex, useDisclosure } from '@chakra-ui/react'
import { Karla, Silkscreen } from '@next/font/google'
import { useRouter } from 'next/router'
import { useEffect, useState } from 'react'
import Create from '../pages/create'
import { getPosts } from '../pages/firebase'

const font = Silkscreen({ subsets: ['latin'], weight: '400' })
const bodyFont = Karla({ subsets: ['latin'], weight: '400' })
export const Sidebar = () => {
  const { isOpen, onOpen, onClose } = useDisclosure()
  const router = useRouter()
  const [domains, setDomains] = useState([])

  useEffect(() => {
    const fetchPosts = async () => {
      const res = await getPosts()
      const allDomains = res.map((post: any) => {
        return post.company
      })
      const uniqueDomains = allDomains.filter(
        (e: string, i: any) =>
          allDomains.findIndex((obj: any) => obj === e) === i
      )
      setDomains(uniqueDomains as [])
    }
    fetchPosts()
  }, [])

  return (
    <Flex p="4">
      <Create isOpen={isOpen} onClose={onClose} />
      <Container
        as={Flex}
        centerContent
        maxH="400"
        height="300"
        bg="#1E1E38"
        borderRadius="10"
        w="200px"
        p={4}
        gap="4"
        color="white"
        className={font.className}
        position="fixed"
        // left= "50%"
        marginLeft= "-200px" /*half the width*/
      >
        <Button
          backgroundColor="#4C82FB"
          w="100%"
          onClick={() => router.push('/')}
          size='md'
        >
          Home
        </Button>
        <Button size='md' backgroundColor="#4C82FB" w="100%" onClick={() => onOpen()}>
          New Post
        </Button>
        Domains
        {domains.map((e, i) => {
          return (
            <Button
              size='sm'
              key={i}
              onClick={() =>
                router.push({
                  pathname: '/',
                  query: { domain: e }
                })
              }
              variant="link"
            >
              {e}
            </Button>
          )
        })}
      </Container>
    </Flex>
  )
}
