import {
  Box,
  Button,
  Flex,
  Input,
  InputGroup,
  InputRightElement,
  Text,
  Tooltip
} from '@chakra-ui/react'
import { Karla, Silkscreen } from '@next/font/google'
import { GetStaticPaths, GetStaticProps, InferGetStaticPropsType } from 'next'
import { useRouter } from 'next/router'
import { useState } from 'react'
import useVerify from '../../hooks/useVerify'
import { Post } from '../../types'
import { getPost, getPosts, updateComment } from '../../utils/firebase'

const font = Silkscreen({ subsets: ['latin'], weight: '400' })
const bodyFont = Karla({ subsets: ['latin'], weight: '400' })

export type Comment = {
  epoch: string
  comment: string
  company: string
}

const FullPost = ({
  preloadedPost
}: InferGetStaticPropsType<typeof getStaticProps>) => {
  const router = useRouter()
  const [post, setPost] = useState<Post>(preloadedPost)
  const [comment, setComment] = useState('')
  const [comments, setComments] = useState<Comment[]>([])
  const { pid } = router.query

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
  const handleVerify = useVerify(post?.message, post?.signature)

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
            {preloadedPost.company}
          </Box>
          <Tooltip
            placement="top"
            openDelay={500}
            maxW={230}
            textAlign="center"
            label="Verify message was signed by authenticated user"
          >
            <Button
              onClick={handleVerify}
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
          {preloadedPost.message}
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

export const getStaticPaths: GetStaticPaths = async () => {
  const res = await getPosts()

  return {
    paths: res.map(post => ({
      params: { pid: post.id }
    })),
    fallback: false
  }
}

export const getStaticProps: GetStaticProps<{
  preloadedPost: Post
}> = async ({ params }) => {
  const res = await getPost(params?.pid ? params.pid.toString() : '')

  return { props: { preloadedPost: res } }
}

export default FullPost
