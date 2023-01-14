import { Container, Flex, Box, Button, Text, useToast, Tooltip } from '@chakra-ui/react'
import { useRouter } from 'next/router'
import { useEffect, useState } from 'react'
import { getPost, getPosts, getPostsFilterDomain } from '../firebase'
import { Karla, Silkscreen } from '@next/font/google'
import { useContract, useSigner } from 'wagmi'
import { abi } from '../../constants/abi'
import { ethers } from 'ethers'

const font = Silkscreen({ subsets: ['latin'], weight: '400' })
const bodyFont = Karla({ subsets: ['latin'], weight: '400' })  
type Post = {
  company: string,
  id: string,
  msg: string,
  pubkey: string,
  sig: string, 
  signature: string,
  title: string
}

const FullPost = () => {
  const router = useRouter()
  const [post, setPost] = useState<Post[]>([])
  const { pid } = router.query
  
  useEffect(() => {
    const fetchPost = async () => {
      console.log('id', pid)
      if (pid != undefined) {
        const res = await getPost(pid?.toString())
        //console.log('p', res)
        setPost(res as Post[])
      } else {
        const res = await getPosts()
        //console.log(res)
        setPost(res as Post[])
      }
    }
    fetchPost()
  }, [pid])

  // load in values 
  let signature, msg, company
  if (post[0] !== undefined) {
    signature = post[0].signature
    msg = post[0].msg
    company = post[0].company
  }
  const { data: signer } = useSigner()

  const blind = useContract({
    address: '0xAD6aab5161C5DC3f20210b2e4B4d01196737F1EF',
    abi,
    signerOrProvider: signer
  })
  const toast = useToast()
  const sig = signature ? ethers.utils.splitSignature(signature as any) : ""
  const signingAddr = msg ? ethers.utils.verifyMessage(msg, sig) : ""
  
  async function verifySig() {
    if (!blind || !signingAddr) return
    const domain = await blind.get(signingAddr as `0x${string}`)
    if (domain) {
      console.log('verified')
      toast({
        title: 'Message verified.',
        description: "We've verified the sender's signature for you",
        status: 'success',
        duration: 9000,
        isClosable: true
      })
    } else {
      console.log('not verified')
      toast({
        title: 'Message not verified.',
        description: 'This signer is not a valid poster.',
        status: 'error',
        duration: 9000,
        isClosable: true
      })
    }
    // verify that the signingaddr is the same as the addr we want
  }

  return (
    <>
       <Flex
        direction="column"
        backgroundColor="#1E1E38"
        alignItems="center"
        padding="8"
        marginTop="4"
        // paddingBottom="8"
        gap="4"
        borderRadius="10"
        minW="800px"
        maxW="800px"
        // maxH="190px"
        // _hover={{
        //   cursor: 'pointer',
        //   backgroundColor: '#262645',
        //   boxShadow:
        //     '0 4px 6px -1px rgb(0 0 0 / 0.1), 0 2px 4px -2px rgb(0 0 0 / 0.1)'
        // }}
      >
        <Flex justifyContent="space-between" w="100%">
          <Box
            backgroundColor="#4C82FB"
            className={font.className}
            borderRadius="4"
            px="3"
            style={{ textTransform: 'capitalize' }}
          >
            {company && company}
          </Box>
          <Tooltip placement='top' 
            openDelay={500}
            maxW={230}
            textAlign='center'
            label='Verify message was signed by authenticated user'>
          <Button onClick={verifySig} className={font.className} variant="link">
            Verify
          </Button>
          </Tooltip>
        </Flex>
        <Text
          alignContent="start"
          display="block"
          className={bodyFont.className}
          color="#F5F5F4"
          fontSize="16"
          overflow="hidden"
        >
          {msg && msg}
        </Text>
      </Flex>
    </>
  )
}

export default FullPost
