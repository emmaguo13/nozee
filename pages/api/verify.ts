import { NextApiRequest, NextApiResponse } from "next"
import { vkey } from "@/constants"

import { verifyPublicKey } from "@/lib/verifyPublicKey"

const snarkjs = require("snarkjs")

export default async function handler(
  request: NextApiRequest,
  response: NextApiResponse
) {
  console.log("CORRECT ROUTE")
  const isVerified = await snarkjs.groth16.verify(
    vkey,
    request.body.publicSignals,
    request.body.proof
  )
  const b = request.body
  if (isVerified) {
    if (!verifyPublicKey(request.body.publicSignals, "openai")) {
      return response.status(500).json({ error: "Public key not verified" })
    }

    let domain = ""
    for (var i = 18; i < 47; i++) {
      if (b.publicSignals[i] != "0") {
        domain += String.fromCharCode(parseInt(b.publicSignals[i]))
      }
    }
    return response.status(200).json({ domain, isVerified })
  } else {
    return response.status(500).json({ error: "Proof not verified" })
  }
}
