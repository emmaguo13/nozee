import { NextResponse } from "next/server"

import db from "@/app/lib/firebase"
import { ecdsaVerify } from "@/app/lib/verifySig"

export async function POST(request: Request) {
  // request: { pubkey: string, signature: string, msgHash: string }
  const req = await request.json()

  try {
    const ref = db.collection("pubkeys")
    const query = ref.where("pubkey", "==", req.pubkey)
    const snapshot = await query.get()

    if (snapshot.empty) {
      throw new Error("No matching documents.")
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
        throw new Error("Invalid ECDSA signature")
      }
    } else {
      // todo: make it more clear when a jwt is expired!
      throw new Error("Expired")
    }

    // todo: make error handling better
  } catch (error) {
    return NextResponse.json({ error }, { status: 500 })
  }
}
