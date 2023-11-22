import { NextResponse } from "next/server"
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

async function addPubKey(pubkey: string, domain:string) {
  const user = {
    pubkey, 
    domain
  }
  return db
    .collection("pubkeys")
    .add(user)
    .then((docRef) => {
      console.log("Document written with ID: ", docRef.id)
      return docRef.id
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
        key: req.key,
      }),
    }
  ).then((res) => res.json())

  if (!isVerified) {
    return NextResponse.json({ error: "Proof not verified" }, { status: 500 })
  }

  try {
    const res = await addPubKey(
      req.pubkey, 
      domain
    )
    // res = docRef.id
    return NextResponse.json({ isVerified, domain }, { status: 200 })
  } catch (error) {
    return NextResponse.json({ error }, { status: 500 })
  }
}