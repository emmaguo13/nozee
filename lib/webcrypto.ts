// Library to store ECDSA private keys in the browser, allows you to encrypt, decrypt, sign, and verify messages
// todo: error handling
import localforage from "localforage"

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
    return ""
  }
  const jsonKey = await window.crypto.subtle.exportKey("jwk", keyPair.publicKey)

  return JSON.stringify(jsonKey)
}

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
