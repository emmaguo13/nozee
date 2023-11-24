import { Post } from "@/types"
import * as admin from "firebase-admin"

import { PostWrapper } from "@/components/post-wrapper"

if (!admin.apps.length) {
  admin.initializeApp({
    credential: admin.credential.cert({
      projectId: process.env.NEXT_PUBLIC_PROJECT_ID,
      clientEmail: process.env.FIREBASE_CLIENT_EMAIL,
      privateKey: process.env.FIREBASE_PRIVATE_KEY!.replace(/\\n/g, "\n"),
    }),
  })
}

const db = admin.firestore()

export default async function IndexPage() {
  const snapshot = await db
    .collection("posts")
    .orderBy("timestamp", "desc")
    .get()
  const posts = snapshot.docs.map((doc) => doc.data() as Post)
  return (
    <>
      {posts.map((post: Post) => (
        <PostWrapper post={post} key={post.id} />
      ))}
    </>
  )
}

export const revalidate = 0
