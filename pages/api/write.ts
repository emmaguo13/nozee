import {
  App,
  ServiceAccount,
  cert,
  getApp,
  getApps,
  initializeApp
} from 'firebase-admin/app'
import { getFirestore } from 'firebase-admin/firestore'
import { NextApiRequest, NextApiResponse } from 'next'
import { Post } from '../../types'

let app: App

let serviceAcc = {
  projectId: process.env.NEXT_PUBLIC_PROJECT_ID,
  clientEmail: process.env.FIREBASE_CLIENT_EMAIL,
  privateKey: (process.env.FIREBASE_PRIVATE_KEY as string).replace(/\\n/g, '\n')
}

if (getApps().length == 0) {
  app = initializeApp(
    {
      credential: cert(serviceAcc as ServiceAccount),
      projectId: process.env.NEXT_PUBLIC_PROJECT_ID
    },
    'nozee'
  )
} else {
  app = getApp('nozee')
}

const db = getFirestore(app)

async function createPost({
  id,
  company,
  message,
  address,
  signature,
  title
}: Post) {
  return db
    .collection('posts')
    .doc(id)
    .set({
      title,
      company,
      message,
      address,
      signature,
      id,
      timestamp: Date.now()
    })
    .then(docRef => {
      console.log('Document written', docRef)
      return docRef
    })
    .catch(error => {
      throw new Error(error)
    })
}

const BASE_URL =
  process.env.NODE_ENV === 'production'
    ? 'https://www.nozee.xyz/'
    : 'http://localhost:3000/'

export default async function handler(
  request: NextApiRequest,
  response: NextApiResponse
) {
  const { isVerified } = await fetch(BASE_URL + '/api/verify', {
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

  try {
    const post = await createPost(request.body)
    return response.status(200).json(post)
  } catch (error) {
    return response.status(500).json({ error })
  }
}
