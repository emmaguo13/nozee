// NOTE: not used

import { NextResponse } from "next/server"
import { Post } from "@/types"

import db from "@/lib/firebase"

export async function POST(request: Request) {
  const req = await request.json()
  if (!req?.id) {
    return NextResponse.error()
  }
  const ref = db.collection("posts")
  const query = ref.where("id", "==", req.id)
  const snapshot = await query.get()

  // todo: handle when some post fields are missing
  return NextResponse.json(snapshot.docs.map((doc) => doc.data())[0] as Post)
}
