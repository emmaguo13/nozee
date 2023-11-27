import { NextResponse } from "next/server"
import { Proof } from "@/types"

import db from "@/lib/firebase"

// note: the proof is a json string
// todo: ^ clean this
async function addPubKey(
  pubkey: string,
  domain: string,
  time: string,
  proof: Proof,
  publicSignals: string[]
) {
  // Their firebase proof expiration is 2 weeks from when they last generated the proof.
  const new_time = new Date(time)
  new_time.setDate(new_time.getDate() + 14)

  const user = {
    pubkey,
    domain,
    exp: new_time.toISOString(),
    proof: JSON.stringify(proof),
    publicSignals,
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
  } else {
    console.log("Pubkey already exists")
    const res = snapshot.docs.map((doc) => doc.data())[0]
    const exp = new Date(res.exp)

    const current_time = new Date()

    // check if the proof is updated
    if (res.proof != JSON.stringify(proof)) {
      console.log("Proof updated")
      await db.collection("pubkeys").doc(snapshot.docs[0].id).update(user)
      return
    }

    // check expiration, if proof is not updated
    if (current_time.getTime() > exp.getTime()) {
      throw new Error("Expired public key")
    }
  }
}

export async function POST(request: Request) {
  const req = await request.json()
  console.log(req)
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
  ).then((response) => {
    const res = response.json() as any
    if (response.status != 200) {
      return NextResponse.json({ error: res.error }, { status: 500 })
    } else {
      console.log(res)
      return res
    }
  })

  console.log(isVerified, domain, time)

  console.log("made it past verify")
  if (!isVerified) {
    return NextResponse.json({ error: "Proof not verified" }, { status: 500 })
  }

  try {
    await addPubKey(req.pubkey, domain, time, req.proof, req.publicSignals)
    return NextResponse.json({ domain }, { status: 200 })
  } catch (error) {
    return NextResponse.json({ error }, { status: 500 })
  }
}
