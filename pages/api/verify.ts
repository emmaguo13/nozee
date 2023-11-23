import { NextApiRequest, NextApiResponse } from "next"
import { vkey } from "@/constants"

import { verifyPublicKey } from "@/lib/verifyPublicKey"

const snarkjs = require("snarkjs")

export default async function handler(
  request: NextApiRequest,
  response: NextApiResponse
) {
  const isVerified = await snarkjs.groth16.verify(
    vkey,
    request.body.publicSignals,
    request.body.proof
  )
  const b = request.body
  if (!isVerified) {
    return response.status(500).json({ error: "Invalid proof" })
  }

  if (
    !verifyPublicKey(request.body.publicSignals, request.body.key || "openai")
  ) {
    return response.status(501).json({ error: "Invalid public key" })
  }

  const timestamp = parseInt(request.body.publicSignals[47])
  const formatted_timestamp = new Date(timestamp * 1000).toLocaleString()
  console.log("🚀 ~ file: route.ts:29 ~ POST ~ timestamp:", formatted_timestamp)
  const current_timestamp = Math.round(new Date().getTime() / 1000)
  console.log(
    "🚀 ~ file: route.ts:31 ~ POST ~ current_timestamp:",
    new Date(current_timestamp * 1000).toLocaleString()
  )

  const timeDifference = current_timestamp - timestamp
  const twentyMinutesInMilliseconds = 20 * 60 * 1000

  if (timeDifference > twentyMinutesInMilliseconds) {
    return response
      .status(502)
      .json({ error: "Invalid timestamp: generated too early" })
  }

  let domain = ""
  for (var i = 17; i < 47; i++) {
    if (b.publicSignals[i] != "0") {
      domain += String.fromCharCode(parseInt(b.publicSignals[i]))
    }
  }

  // add the public key to firebase -- this public key is now a verified user
  return response
    .status(200)
    .json({ domain, isVerified, time: formatted_timestamp })
}
