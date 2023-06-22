import { NextResponse } from "next/server"
import { vkey } from "@/constants"

import { verifyPublicKey } from "@/lib/verifyPublicKey"

const snarkjs = require("snarkjs")

export async function POST(request: Request) {
  console.time("Verification time")
  const req = await request.json()
  const isVerified = await snarkjs.groth16.verify(
    vkey,
    req.publicSignals,
    req.proof
  )
  if (!isVerified) {
    return NextResponse.json({ error: "Proof not verified" })
  }

  // if (!verifyPublicKey(req.publicSignals, req.key || "openai")) {
  //   return NextResponse.json({ error: "Public key not verified" })
  // }

  // const timestamp = parseInt(req.publicSignals[47])
  // console.log(
  //   "🚀 ~ file: route.ts:23 ~ POST ~ timestamp:",
  //   new Date(timestamp * 1000).toLocaleString()
  // )
  // const current_timestamp = Math.round(new Date().getTime() / 1000)
  // console.log(
  //   "🚀 ~ file: route.ts:25 ~ POST ~ current_timestamp:",
  //   new Date(current_timestamp * 1000).toLocaleString()
  // )

  // const timeDifference = current_timestamp - timestamp
  // const twentyMinutesInMilliseconds = 20 * 60 * 1000

  // if (timeDifference > twentyMinutesInMilliseconds) {
  //   return NextResponse.json({ error: "timestamp generated too early" })
  // }

  let domain = ""
  for (var i = 18; i < 47; i++) {
    if (req.publicSignals[i] != "0") {
      domain += String.fromCharCode(parseInt(req.publicSignals[i]))
    }
  }

  console.timeEnd("Verification time")
  return NextResponse.json({ domain, isVerified })
}
