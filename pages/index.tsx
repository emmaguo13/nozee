//@ts-nocheck
import { Container, Flex } from '@chakra-ui/react'
import { useRouter } from 'next/router'
import { useEffect, useMemo, useState } from 'react'
import Post from '../components/Post'
import { getPosts, getPostsFilterDomain } from '../utils/firebase'

const Home = () => {
  const router = useRouter()
  const [posts, setPosts] = useState([])
  console.log('🚀 ~ Home ~ posts', posts)

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

  const showPosts = useMemo(() => {
    const p = [...posts]
    p.reverse()
    return p
  }, [posts])
  console.log('🚀 ~ Home ~ showPosts', showPosts)

  return (
    <>
      <Flex
        direction="column"
        pl="224px"
        gap="6"
        // padding="0 4"
        // justifyContent="center"
        // minH="100vh"
        // margin="0"
        // minW="800px"
        // maxW="800px"
      >
        {showPosts.map(p => (
          <Post
            key={p.id}
            k={p.id}
            msg={p.msg}
            signature={p.signature}
            company={p.company}
          />
        ))}
      </Flex>
    </>
  )
}

export default Home
