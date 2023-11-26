// Library to store ECDSA private keys in the browser, allows you to encrypt, decrypt, sign, and verify messages
// todo: error handling
import localforage from "localforage"

// Function to call on indexedDB
// todo: delete
// async function dbCall(f: (store: IDBObjectStore) => (Promise<CryptoKeyPair> | void)) {
//   // var indexedDB = indexedDB
//   // Open the IndexedDB database
//   const result = await new Promise((resolve, reject) => {
//     const request = indexedDB.open("NozeeKeyDB", 1)

//     request.onerror = (event) => {
//       reject("Error opening database")
//     }

//     request.onupgradeneeded = (event) => {
//       const db = (event.target as IDBOpenDBRequest).result as IDBDatabase

//       // Create an object store schema
//       db.createObjectStore("keyStore", { keyPath: "id", autoIncrement: true })
//     }

//     request.onsuccess = (event) => {
//       const db = (event.target as IDBOpenDBRequest).result as IDBDatabase
//       var tx = db.transaction("keyStore", "readwrite")
//       var store = tx.objectStore("keyStore")
//       const res = f(store)

//       tx.oncomplete = function () {
//         db.close()
//         resolve(res)

//       }
//     }
//   })

//   return result
// }
// Function to generate and store a P-256 ECDSA key in IndexedDB
export async function generateAndStoreKey() {
  try {
    // Generate a P-256 ECDSA key pair
    const keyPair = await crypto.subtle.generateKey(
      {
        name: "ECDSA",
        namedCurve: "P-256",
      },
      false,
      ["sign", "verify"]
    )

    // await dbCall((store: IDBObjectStore) => {
    //   store.put({ id: 1, keys: keyPair })
    // })

    await localforage.setItem("keyPair", keyPair)

    console.log("Key pair successfully stored in localforage.")
  } catch (error) {
    throw error
  }
}

// retrieves keypair and converts to string to store in firebase
export async function retrievePublicKey() {
  var keyPair = (await localforage.getItem<CryptoKeyPair>(
    "keyPair"
  )) as CryptoKeyPair

  if (!keyPair) {
    // await generateAndStoreKey()
    // keyPair = (await localforage.getItem<CryptoKeyPair>(
    //   "keyPair"
    // )) as CryptoKeyPair
    return ""
  }
  const jsonKey = await window.crypto.subtle.exportKey("jwk", keyPair.publicKey)

  // Convert ArrayBuffer to Base64 string
  // let binary = '';
  // const bytes = new Uint8Array(arrayBuffPubKey);
  // const len = bytes.byteLength;
  // for (let i = 0; i < len; i++) {
  //   binary += String.fromCharCode(bytes[i]);
  // }
  // const base64PubKey = window.btoa(binary);

  // console.log(base64PubKey)

  return JSON.stringify(jsonKey)
}

// Function to retrieve a key pair from IndexedDB
// export async function retrieveKeyPair() {
//   const keyPair = await dbCall(async (store : IDBObjectStore) => {
//     const res = await new Promise((resolve, reject) => {
//       const request = store.get(1)

//       request.onsuccess = (event) => {
//         console.log(event.target)
//         resolve("")
//         // const keyPair = event.target.result.keys

//       }

//       // request.onsuccess = async function () {
//       //   console.log(request)
//       //   var keyPair = request.result.keys
//       //   resolve(keyPair)
//       // }
//     })

//     return res as CryptoKeyPair
//   })

//   return false
// }

// Function to sign a message with a private key
export async function ecdsaSign(message: string): Promise<ArrayBuffer> {
  const keyPair = (await localforage.getItem<CryptoKeyPair>(
    "keyPair"
  )) as CryptoKeyPair

  let encoder = new TextEncoder()
  let encoded = encoder.encode(message)

  let signature = await window.crypto.subtle.sign(
    {
      name: "ECDSA",
      hash: { name: "SHA-256" },
    },
    keyPair.privateKey,
    encoded
  )

  console.log(signature)

  return signature
}

// todo: deprecated
// ecdsa verification in firebase
export async function ecdsaVerify(
  message: string,
  signature: ArrayBuffer,
  pubKey: string
) {
  console.log(pubKey)
  // console.log(window.crypto.subtle)
  console.log(window)
  // import key
  let encoder = new TextEncoder()
  // let encodedKey = encoder.encode(pubKey)
  let encodedMsg = encoder.encode(message)

  console.log(encodedMsg)

  // Convert Base64 string to ArrayBuffer
  let binaryString = window.atob(pubKey)
  let len = binaryString.length
  let bytes = new Uint8Array(len)
  for (let i = 0; i < len; i++) {
    bytes[i] = binaryString.charCodeAt(i)
  }
  let encodedKey = bytes.buffer

  console.log(encodedKey)

  const publicKey = await window.crypto.subtle.importKey(
    "raw",
    encodedKey,
    {
      name: "ECDSA",
      namedCurve: "P-256",
    },
    true,
    ["verify"]
  )

  console.log(publicKey)

  let result = await window.crypto.subtle.verify(
    {
      name: "ECDSA",
      hash: { name: "SHA-256" },
    },
    publicKey,
    signature,
    encodedMsg
  )

  console.log(result)

  return result
}
