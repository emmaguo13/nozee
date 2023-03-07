import { NextApiRequest, NextApiResponse } from 'next';
import { initializeApp, applicationDefault, getApp, App, getApps, cert, Credential, ServiceAccount } from 'firebase-admin/app';
import { getFirestore } from 'firebase-admin/firestore';
import { Post } from '../../types'

import secret from "../../firebaseSecret.json"

let app: App;

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
        console.log('Document written with ID: ', docRef)
        return docRef
      })
      .catch(error => {
        throw new Error(error);
      })
  }


// this allows you to write to a post
export default async function handler(
  request: NextApiRequest,
  response: NextApiResponse,
) {

  const { body } = request
  const b = JSON.parse(body)

  /*
    id,
    company,
    message,
    address,
    signature,
    title
  */

  let post; 
  try {
    post = await createPost(b)
  } catch {
    return response.status(500).send("Server error")
  }

  return response.status(200).send("Success")
}