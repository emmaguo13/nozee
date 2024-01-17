import { NextResponse } from "next/server"
import db from "@/lib/firebase"

// Function to add a postId to the "reported" collection
async function reportPost(postId: string) {
  const reportedRef = db.collection("reported").doc("allReports")
  const doc = await reportedRef.get()
  let reportedPosts = []

  if (doc.exists) {
    reportedPosts = doc.data()?.reportedPosts || []
  }

  // Append postId if it's not already in the array
  if (!reportedPosts.includes(postId)) {
    reportedPosts.push(postId)
  }

  await reportedRef.set({ reportedPosts }, { merge: true })
}

export async function POST(request: Request) {
  const req = await request.json()

  try {
    await reportPost(req.postId)
    return NextResponse.json({ status: 200 })
  } catch (error) {
    return NextResponse.json({ error }, { status: 500 })
  }
}
