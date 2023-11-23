import { NextResponse } from "next/server"
import * as admin from "firebase-admin"

import "firebase/firestore"

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

async function addPubKey(pubkey: string, domain: string, time: Date) {
  // Their firebase proof expiration is 2 weeks from when they last generated the proof.
  const new_time = new Date(time)
  new_time.setDate(new_time.getDate() + 14)

  const user = {
    pubkey,
    domain,
    exp: new_time.toISOString(),
  }

  const ref = db.collection("pubkeys")
  const query = ref.where("pubkey", "==", pubkey)
  const snapshot = await query.get()

  if (snapshot.empty) {
    db.collection("pubkeys")
      .add(user)
      .then((docRef) => {
        console.log("Document written with ID: ", docRef.id)
      })
      .catch((error) => {
        throw new Error(error)
      })
  } else {
    console.log("Pubkey already exists")
  }
}

export async function POST(request: Request) {
  const req = await request.json()
  const { isVerified, domain, time } = await fetch(
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
    await addPubKey(req.pubkey, domain, time)
    return NextResponse.json({ isVerified, domain }, { status: 200 })
  } catch (error) {
    return NextResponse.json({ error }, { status: 500 })
  }
}
