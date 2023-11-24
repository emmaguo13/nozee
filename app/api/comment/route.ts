import { randomUUID } from "crypto"
import { NextResponse } from "next/server"
import { Post } from "@/types"
import { ec as EC } from "elliptic"
import * as admin from "firebase-admin"

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

export async function comment(
  postId: string,
  pubkey: string,
  domain: string,
  comment: string
) {
  const postRef = db.collection("posts").doc(postId)
  const post = (await postRef.get()).data() as Post
  var comments = post.comments

  const newComment = {
    comment,
    domain,
    pubkey,
    timestamp: Date.now(),
    upvotes: [],
    id: randomUUID(),
  }
  if (!comments) {
    comments = []
  }
  const newComments = [...comments, newComment]
  await postRef.update({ comments: newComments })
}

export async function POST(request: Request) {
  // request: { pubkey: string, signature: string, postId: string, comment: string }
  const req = await request.json()

  // signature is of the post id
  const ec = new EC("secp256k1")
  const hexMsg = Buffer.from(req.postId, "utf8").toString("hex")

  const { isValid, domain } = await fetch(
    process.env.NEXT_PUBLIC_BASE_URL + "/api/verifySig",
    {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        pubkey: req.pubkey,
        signature: req.signature,
        msgHash: hexMsg,
      }),
    }
  ).then((res) => res.json())

  if (!isValid) {
    return NextResponse.json(
      { error: "Signature not verified" },
      { status: 500 }
    )
  }

  try {
    await comment(req.postId, req.pubkey, domain, req.comment)
    return NextResponse.json({ status: 200 })
  } catch (error) {
    return NextResponse.json({ error }, { status: 500 })
  }
}
