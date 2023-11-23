import { NextResponse } from "next/server"
import * as admin from "firebase-admin"
import { ec as EC } from 'elliptic';

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

  try {
    const ref = db.collection("pubkeys")
    const query = ref.where("pubkey", "==", req.pubkey)
    const snapshot = await query.get()
    
    if (snapshot.empty) {
        throw new Error("No matching documents.")
    }
    const res = snapshot.docs.map((doc) => doc.data())[0]
    const exp = res.exp.toDate().getTime()
    const publicKey = res.pubkey

    const current_time = new Date().getTime()

    if (current_time > exp) {
        
    }

    // check expiration
    console.log(publicKey)

    // todo: make error handling better

    // verify signature
    var ec = new EC('secp256k1');

    var signatureDER = new Buffer(req.signature, 'hex');
    var isValidSignature = ec.verify(req.msgHash, signatureDER, publicKey, 'hex');

    if (isValidSignature) {
        return NextResponse.json(true, { status: 200 })
    } else {
        throw new Error("Invalid ECDSA signature")
    }

  } catch (error) {
    return NextResponse.json({ error }, { status: 500 })
  }
}