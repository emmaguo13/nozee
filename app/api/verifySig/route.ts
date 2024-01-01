import { NextResponse } from "next/server"

import db from "@/lib/firebase"
import { ecdsaVerify } from "@/lib/verifySig"

export async function POST(request: Request) {
  // request: { pubkey: string, signature: string, msgHash: string }
  const req = await request.json()

  try {
    const ref = db.collection("pubkeys")
    const query = ref.where("pubkey", "==", req.pubkey)
    const snapshot = await query.get()

    if (snapshot.empty) {
      throw new Error("User not found")
    }
    const res = snapshot.docs.map((doc) => doc.data())[0]
    const exp = new Date(res.exp)

    const current_time = new Date()

    // check expiration
    if (current_time.getTime() <= exp.getTime()) {
      // verify signature
      var isValidSignature = await ecdsaVerify(
        req.msgHash,
        req.signature,
        res.pubkey
      )

      if (isValidSignature) {
        return NextResponse.json(
          { isValid: true, domain: res.domain },
          { status: 200 }
        )
      } else {
        throw new Error("Invalid signature")
      }
    } else {
      throw new Error("Expired public key")
    }
  } catch (error) {
    return NextResponse.json({ error }, { status: 500 })
  }
}
