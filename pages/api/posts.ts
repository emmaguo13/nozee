import { NextApiRequest, NextApiResponse } from 'next'
import {
  initializeApp,
  applicationDefault,
  getApp,
  App,
  getApps,
  cert,
  Credential,
  ServiceAccount
} from 'firebase-admin/app'
import { getFirestore } from 'firebase-admin/firestore'
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
      credential: cert(serviceAcc),
      projectId: process.env.NEXT_PUBLIC_PROJECT_ID
    },
    'nozee'
  )
} else {
  app = getApp('nozee')
}

const db = getFirestore(app)

// read all posts
export default async function handler(
  request: NextApiRequest,
  response: NextApiResponse
) {
  const snapshot = await db
    .collection('posts')
    .orderBy('timestamp', 'desc')
    .get()

  return response.json(snapshot.docs.map(doc => doc.data() as Post))
}
