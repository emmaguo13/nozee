// Import the functions you need from the SDKs you need
import localforage from 'localforage'
import firebase from 'firebase/app'
import { Comment } from '../pages/post/[pid]'
import 'firebase/firestore'
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
  const snapshot = await db.collection('posts').get()
  return snapshot.docs.map(doc => doc.data())
}

export async function updateComment(comments: Comment[], id: string) {
  db.collection('posts')
    .doc(id).update({"comments": comments}).then(docRef => {
      console.log('Comment updated: ', docRef)
    })
    .catch(error => {
      console.error('Error adding comment: ', error)
    })
}

export async function getPost(id: string) {
  const ref = db.collection("posts")
  const query = ref.where("id", "==", id)
  const snapshot = await query.get()
  return snapshot.docs.map(doc => doc.data()) 
}

export async function getPostsFilterDomain(company:string) {
  // Create a reference to the cities collection
  const ref = db.collection("posts");

  // Create a query against the collection.
  const query = ref.where("company", "==", company);
  const snapshot = await query.get()
  return snapshot.docs.map(doc => doc.data())
}

export async function createPost(
  id: string,
  company: string,
  msg: string,
  pubkey: string,
  signature: string,
  title: string
) {
  db.collection('posts')
    .doc(id)
    .set({
      title,
      company: company,
      msg: msg,
      pubkey: pubkey,
      signature: signature
    })
    .then(docRef => {
      console.log('Document written with ID: ', docRef)
    })
    .catch(error => {
      console.error('Error adding document: ', error)
    })
}
