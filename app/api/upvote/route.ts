import { NextResponse } from "next/server"
import { Post } from "@/types"

import db from "@/app/lib/firebase"

export async function upvotePost(
  postId: string,
  pubkey: string,
  commentId: string
) {
  const postRef = db.collection("posts").doc(postId)
  const post = (await postRef.get()).data() as Post

  var newUpvotes = [] as string[]

  if (!post) {
    throw Error("Post not found")
  }

  if (commentId != "") {
    var comments = post.comments
    var comment = comments.find((c) => c.id == commentId)

    if (!comment) {
      throw Error("Comment not found")
    }
    var upvotes = comment.upvotes

    if (!upvotes) {
      upvotes = []
    }

    // remove upvote
    if (upvotes.includes(pubkey)) {
      newUpvotes = upvotes.filter((u) => u != pubkey)
    } else {
      newUpvotes = [...upvotes, pubkey]
    }
    comment = { ...comment, upvotes: newUpvotes }
    const newComments = comments.map((c) => (c.id == commentId ? comment : c))
    await postRef.update({ comments: newComments })
    return
  }

  var upvotes = post.upvotes

  if (!upvotes) {
    upvotes = []
  }

  if (upvotes.includes(pubkey)) {
    newUpvotes = upvotes.filter((u) => u != pubkey)
  } else {
    newUpvotes = [...upvotes, pubkey]
  }

  await postRef.update({ upvotes: newUpvotes })
}

export async function POST(request: Request) {
  // request: { pubkey: string, signature: string, postId: string, commentId: string }
  const req = await request.json()

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
        msgHash: (req.commentId != "" ? req.commentId :req.postId),
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
    await upvotePost(req.postId, req.pubkey, req.commentId)
    return NextResponse.json({ status: 200 })
  } catch (error) {
    return NextResponse.json({ error }, { status: 501 })
  }
}
