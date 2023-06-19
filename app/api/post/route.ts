import { NextResponse } from "next/server"
import { Post } from "@/types"
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

export async function POST(request: Request) {
  const req = await request.json()
  if (!req?.id) {
    return NextResponse.error()
  }
  const ref = db.collection("posts")
  const query = ref.where("id", "==", req.id)
  const snapshot = await query.get()

  return NextResponse.json(snapshot.docs.map((doc) => doc.data())[0] as Post)
}
