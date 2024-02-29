import { randomUUID } from "crypto"
import { NextResponse } from "next/server"
import { Post } from "@/types"
import * as Client from '@web3-storage/w3up-client'
import { StoreMemory } from '@web3-storage/w3up-client/stores/memory'
import { importDAG } from '@ucanto/core/delegation'
import { CarReader } from '@ipld/car'
import * as Signer from '@ucanto/principal/ed25519'

// import { File } from 'fetch-blob/file.js'


import db from "@/lib/firebase"


/** @param {string} data Base64 encoded CAR file */
async function parseProof (data: string) {
  const blocks = []
  const reader = await CarReader.fromBytes(Buffer.from(data, 'base64'))
  for await (const block of reader.blocks()) {
    blocks.push(block)
  }
  return importDAG(blocks as any)
}

async function makeStorageClient() {
  // return new Web3Storage({ token: getAccessToken() as string })
    // Load client with specific private key
    const principal = Signer.parse(process.env.WEB3_STORAGE_KEY as string)
    const store = new StoreMemory()
    const client = await Client.create({ principal, store })
    return client
}

async function web3storeFiles(file: Blob) {
  const client = await makeStorageClient()
  // Add proof that this agent has been delegated capabilities on the space
  const proof = await parseProof(process.env.WEB3_STORAGE_PROOF as string)
  const space = await client.addSpace(proof)
  await client.setCurrentSpace(space.did())

  const cid = await client.uploadFile(file)

  console.log("Stored files in web3.storage with cid:", cid.toString())
  return cid.toString()
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

  // NOTE: this is for editing, unused
  if (id != "") {
    // verify that their pubkey is the same as the pubkey from the post
    const postRef = db.collection("posts").doc(post.id)
    const doc = await postRef.get()
    if (doc.exists) {
      const postPubkey = (doc.data() as Post).pubkey
      if (postPubkey != pubkey) {
        throw new Error("Public key doesn't match")
      }
    } else {
      throw new Error("Post not found")
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
  const file = new Blob([buffer])

  const cid = await web3storeFiles(file)

  const submit = { ...post, cid }

  return db
    .collection("posts")
    .doc(post.id)
    .set(submit)
    .then((docRef) => {
      return { docRef, cid}
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
    return NextResponse.json({ error: "Invalid signature in write" }, { status: 500 })
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
    return NextResponse.json({ error }, { status: 500 })
  }
}
