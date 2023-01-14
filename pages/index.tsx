//@ts-nocheck
import { Container, Flex } from '@chakra-ui/react'
import { useRouter } from 'next/router'
import { useEffect, useState } from 'react'
import Post from '../components/Post'
import { getPosts, getPostsFilterDomain } from './firebase'

const Home = () => {
  const router = useRouter()
  const [posts, setPosts] = useState([])

  useEffect(() => {
    const fetchPosts = async () => {
      if (router.query.domain != undefined) {
        const res = await getPostsFilterDomain(router.query.domain)
        setPosts(res as any)
      } else {
        const res = await getPosts()
        setPosts(res as any)
      }
    }
    fetchPosts()
  }, [router.query.domain])

  return (
    <>
      <Container
        as={Flex}
        centerContent
        gap="4"
        padding="4"
        justifyContent="center"
        minH="100vh"
        margin="0"
        minW="800px"
        maxW="800px"
      >
        {posts.map(p => (
          <Post
            key={p.id}
            k={p.id}
            msg={p.msg}
            signature={p.signature}
            company={p.company}
          />
        ))}
      </Container>
    </>
  )
}

export default Home
