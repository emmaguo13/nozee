import { NextResponse } from "next/server"
import { ec as EC } from "elliptic"
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
  // request: { pubkey: string, signature: string, msgHash: string }
  const req = await request.json()

  try {
    var ec = new EC("secp256k1")
    const ref = db.collection("pubkeys")
    const query = ref.where("pubkey", "==", req.pubkey)
    const snapshot = await query.get()

    if (snapshot.empty) {
      throw new Error("No matching documents.")
    }
    const res = snapshot.docs.map((doc) => doc.data())[0]
    const exp = new Date(res.exp)
    const publicKey = ec.keyFromPublic(res.pubkey, "hex")

    const current_time = new Date()

    // check expiration
    if (current_time.getTime() <= exp.getTime()) {
      // verify signature
      // todo: i feel like i won't need this hex conversion of signature
      var signatureDER = new Buffer(req.signature, "hex")

      var isValidSignature = ec.verify(
        req.msgHash,
        signatureDER,
        publicKey,
        "hex"
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
