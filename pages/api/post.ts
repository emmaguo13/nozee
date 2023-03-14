import { NextApiRequest, NextApiResponse } from 'next';
import { initializeApp, applicationDefault, getApp, App, getApps, cert, Credential, ServiceAccount } from 'firebase-admin/app';
import { getFirestore } from 'firebase-admin/firestore';
import { Post } from '../../types'

let app: App;

let serviceAcc = {
  projectId: process.env.NEXT_PUBLIC_PROJECT_ID,
  clientEmail: process.env.FIREBASE_CLIENT_EMAIL,
  privateKey: (process.env.FIREBASE_PRIVATE_KEY as string).replace(/\\n/g, '\n'),
}

if (getApps().length == 0) {
    app = initializeApp({
        credential: cert(serviceAcc as ServiceAccount),
        projectId: process.env.NEXT_PUBLIC_PROJECT_ID
    }, "nozee");
} else {
    app = getApp("nozee")
}

const db = getFirestore(app)

// read a post
export default async function handler(
  request: NextApiRequest,
  response: NextApiResponse,
) {

  const { body } = request
  const b = JSON.parse(body)

  const ref = db.collection('posts')
  const query = ref.where('id', '==', b.id)
  const snapshot = await query.get()

  return response.json(snapshot.docs.map(doc => doc.data())[0] as Post)
}