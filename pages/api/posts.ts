import { NextApiRequest, NextApiResponse } from 'next';
import { initializeApp, applicationDefault, getApp, App, getApps, cert, Credential, ServiceAccount } from 'firebase-admin/app';
import { getFirestore } from 'firebase-admin/firestore';
import { Post } from '../../types'

import secret from "../../firebaseSecret.json"

let app: App;

let credential: Credential = cert(secret as ServiceAccount)
if (getApps().length == 0) {
    app = initializeApp({
        // credential: applicationDefault(),
        credential: cert(secret as ServiceAccount),
        projectId: process.env.NEXT_PUBLIC_PROJECT_ID
    }, "nozee");
} else {
    app = getApp("nozee")
}

const db = getFirestore(app)

// read all posts
export default async function handler(
  request: NextApiRequest,
  response: NextApiResponse,
) {

  const snapshot = await db
    .collection('posts').orderBy('timestamp', 'desc').get()

  return response.json(snapshot.docs.map(doc => doc.data() as Post))
}