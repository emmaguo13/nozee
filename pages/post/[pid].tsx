import {
  Box,
  Button,
  Flex,
  Input,
  InputGroup,
  InputRightElement,
  Text,
  Tooltip,
  useToast
} from '@chakra-ui/react'
import { Karla, Silkscreen } from '@next/font/google'
import { ethers } from 'ethers'
import { useRouter } from 'next/router'
import { useEffect, useState } from 'react'
import { useContract, useSigner } from 'wagmi'
import { abi } from '../../constants/abi'
import { Post } from '../../types'
import { getPost, updateComment } from '../../utils/firebase'

const font = Silkscreen({ subsets: ['latin'], weight: '400' })
const bodyFont = Karla({ subsets: ['latin'], weight: '400' })

export type Comment = {
  epoch: string
  comment: string
  company: string
}

const FullPost = () => {
  const router = useRouter()
  const [post, setPost] = useState<Post>()
  const [comment, setComment] = useState('')
  const [comments, setComments] = useState<Comment[]>([])
  const { pid } = router.query

  useEffect(() => {
    if (post) return
    const fetchPost = async () => {
      if (pid) {
        const res = await getPost(pid.toString())
        setPost(res)
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
    if (!blind || !post) return
    const { message, signature } = post
    const sig = ethers.utils.splitSignature(signature)
    const signingAddr = ethers.utils.verifyMessage(message, sig)
    const domain = await blind.get(signingAddr as `0x${string}`)
    if (domain) {
      toast({
        title: 'Message verified.',
        description: "We've verified the sender's signature for you",
        status: 'success',
        duration: 9000,
        isClosable: true
      })
    } else {
      toast({
        title: 'Message not verified.',
        description: 'This signer is not a valid poster.',
        status: 'error',
        duration: 9000,
        isClosable: true
      })
    }
  }

  if (!post?.company) {
    console.log('no post')
    return null
  }

  return (
    <Flex as="main" direction="column" gap="6" pl="224px" mt="56px" w="100%">
      <Flex
        direction="column"
        backgroundColor="#1E1E38"
        alignItems="flex-start"
        padding="8"
        gap="4"
        borderRadius="10"
      >
        <Flex justifyContent="space-between" w="100%">
          <Box
            backgroundColor="#4C82FB"
            className={font.className}
            borderRadius="4"
            px="3"
            style={{ textTransform: 'capitalize' }}
          >
            {post.company}
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
          textAlign="left"
          display="block"
          className={bodyFont.className}
          color="#F5F5F4"
          fontSize="18px"
          lineHeight={1.5}
        >
          {post.message}
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
