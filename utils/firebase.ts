// Import the functions you need from the SDKs you need
import firebase from 'firebase/app'
import 'firebase/firestore'
import { Comment } from '../pages/post/[pid]'
import { Post } from '../types'
// TODO: Add SDKs for Firebase products that you want to use
// https://firebase.google.com/docs/web/setup#available-libraries

// Your web app's Firebase configuration
// For Firebase JS SDK v7.20.0 and later, measurementId is optional
const firebaseConfig = {
  apiKey: process.env.NEXT_PUBLIC_FIREBASE_API_KEY,
  authDomain: process.env.NEXT_PUBLIC_FIREBASE_DOMAIN,
  projectId: process.env.NEXT_PUBLIC_PROJECT_ID,
  storageBucket: process.env.NEXT_PUBLIC_STORAGE_BUCKET,
  messagingSenderId: process.env.NEXT_PUBLIC_MESSAGING_SENDER,
  appId: process.env.NEXT_PUBLIC_APP_ID,
  measurementId: process.env.NEXT_PUBLIC_MEASUREMENT
}

// Initialize Firebase
// const app = initializeApp(firebaseConfig);
// const analytics = getAnalytics(app);

// Initialize Firebase
// firebase.initializeApp(firebaseConfig);
if (!firebase.apps.length) {
  firebase.initializeApp(firebaseConfig)
} else {
  firebase.app() // if already initialized, use that one
}

const db = firebase.firestore()

// Get all posts
export async function getPosts() {
  const snapshot = await db
    .collection('posts')
    .orderBy('timestamp', 'desc')
    .get()
  return snapshot.docs.map(doc => doc.data() as Post)
}

export async function updateComment(comments: Comment[], id: string) {
  db.collection('posts')
    .doc(id)
    .update({ comments: comments })
    .then(docRef => {
      console.log('Comment updated: ', docRef)
    })
    .catch(error => {
      console.error('Error adding comment: ', error)
    })
}

export async function getPost(id: string) {
  const ref = db.collection('posts')
  const query = ref.where('id', '==', id)
  const snapshot = await query.get()
  return snapshot.docs.map(doc => doc.data())[0] as Post
}

export async function getPostsFilterDomain(company: string) {
  const ref = db.collection('posts')
  const query = ref.where('company', '==', company).orderBy('timestamp', 'desc')
  const snapshot = await query.get()
  return snapshot.docs.map(doc => doc.data() as Post)
}

export async function createPost({
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
      console.error('Error adding document: ', error)
    })
}

// iterate through all documents in firebase collection names post
export async function updateScript() {
  const snapshot = await db.collection('posts').get()
  snapshot.forEach(doc => {
    const data = doc.data()
    const id = doc.id
    if (!data.msg || !data.pubkey) return
    db.collection('posts')
      .doc(id)
      .set({ ...data, message: data.msg, address: data.pubkey })
  })
}
