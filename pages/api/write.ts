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

  /*
    id,
    company,
    message,
    address,
    signature,
    title
  */

  // verify proof here 
  const isVerified = await verifyProof(body.proof, body.publicSignals)
  let post; 
  if (isVerified) {

    const openAiPubKey = [
      "1039819274958841503552777425237411969",
      "2393925418941457468536305535389088567",
      "513505235307821578406185944870803528",
      "31648688809132041103725691608565945",
      "1118227280248002501343932784260195348",
      "1460752189656646928843376724380610733",
      "2494690879775849992239868627264129920",
      "499770848099786006855805824914661444",
      "117952129670880907578696311220260862",
      "594599095806595023021313781486031656",
      "1954215709028388479536967672374066621",
      "275858127917207716435784616531223795",
      "2192832134592444363563023272016397664",
      "1951765503135207318741689711604628857",
      "679054217888353607009053133437382225",
      "831007028401303788228965296099949363",
      "4456647917934998006260668783660427",
    ]

    for (var i = 0; i < 17; i++) {
      if (body.publicSignals[i] != openAiPubKey[i]) {
          return response.status(400).send("Invalid public key")
      }
    }

    try {
      post = await createPost(body)
      // post to web3.storage
    } catch (e) {
      console.log(e)
      return response.status(500).send("Database write error")
    }
  } else {
    return response.status(400).send('Proof not verified')
  }

  return response.json({cid: post})
}
