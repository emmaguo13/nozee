import { Flex } from '@chakra-ui/react'
import Head from 'next/head'
import { useRouter } from 'next/router'
import { useEffect, useMemo, useState } from 'react'
import PostCard from '../components/Post'
import { Post } from '../types'
import { getPosts, getPostsFilterDomain } from '../utils/firebase'

const Home = () => {
  const router = useRouter()
  const [posts, setPosts] = useState<Post[]>([])

  useEffect(() => {
    const fetchPosts = async () => {
      if (router.query.domain != undefined) {
        const res = await getPostsFilterDomain(router.query.domain as string)
        setPosts(res)
      } else {
        const res = await getPosts()
        setPosts(res)
      }
    }
    fetchPosts()
  }, [router.query.domain])

  const showPosts = useMemo(() => {
    const p = [...posts]
    // p.reverse()
    return p
  }, [posts])
  console.log('🚀 ~ Home ~ showPosts', showPosts)

  return (
    <>
      <Head>
        <title>nozee</title>
        <meta name="description" content="Generated by create next app" />
        <meta name="viewport" content="width=device-width, initial-scale=1" />
        <link rel="icon" href="/favicon.ico" />
      </Head>
      <Flex direction="column" pl="224px" gap="6" my="56px">
        {showPosts.map(p => (
          <PostCard
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
