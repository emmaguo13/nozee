import { Post } from "@/types"
import * as admin from "firebase-admin"
import { App, cert, getApp, getApps, initializeApp } from "firebase-admin/app"
import { getFirestore } from "firebase-admin/firestore"

import { PostCard } from "@/components/post-card"

let app: App

let serviceAcc = {
  projectId: process.env.NEXT_PUBLIC_PROJECT_ID,
  clientEmail: process.env.FIREBASE_CLIENT_EMAIL,
  privateKey: (process.env.FIREBASE_PRIVATE_KEY as string).replace(
    /\\n/g,
    "\n"
  ),
}

if (getApps().length == 0) {
  app = initializeApp(
    {
      credential: cert(serviceAcc),
      projectId: process.env.NEXT_PUBLIC_PROJECT_ID,
    },
    "nozee"
  )
} else {
  app = getApp("nozee")
}

const db = getFirestore(app)

export default async function IndexPage() {
  const snapshot = await db
    .collection("posts")
    .orderBy("timestamp", "desc")
    .get()
  const posts = snapshot.docs.map((doc) => doc.data() as Post)
  return (
    <>
      {posts.map((post: Post) => (
        <PostCard post={post} key={post.id} />
      ))}
    </>
  )
}
