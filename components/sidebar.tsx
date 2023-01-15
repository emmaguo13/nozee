import { Button, Flex, Image, Text, useDisclosure } from '@chakra-ui/react'
import { Karla, Silkscreen } from '@next/font/google'
import { useRouter } from 'next/router'
import { useEffect, useState } from 'react'
import Sound from 'react-sound'
import { useAccount } from 'wagmi'
import Create from '../pages/create'
import { getPosts } from '../utils/firebase'

const font = Silkscreen({ subsets: ['latin'], weight: '400' })
const bodyFont = Karla({ subsets: ['latin'], weight: '400' })

export const Sidebar = () => {
  const { isOpen, onOpen, onClose } = useDisclosure()
  const router = useRouter()
  const [domains, setDomains] = useState([])
  const [isPlaying, setIsPlaying] = useState(false)
  const { address } = useAccount()

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

  const formattedAccount = address
    ? `${address.slice(0, 6)}...${address.slice(-4)}`
    : 'Connect Wallet'

  return (
    <>
      <Create isOpen={isOpen} onClose={onClose} />
      <Flex
        direction={'column'}
        gap="6"
        justifyContent="space-between"
        position="fixed"
        maxW="200px"
      >
        <Flex
          flexDirection="column"
          alignItems="flex-start"
          bg="#1E1E38"
          borderRadius="10"
          p={4}
          gap="4"
          color="white"
          className={bodyFont.className}
        >
          <Button
            backgroundColor="#4C82FB"
            onClick={() => router.push('/')}
            size="md"
            width="100%"
          >
            Home
          </Button>
          <Button
            width="100%"
            size="md"
            backgroundColor="#4C82FB"
            onClick={() => onOpen()}
          >
            New Post
          </Button>
          <Text>Address: {formattedAccount}</Text>
          Domains
          {domains.map((e, i) => {
            return (
              <Button
                size="sm"
                key={i}
                onClick={() =>
                  router.push({
                    pathname: '/',
                    query: { domain: e }
                  })
                }
                variant="link"
                style={{ textTransform: 'capitalize' }}
              >
                {e}
              </Button>
            )
          })}
        </Flex>
        <Flex
          direction="column"
          bg="#1E1E38"
          borderRadius="10"
          p={4}
          gap="2"
          color="white"
          className={font.className}
        >
          <Button
            backgroundColor={'#644CFB'}
            onClick={() => setIsPlaying(!isPlaying)}
          >
            {isPlaying ? 'Stop' : 'Play no-fi'}
          </Button>
          <Sound
            url={'https://www.dropbox.com/s/0xf3visaht4e8l6/lofi.mp3?raw=1'}
            playStatus={isPlaying ? 'PLAYING' : 'STOPPED'}
          />
          <Image
            borderRadius="12"
            marginTop="2"
            style={{ filter: !isPlaying ? 'grayscale(1)' : 'none' }}
            width="100%"
            src="https://i.imgur.com/njB8Qmx.png"
            alt="lofi raccoon"
          />
        </Flex>
      </Flex>
    </>
  )
}
