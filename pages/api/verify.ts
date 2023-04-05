import { NextApiRequest, NextApiResponse } from 'next'
import { vkey } from './constants/vkey'
import { openAiPubKey } from '../../constants'
const snarkjs = require('snarkjs')

export async function verifyProof(proof: any, publicSignals: any) {
  const proofVerified = await snarkjs.groth16.verify(vkey, publicSignals, proof)
  return proofVerified
}

const verifyPublicKey = (publicSignals: string[]) => {
  for (var i = 0; i < 17; i++) {
    if (publicSignals[i] != openAiPubKey[i]) {
      return false
    }
  }
  return true
}

export default async function handler(
  request: NextApiRequest,
  response: NextApiResponse
) {
  const isVerified = await verifyProof(
    request.body.proof,
    request.body.publicSignals
  )
  const b = request.body
  if (isVerified) {
    // Verify Openai address
    if (!verifyPublicKey(request.body.publicSignals)) {
      return response.status(500).json({ error: 'Public key not verified' })
    }

    let domain = ''
    for (var i = 18; i < 47; i++) {
      if (b.publicSignals[i] != '0') {
        domain += String.fromCharCode(parseInt(b.publicSignals[i]))
      }
    }
    return response.status(200).json({ domain, isVerified })
  } else {
    return response.status(500).json({ error: 'Proof not verified' })
  }
}
