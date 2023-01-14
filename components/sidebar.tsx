import { Box, Button, Container, Flex, keyframes, useDisclosure, Image } from '@chakra-ui/react'
import { Karla, Silkscreen } from '@next/font/google'
import { useRouter } from 'next/router'
import { useEffect, useState } from 'react'
import Create from '../pages/create'
import { getPosts } from '../pages/firebase'
import Sound from 'react-sound'

const font = Silkscreen({ subsets: ['latin'], weight: '400' })
const bodyFont = Karla({ subsets: ['latin'], weight: '400' })

export const Sidebar = () => {
  const { isOpen, onOpen, onClose } = useDisclosure()
  const router = useRouter()
  const [domains, setDomains] = useState([])
  const [isPlaying, setIsPlaying] = useState(false)

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
    <Flex p="4" direction={'column'} alignItems='center'>
      <>
      <Create isOpen={isOpen} onClose={onClose} />
      <Container
        as={Flex}
        centerContent
        maxH="400"
        height="350"
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
      </>
      <>
      <Container 
      as={Flex}
      centerContent
      maxH="400"
      bg="#1E1E38"
      borderRadius="10"
      w="200px"
      p={4}
      gap="2"
      color="white"
      className={font.className}
      position="fixed"
      marginLeft= "-200px"
      marginTop={'366px'}
      /*half the width*/>
        <Button 
        width='100%'
        backgroundColor={'#644CFB'}
        onClick={() => setIsPlaying(!isPlaying)}> 
        {isPlaying ? 'Stop' : 'Play no-fi'}</Button>
      <Sound 
        url={'https://www.dropbox.com/s/0xf3visaht4e8l6/lofi.mp3?raw=1'}
        playStatus={isPlaying ? 'PLAYING' : 'STOPPED'}/>

    <Image    
      borderRadius='12'
      marginTop='2'
      width='100%'
      src='https://i.imgur.com/njB8Qmx.png'
      alt='lofi raccoon'/>
    </Container>



    </>
    </Flex>
  )
}
