import { NextApiRequest, NextApiResponse } from 'next'
import { vkey } from './constants/vkey'
const snarkjs = require('snarkjs')

export async function verifyProof(proof: any, publicSignals: any) {
  const proofVerified = await snarkjs.groth16.verify(vkey, publicSignals, proof)
  return proofVerified
}

export default async function handler(
  request: NextApiRequest,
  response: NextApiResponse
) {
  console.log('🚀 ~ request:', typeof request.body)
  const isVerified = await verifyProof(
    request.body.proof,
    request.body.publicSignals
  )
  // TODO: return the domain
<<<<<<< HEAD
  if (isVerified) {
    // Verify Openai address 

    let domain = ""
    for (var i = 18; i < 47; i++) {
        if (b.publicSignals[i] != "0") {
            domain += String.fromCharCode(parseInt(b.publicSignals[i]));
        }
    }

    console.log("showing domain")
    console.log(domain)

    return response.json({domain: domain})
  } else {
    return response.status(400).send("Proof not verified")
  }
}
=======
  return response.status(200).json({ isVerified })
}
>>>>>>> main
