// todo: clean this up with prettier
import {
  ecdsaSign,
  generateAndStoreKey,
  retrieveKeyPair,
} from "../lib/webcrypto"

// tests to ensure that signing messages + storing keys in IndexedDB work
// TODO: this test is in progress
const { JSDOM } = require("jsdom")
const { Crypto } = require("@peculiar/webcrypto")

// Include your functions here (e.g., dbCall, generateAndStoreKey, retrieveKeyPair, ecdsaSign)

// Mock indexedDB
const mockWindow = () => {
  const { window } = new JSDOM()
  global.window = window
  global.crypto = new Crypto() // Mocking the crypto object
}

beforeAll(() => {
  mockWindow()
})

describe("IndexedDB Tests", () => {
  test("Generate and store key in IndexedDB", async () => {
    await generateAndStoreKey()

    // Add assertions to check if the key is successfully stored in IndexedDB
    // You can open a transaction and check the content of the object store
  })

  test("Retrieve key pair from IndexedDB", async () => {
    const keyPair = await retrieveKeyPair()

    // Add assertions to check if the key pair is retrieved successfully
    expect(keyPair).toBeDefined()
    expect((keyPair as CryptoKeyPair).publicKey).toBeDefined()
    expect((keyPair as CryptoKeyPair).privateKey).toBeDefined()
  })
})

describe("ECDSA Tests", () => {
  test("Sign a message with a private key", async () => {
    const message = "Hello, World!"
    const signature = await ecdsaSign(message)

    // Add assertions to check if the message is signed successfully
    expect(signature).toBeDefined()
  })

  // Add more tests for other functions such as encrypt, decrypt, etc.
})
