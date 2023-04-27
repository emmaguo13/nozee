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
import { verifyPublicKey } from '../../helpers/verifyPublicKey'
import { Post } from '../../types'
import { Web3Storage, File } from 'web3.storage'

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

function getAccessToken() {
  return process.env.WEB3_STORAGE_TOKEN
}

function makeStorageClient() {
  return new Web3Storage({ token: getAccessToken() as string })
}

async function web3storeFiles(files: File[]) {
  const client = makeStorageClient()
  const cid = await client.put(files)
  console.log('stored files with cid:', cid)
  return cid
}

async function createPost({
  id,
  company,
  message,
  address,
  signature,
  title
}: Post) {
  const post = {
    title,
    company,
    message,
    address,
    signature,
    id,
    timestamp: Date.now()
  }

  const buffer = Buffer.from(JSON.stringify(post))

  const files = [new File([buffer], 'hello.json')]

  const cid = await web3storeFiles(files)

  return db
    .collection('posts')
    .doc(id)
    .set(post)
    .then(docRef => {
      console.log('Document written', docRef)
      return { docRef, cid }
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

  if (
    !verifyPublicKey(request.body.publicSignals, key?.toString() || 'openai')
  ) {
    return response.status(500).json({ error: 'Public key not verified' })
  }

  try {
    const res = await createPost(request.body)
    return response.status(200).json({ ...res, domain })
  } catch (error) {
    return response.status(500).json({ error })
  }
}
