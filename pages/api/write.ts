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
import { Web3Storage, File } from 'web3.storage'

import { vkey } from './constants/vkey'
const snarkjs = require('snarkjs')

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

function getAccessToken () {
  return process.env.WEB3_STORAGE_TOKEN
}

function makeStorageClient () {
  return new Web3Storage({ token: getAccessToken() as string })
}

async function web3storeFiles (files: File[]) {
  const client = makeStorageClient()
  const cid = await client.put(files)
  console.log('stored files with cid:', cid)
  return cid
}

async function createPost({
<<<<<<< HEAD
    id,
    company,
    message,
    address,
    signature,
    title
  }: Post) {

    const post = {
=======
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
>>>>>>> main
      title,
      company,
      message,
      address,
      signature,
      id,
      timestamp: Date.now()
<<<<<<< HEAD
    }

    const buffer = Buffer.from(JSON.stringify(post))

    const files = [
      new File([buffer], 'hello.json')
    ]

    const cid = web3storeFiles(files)

    return db
      .collection('posts')
      .doc(id)
      .set(post)
      .then(docRef => {
        console.log('Document written with ID: ', docRef)
        return cid
      })
      .catch(error => {
        throw new Error(error);
      })
  }
=======
    })
    .then(docRef => {
      console.log('Document written with ID: ', docRef)
      return docRef
    })
    .catch(error => {
      throw new Error(error)
    })
}
>>>>>>> main

export async function verifyProof(proof: any, publicSignals: any) {
  const proofVerified = await snarkjs.groth16.verify(vkey, publicSignals, proof)
  return proofVerified
}

// this allows you to write to a post
export default async function handler(
  request: NextApiRequest,
  response: NextApiResponse
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

<<<<<<< HEAD
  // verify proof here 
  const isVerified = await verifyProof(b.proof, b.publicSignals)
  let post; 
  if (isVerified) {
    try {
      post = await createPost(b)
      // post to web3.storage
    } catch (e) {
      console.log(e)
      return response.status(500).send("Database write error")
=======
  // verify proof here
  const isVerified = await verifyProof(b.proof, b.publicInputs)

  if (isVerified) {
    let post
    try {
      post = await createPost(b)
      // post to web3.storage
    } catch {
      return response.status(500).send('Database write error')
>>>>>>> main
    }
  } else {
    return response.status(400).send('Proof not verified')
  }

<<<<<<< HEAD
  return response.json({cid: post})
}
=======
  return response.status(200).send('Success')
}
>>>>>>> main
