import { NextApiRequest, NextApiResponse } from 'next'

const BASE_URL =
  process.env.NODE_ENV === 'production'
    ? 'https://www.nozee.xyz/'
    : 'http://localhost:3000/'

export default async function handler(
  request: NextApiRequest,
  response: NextApiResponse
) {
  const { key } = request.query
  console.log('🚀 ~ key:', key)
  const { isVerified, domain } = await fetch(BASE_URL + '/api/verify', {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json'
    },
    body: JSON.stringify({
      proof: request.body.proof,
      publicSignals: request.body.publicSignals
    })
  }).then(res => res.json())

  if (!isVerified) {
    return response.status(500).json({ error: 'Proof not verified' })
  }

  // verify timestamp
  let timestamp = parseInt(request.body.publicSignals[48]);
  console.log('timestamp from frontend', timestamp)

  const now = new Date()  
  const utcMilllisecondsSinceEpoch = now.getTime()  
  const current_timestamp = Math.round(utcMilllisecondsSinceEpoch / 1000)  
  
  // 20 minutes of time inbetween frontend timestamp generation and backend timestamp stuff
  if (timestamp + 1200 < current_timestamp) {
    return response.status(500).json({ error: 'timestamp generated too early'})
  }

  return response.status(200).json({domain})
}
