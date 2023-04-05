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
  const b = request.body
  if (isVerified) {
    // Verify Openai address
    const openAiPubKey = [
      '1039819274958841503552777425237411969',
      '2393925418941457468536305535389088567',
      '513505235307821578406185944870803528',
      '31648688809132041103725691608565945',
      '1118227280248002501343932784260195348',
      '1460752189656646928843376724380610733',
      '2494690879775849992239868627264129920',
      '499770848099786006855805824914661444',
      '117952129670880907578696311220260862',
      '594599095806595023021313781486031656',
      '1954215709028388479536967672374066621',
      '275858127917207716435784616531223795',
      '2192832134592444363563023272016397664',
      '1951765503135207318741689711604628857',
      '679054217888353607009053133437382225',
      '831007028401303788228965296099949363',
      '4456647917934998006260668783660427'
    ]

    for (var i = 0; i < 17; i++) {
      if (b.publicSignals[i] != openAiPubKey[i]) {
        return response.status(400).send('Invalid public key')
      }
    }

    let domain = ''
    for (var i = 18; i < 47; i++) {
      if (b.publicSignals[i] != '0') {
        domain += String.fromCharCode(parseInt(b.publicSignals[i]))
      }
    }

    return response.json({ domain: domain })
  } else {
    return response.status(400).send('Proof not verified')
  }
}
