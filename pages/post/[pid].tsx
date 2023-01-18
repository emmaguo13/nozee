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
import PostCard from '../../components/PostCard'
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
  const { id, message, signature, company } = preloadedPost

  return (
    <Flex as="main" direction="column" gap="6" pl="224px" mt="56px" w="100%">
      <PostCard
        id={id}
        message={message}
        signature={signature}
        company={company}
      />
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
