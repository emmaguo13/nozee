import { randomUUID } from "crypto"
import { NextResponse } from "next/server"
import { Post } from "@/types"
import { File, Web3Storage } from "web3.storage"

import db from "@/lib/firebase"

function getAccessToken() {
  return process.env.WEB3_STORAGE_TOKEN
}

function makeStorageClient() {
  return new Web3Storage({ token: getAccessToken() as string })
}

async function web3storeFiles(files: File[]) {
  const client = makeStorageClient()
  const cid = await client.put(files)
  console.log("stored files with cid:", cid)
  return cid
}

async function createPost(
  title: string,
  domain: string,
  body: string,
  pubkey: string,
  id: string
) {
  var post = {
    body,
    domain,
    title,
    id: randomUUID(),
    timestamp: Date.now(),
    pubkey,
  }

  // check if we're editing or posting
  if (id != "") {
    // verify that their pubkey is the same as the pubkey from the post
    const postRef = db.collection("posts").doc(post.id)
    const doc = await postRef.get()
    if (doc.exists) {
      const postPubkey = (doc.data() as Post).pubkey
      if (postPubkey != pubkey) {
        throw new Error("pubkeys dont match")
      }
    } else {
      // todo: better error handling here
      throw new Error("no such post")
    }

    post = {
      body,
      domain,
      title,
      id: id,
      timestamp: Date.now(),
      pubkey,
    }
  }

  const buffer = Buffer.from(JSON.stringify(post))
  const files = [new File([buffer], "hello.json")]
  const cid = await web3storeFiles(files)

  const submit = { ...post, web3Id: cid }

  return db
    .collection("posts")
    .doc(post.id)
    .set(submit)
    .then((docRef) => {
      return { docRef, cid }
    })
    .catch((error) => {
      throw new Error(error)
    })
}

export async function POST(request: Request) {
  // request: { pubkey: string, signature: string, msgHash: string, title: string, body: string, id: string }
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
        msgHash: req.body,
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
    const res = await createPost(
      req.title,
      domain,
      req.body,
      req.pubkey,
      req.postId
    )
    return NextResponse.json({ ...res, domain }, { status: 200 })
  } catch (error) {
    return NextResponse.json({ error }, { status: 501 })
  }
}
