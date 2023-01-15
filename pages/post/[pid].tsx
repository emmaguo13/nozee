import {
  Container,
  Flex,
  Box,
  Button,
  Text,
  useToast,
  Tooltip,
  Textarea,
  Input,
  InputGroup,
  InputRightElement
} from '@chakra-ui/react'
import { useRouter } from 'next/router'
import { useEffect, useState } from 'react'
import {
  getPost,
  getPosts,
  getPostsFilterDomain,
  updateComment
} from '../../utils/firebase'
import { Karla, Silkscreen } from '@next/font/google'
import { useContract, useSigner } from 'wagmi'
import { abi } from '../../constants/abi'
import { ethers } from 'ethers'

const font = Silkscreen({ subsets: ['latin'], weight: '400' })
const bodyFont = Karla({ subsets: ['latin'], weight: '400' })

export type Comment = {
  epoch: string
  comment: string
  company: string
}

type Post = {
  company: string
  id: string
  msg: string
  pubkey: string
  sig: string
  signature: string
  title: string
  comments: Comment[]
}

const FullPost = () => {
  const router = useRouter()
  const [post, setPost] = useState<Post[]>([])
  const [comment, setComment] = useState('')
  const [comments, setComments] = useState<Comment[]>([])
  const [signature, setSignature] = useState('')
  const [msg, setMsg] = useState('')
  const [company, setCompany] = useState('')
  const { pid } = router.query

  useEffect(() => {
    const fetchPost = async () => {
      console.log('id', pid)
      if (pid != undefined) {
        const res = await getPost(pid?.toString())
        console.log('p', res)
        setPost(res as Post[])
        // load in values
        if (post[0] !== undefined) {
          setSignature(post[0].signature)
          setMsg(post[0].msg)
          setCompany(post[0].company)
          setComments(post[0].comments)
        }
      } else {
        const res = await getPosts()
        //console.log(res)
        // setPost(res as Post[])
      }
    }
    fetchPost()
  }, [pid, post])

  // new comment
  async function handleNewComment(newComment: string) {
    // to implement
    if (!newComment || !pid) return
    const comment = {
      comment: newComment,
      company: '',
      epoch: Date.now().toString()
    }
    comments.push(comment)
    await updateComment(comments, pid.toString())
  }
  const { data: signer } = useSigner()

  const blind = useContract({
    address: '0xAD6aab5161C5DC3f20210b2e4B4d01196737F1EF',
    abi,
    signerOrProvider: signer
  })
  const toast = useToast()

  async function verifySig() {
    const sig = signature ? ethers.utils.splitSignature(signature as any) : ''
    const signingAddr = msg ? ethers.utils.verifyMessage(msg, sig) : ''
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
    <Flex direction="column" gap="4" pl="224px">
      <Flex
        direction="column"
        backgroundColor="#1E1E38"
        alignItems="center"
        padding="8"
        // paddingBottom="8"
        gap="4"
        borderRadius="10"
        minW="800px"
        maxW="800px"
      >
        <Flex justifyContent="space-between" w="100%">
          <Box
            backgroundColor="#4C82FB"
            className={font.className}
            borderRadius="4"
            px="3"
            style={{ textTransform: 'capitalize' }}
          >
            {company}
          </Box>
          <Tooltip
            placement="top"
            openDelay={500}
            maxW={230}
            textAlign="center"
            label="Verify message was signed by authenticated user"
          >
            <Button
              onClick={verifySig}
              className={font.className}
              variant="link"
            >
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
          lineHeight={1.5}
        >
          {msg}
        </Text>
      </Flex>
      <Flex
        padding="8"
        borderRadius="10"
        backgroundColor="#1E1E38"
        direction={'column'}
        gap="4"
        marginBottom="8"
        className={font.className}
      >
        Comments
        {comments?.map(c => (
          <Box key={c.epoch}>
            {c.comment}
            {c.company}
          </Box>
        ))}
        <InputGroup size="md">
          <Input
            className={bodyFont.className}
            variant="filled"
            placeholder="Add New Comment"
            value={comment}
            onChange={e => setComment(e.target.value)}
          />
          <InputRightElement width="4.5rem" marginRight={0.5}>
            <Button
              h="1.75rem"
              size="sm"
              onClick={() => handleNewComment(comment)}
            >
              {'Post'}
            </Button>
          </InputRightElement>
        </InputGroup>
      </Flex>
    </Flex>
  )
}

export default FullPost
