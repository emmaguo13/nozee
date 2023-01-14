import { Container, Flex, Box, Button, Text, useToast, Tooltip, Textarea, Input, InputGroup, InputRightElement } from '@chakra-ui/react'
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
  const [comment, setComment] = useState('')
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

  // new comment
  async function handleNewComment() {
    // to implement
  }

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
    <Flex direction='column' gap='4'>
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
      <Flex 
      padding='8'
      borderRadius="10"
      backgroundColor='#1E1E38'
      direction={'column'}
      gap='4'
      marginBottom='8'
      className={font.className}
      >
        Comments
        <InputGroup size='md'>
        <Input className={bodyFont.className} variant='filled'
          placeholder='Add New Comment'
          value={comment}
          onChange={e => setComment(e.target.value)}
          />
        <InputRightElement width='4.5rem' marginRight={0.5}>
        <Button h='1.75rem' size='sm' onClick={handleNewComment}>
          {'Post'}
        </Button>
      </InputRightElement>
        </InputGroup>
      
      </Flex>

    </Flex>
  )
}

export default FullPost
