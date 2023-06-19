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

let app: App

let serviceAcc = {
  projectId: process.env.NEXT_PUBLIC_PROJECT_ID,
  clientEmail: process.env.FIREBASE_CLIENT_EMAIL,
  privateKey: ((process.env.FIREBASE_PRIVATE_KEY as string) || "").replace(
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
