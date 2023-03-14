import { NextApiRequest, NextApiResponse } from 'next';

import { vkey } from './constants/vkey'

const snarkjs = require('snarkjs')


export async function verifyProof(proof: any, publicSignals: any) {
  const proofVerified = await snarkjs.groth16.verify(vkey, publicSignals, proof)
  return proofVerified
}

// this allows you to write to a post
export default async function handler(
  request: NextApiRequest,
  response: NextApiResponse,
) {

  const { body } = request
  const b = JSON.parse(body)

  console.log(b)

  // verify proof here 
  const isVerified = await verifyProof(b.proof, b.publicSignals)

  // TODO: return the domain
  if (isVerified) {
    return response.status(200).send("Success")
  } else {
    return response.status(400).send("Proof not verified")
  }
}