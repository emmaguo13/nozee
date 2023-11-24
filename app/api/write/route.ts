import { randomUUID } from "crypto"
import { NextResponse } from "next/server"
import { Post } from "@/types"
import * as admin from "firebase-admin"
import { File, Web3Storage } from "web3.storage"

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
  pubkey: string
) {
  const post = {
    body,
    domain,
    title,
    id: randomUUID(),
    timestamp: Date.now(),
    pubkey,
  }
  const buffer = Buffer.from(JSON.stringify(post))
  const files = [new File([buffer], "hello.json")]
  const cid = await web3storeFiles(files)
  return db
    .collection("posts")
    .doc(post.id)
    .set(post)
    .then((docRef) => {
      return { docRef, cid }
    })
    .catch((error) => {
      throw new Error(error)
    })
}

export async function POST(request: Request) {
  // request: { pubkey: string, signature: string, msgHash: string, title: string, body: string }
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
        msgHash: req.msgHash,
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
    const res = await createPost(req.title, domain, req.body, req.pubkey)
    return NextResponse.json({ ...res, domain }, { status: 200 })
  } catch (error) {
    return NextResponse.json({ error }, { status: 500 })
  }
}
