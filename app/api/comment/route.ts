import { randomUUID } from "crypto"
import { NextResponse } from "next/server"
import { Post } from "@/types"

import db from "@/lib/firebase"

export async function comment(
  postId: string,
  pubkey: string,
  domain: string,
  comment: string,
  id: string
) {
  const postRef = db.collection("posts").doc(postId)
  const post = (await postRef.get()).data() as Post
  var comments = post.comments

  if (!comments) {
    comments = []
  }

  var newComment = {
    comment,
    domain,
    pubkey,
    timestamp: Date.now(),
    upvotes: [] as string[],
    id: randomUUID(),
  }

  // todo: clean, make edits work eventually
  if (id != "" && comments.length != 0) {
    const matchingComment = comments.find((comment) => comment.id === id)
    if (!matchingComment) {
      throw Error("Comment not found")
    }

    if (matchingComment.pubkey != pubkey) {
      throw Error("Pubkey doesn't match")
    }

    newComment = {
      comment,
      domain,
      pubkey,
      timestamp: Date.now(),
      id: matchingComment.id,
      upvotes: matchingComment.upvotes,
    }
  }

  const newComments = [...comments, newComment]
  await postRef.set({ comments: newComments }, { merge: true })
}

export async function POST(request: Request) {
  // request: { pubkey: string, signature: string, postId: string, comment: string }
  const req = await request.json()

  // signature is of the post id
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
        msgHash: req.postId,
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
    await comment(req.postId, req.pubkey, domain, req.comment, req.id)
    return NextResponse.json({ status: 200 })
  } catch (error) {
    return NextResponse.json({ error }, { status: 500 })
  }
}
