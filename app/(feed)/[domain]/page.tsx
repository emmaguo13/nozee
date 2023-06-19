import { Post } from "@/types"

import { PostCard } from "@/components/post-card"

export default async function Page({
  params: { domain },
}: {
  params: { domain: string }
}) {
  const posts = await fetch(
    process.env.NEXT_PUBLIC_BASE_URL + "/api/filtered-posts",
    {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({ domain }),
    }
  ).then((res) => res.json())
  return (
    <>
      {posts.map((post: Post) => (
        <PostCard post={post} key={post.id} />
      ))}
    </>
  )
}
