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
  return response.status(200).json({ isVerified })
}
