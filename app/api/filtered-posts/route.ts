import { NextResponse } from "next/server"
import { Post } from "@/types"
import { App, cert, getApp, getApps, initializeApp } from "firebase-admin/app"
import { getFirestore } from "firebase-admin/firestore"

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
      credential: cert(serviceAcc),
      projectId: process.env.NEXT_PUBLIC_PROJECT_ID,
    },
    "nozee"
  )
} else {
  app = getApp("nozee")
}

const db = getFirestore(app)

export async function POST(request: Request) {
  const body = await request.json()
  const snapshot = await db
    .collection("posts")
    .where("domain", "==", body.domain)
    .orderBy("timestamp", "desc")
    .get()
  return NextResponse.json(snapshot.docs.map((doc) => doc.data() as Post))
}
