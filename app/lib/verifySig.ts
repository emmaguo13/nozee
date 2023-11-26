const { subtle } = require("crypto").webcrypto

export async function ecdsaVerify(
  message: string,
  signature: string,
  pubKey: string
) {
  // import key
  let encoder = new TextEncoder()
  // let encodedKey = encoder.encode(pubKey)
  let encodedMsg = encoder.encode(message)

  // Convert the Base64 string back to an ArrayBuffer
  let binaryString = Buffer.from(signature, "base64").toString("binary")
  let len = binaryString.length
  let bytes = new Uint8Array(len)
  for (let i = 0; i < len; i++) {
    bytes[i] = binaryString.charCodeAt(i)
  }
  let signatureBuff = bytes.buffer

  const publicKey = await subtle.importKey(
    "jwk",
    JSON.parse(pubKey),
    {
      name: "ECDSA",
      namedCurve: "P-256",
    },
    true,
    ["verify"]
  )

  let result = await subtle.verify(
    {
      name: "ECDSA",
      hash: { name: "SHA-256" },
    },
    publicKey,
    signatureBuff,
    encodedMsg
  )

  return result
}
