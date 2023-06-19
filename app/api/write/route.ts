import { randomUUID } from "crypto"
import { NextResponse } from "next/server"
import { Post } from "@/types"
import {
  App,
  ServiceAccount,
  cert,
  getApp,
  getApps,
  initializeApp,
} from "firebase-admin/app"
import { getFirestore } from "firebase-admin/firestore"
import { File, Web3Storage } from "web3.storage"

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
      credential: cert(serviceAcc as ServiceAccount),
      projectId: process.env.NEXT_PUBLIC_PROJECT_ID,
    },
    "nozee"
  )
} else {
  app = getApp("nozee")
}

const db = getFirestore(app)

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

async function createPost({ domain, body, title }: Post) {
  const post = {
    body,
    domain,
    title,
    id: randomUUID(),
    timestamp: Date.now(),
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
  const req = await request.json()
  const { isVerified, domain } = await fetch(
    process.env.NEXT_PUBLIC_BASE_URL + "/api/verify",
    {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        proof: req.proof,
        publicSignals: req.publicSignals,
      }),
    }
  ).then((res) => res.json())

  if (!isVerified) {
    return NextResponse.json({ error: "Proof not verified" }, { status: 500 })
  }

  try {
    const res = await createPost({
      title: req.title,
      domain,
      body: req.body,
      id: "",
      timestamp: "",
    })
    return NextResponse.json({ ...res, domain }, { status: 200 })
  } catch (error) {
    return NextResponse.json({ error }, { status: 500 })
  }
}
