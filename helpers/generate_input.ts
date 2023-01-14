import * as fs from 'fs'
import { shaHash } from './shaHash'
import { bytesToBigInt, fromHex, toCircomBigIntBytes } from './binaryFormat'
import { MAX_HEADER_PADDED_BYTES } from './constants'
import { Hash } from './fast-sha256'
const pki = require('node-forge').pki

export async function generate_inputs(
  // signature: string = 'mLCysHQtDftfFey4F-ntFma22r5-qpxtkXsiDw6TY30Tnoj2kPQ_YdSjzagrwRgF7pHE8SSM_roo2wDh3c_8vDNRZeax4VICZjYmPS-3ZWAV0XyjjlgWgFleTqVT72M-VlPCdecHiYQJojlYHJyGybvTCaX1cqoF9aAMy8wBvRbSceECmX15k4nKG51Z5Le7k_vOShaxYmwrRhMIip4KRv-DW1FXAdi_F-MYSrqZ6Oq-nglMujxD2NOoHoqOqmyd1OMIrc6oIRuRqBXlRnQ0IdUDQbiXfyFVC0ItIME3a4SLoWp_rrmY1tSrGJu93MZrjhzfkNglJ-FOp4kKZAKkzA',
  // msg: string = 'eyJhbGciOiJSUzI1NiIsInR5cCI6IkpXVCIsImtpZCI6Ik1UaEVOVUpHTkVNMVFURTRNMEZCTWpkQ05UZzVNRFUxUlRVd1FVSkRNRU13UmtGRVFrRXpSZyJ9.eyJodHRwczovL2FwaS5vcGVuYWkuY29tL3Byb2ZpbGUiOnsiZW1haWwiOiJzZWh5dW5AYmVya2VsZXkuZWR1IiwiZW1haWxfdmVyaWZpZWQiOnRydWUsImdlb2lwX2NvdW50cnkiOiJVUyJ9LCJodHRwczovL2FwaS5vcGVuYWkuY29tL2F1dGgiOnsidXNlcl9pZCI6InVzZXIta1dMaXBzT3dMZFd4MXdMc0I3clR3UnFlIn0sImlzcyI6Imh0dHBzOi8vYXV0aDAub3BlbmFpLmNvbS8iLCJzdWIiOiJnb29nbGUtb2F1dGgyfDExNjYwOTg2MjEwMzkxMTMwNjgwNyIsImF1ZCI6WyJodHRwczovL2FwaS5vcGVuYWkuY29tL3YxIiwiaHR0cHM6Ly9vcGVuYWkuYXV0aDAuY29tL3VzZXJpbmZvIl0sImlhdCI6MTY3MzE1NTQ0NiwiZXhwIjoxNjczNzYwMjQ2LCJhenAiOiJUZEpJY2JlMTZXb1RIdE45NW55eXdoNUU0eU9vNkl0RyIsInNjb3BlIjoib3BlbmlkIHByb2ZpbGUgZW1haWwgbW9kZWwucmVhZCBtb2RlbC5yZXF1ZXN0IG9yZ2FuaXphdGlvbi5yZWFkIG9mZmxpbmVfYWNjZXNzIn0',
  // ethAddress: string = '0x0000000000000000000000000000000000000000'
  signature: string,
  msg: string,
  ethAddress: string
): Promise<any> {
  console.log('🚀 ~ signature', signature)
  const sig = BigInt('0x' + Buffer.from(signature, 'base64').toString('hex'))
  const message = Buffer.from(msg)
  const period_idx_num = BigInt(msg.indexOf('.'))

  const { domain: domainStr, domain_idx: domain_index } = findDomain(msg)
  const domain = Buffer.from(domainStr ?? '')
  const domain_idx_num = BigInt(domain_index ?? 0)

  const circuitType = CircuitType.JWT
  const pubKeyData = pki.publicKeyFromPem(process.env.NEXT_PUBLIC_PUBLIC_KEY)

  const modulus = BigInt(pubKeyData.n.toString())
  const fin_result = await getCircuitInputs(
    sig,
    modulus,
    message,
    ethAddress,
    circuitType,
    period_idx_num,
    domain_idx_num,
    domain
  )

  return fin_result.circuitInputs
}

export interface ICircuitInputs {
  message?: string[]
  modulus?: string[]
  signature?: string[]
  address?: string
  address_plus_one?: string
  message_padded_bytes?: string
  period_idx?: string
  domain_idx?: string
  domain?: string[]
}
enum CircuitType {
  RSA = 'rsa',
  SHA = 'sha',
  TEST = 'test',
  JWT = 'jwt'
}

function assert(cond: boolean, errorMessage: string) {
  if (!cond) {
    throw new Error(errorMessage)
  }
}

// Works only on 32 bit sha text lengths
function int32toBytes(num: number): Uint8Array {
  const arr = new ArrayBuffer(4) // an Int32 takes 4 bytes
  const view = new DataView(arr)
  view.setUint32(0, num, false) // byteOffset = 0; litteEndian = false
  return new Uint8Array(arr)
}

// Works only on 32 bit sha text lengths
function int8toBytes(num: number): Uint8Array {
  const arr = new ArrayBuffer(1) // an Int8 takes 4 bytes
  const view = new DataView(arr)
  view.setUint8(0, num) // byteOffset = 0; litteEndian = false
  return new Uint8Array(arr)
}

// converts ascii to string
function AsciiArrayToString(arr: Buffer) {
  let str = ''
  for (let i = 0; i < arr.length; i++) {
    str += String.fromCharCode(arr[i])
  }
  return str
}

// find email domain in msg
function findDomain(msg: string) {
  let domain_idx
  let domain
  var s = Buffer.from(msg, 'base64')
  var json = AsciiArrayToString(s)
  const email_regex = /([-a-zA-Z._+]+)@([-a-zA-Z]+).([a-zA-Z]+)/
  const match = json.match(email_regex)
  console.log(match)
  if (match) {
    domain = match[2] // [0] = whole group, then capture groups
    let email_index = match.index
    if (email_index) domain_idx = match[0].indexOf(domain) + email_index
  }
  return { domain, domain_idx }
}

function mergeUInt8Arrays(a1: Uint8Array, a2: Uint8Array): Uint8Array {
  // sum of individual array lengths
  var mergedArray = new Uint8Array(a1.length + a2.length)
  mergedArray.set(a1)
  mergedArray.set(a2, a1.length)
  return mergedArray
}

// Puts an end selector, a bunch of 0s, then the length, then fill the rest with 0s.
async function sha256Pad(
  prehash_prepad_m: Uint8Array,
  maxShaBytes: number
): Promise<[Uint8Array, number]> {
  const length_bits = prehash_prepad_m.length * 8 // bytes to bits
  const length_in_bytes = int32toBytes(length_bits)
  prehash_prepad_m = mergeUInt8Arrays(prehash_prepad_m, int8toBytes(2 ** 7))
  while (
    (prehash_prepad_m.length * 8 + length_in_bytes.length * 8) % 512 !==
    0
  ) {
    prehash_prepad_m = mergeUInt8Arrays(prehash_prepad_m, int8toBytes(0))
  }
  prehash_prepad_m = mergeUInt8Arrays(prehash_prepad_m, length_in_bytes)
  assert(
    (prehash_prepad_m.length * 8) % 512 === 0,
    'Padding did not compconste properly!'
  )
  const messageLen = prehash_prepad_m.length
  while (prehash_prepad_m.length < maxShaBytes) {
    prehash_prepad_m = mergeUInt8Arrays(prehash_prepad_m, int32toBytes(0))
  }
  assert(
    prehash_prepad_m.length === maxShaBytes,
    'Padding to max length did not compconste properly!'
  )

  return [prehash_prepad_m, messageLen]
}

async function Uint8ArrayToCharArray(a: Uint8Array): Promise<string[]> {
  return Array.from(a).map(x => x.toString())
}

async function Uint8ArrayToString(a: Uint8Array): Promise<string> {
  return Array.from(a)
    .map(x => x.toString())
    .join(';')
}

async function partialSha(
  msg: Uint8Array,
  msgLen: number
): Promise<Uint8Array> {
  const shaGadget = new Hash()
  return await shaGadget.update(msg, msgLen).cacheState()
}

export async function getCircuitInputs(
  rsa_signature: BigInt,
  rsa_modulus: BigInt,
  msg: Buffer,
  eth_address: string,
  circuit: CircuitType,
  period_idx_num: BigInt,
  domain_idx_num: BigInt,
  domain_raw: Buffer
): Promise<{
  valid: {
    validSignatureFormat?: boolean
    validMessage?: boolean
  }
  circuitInputs: ICircuitInputs
}> {
  console.log('Starting processing of inputs')
  const modulusBigInt = rsa_modulus
  // Message is the header + payload
  const prehash_message_string = msg
  const signatureBigInt = rsa_signature

  // Perform conversions
  const prehashBytesUnpadded =
    typeof prehash_message_string == 'string'
      ? new TextEncoder().encode(prehash_message_string)
      : Uint8Array.from(prehash_message_string)

  // Sha add padding
  const [messagePadded, messagePaddedLen] = await sha256Pad(
    prehashBytesUnpadded,
    MAX_HEADER_PADDED_BYTES
  )

  // domain padding
  const domainUnpadded =
    typeof domain_raw == 'string'
      ? new TextEncoder().encode(domain_raw)
      : Uint8Array.from(domain_raw)

  const zerosPadArray = new Uint8Array(30 - domainUnpadded.length)
  const domainPadded = new Uint8Array([...domainUnpadded, ...zerosPadArray])

  // Ensure SHA manual unpadded is running the correct function
  const shaOut = await partialSha(messagePadded, messagePaddedLen)
  assert(
    (await Uint8ArrayToString(shaOut)) ===
      (await Uint8ArrayToString(
        Uint8Array.from(await shaHash(prehashBytesUnpadded))
      )),
    'SHA256 calculation did not match!'
  )

  // Compute identity revealer
  const modulus = toCircomBigIntBytes(modulusBigInt)
  const signature = toCircomBigIntBytes(signatureBigInt)

  const message_padded_bytes = messagePaddedLen.toString()
  const message = await Uint8ArrayToCharArray(messagePadded) // Packed into 1 byte signals
  const domain = await Uint8ArrayToCharArray(domainPadded)
  const period_idx = period_idx_num.toString()
  const domain_idx = domain_idx_num.toString()

  const address = bytesToBigInt(fromHex(eth_address)).toString()
  const address_plus_one = (bytesToBigInt(fromHex(eth_address)) + 1n).toString()

  const circuitInputs = {
    message,
    modulus,
    signature,
    message_padded_bytes,
    address,
    address_plus_one,
    period_idx,
    domain_idx,
    domain
  }
  return {
    circuitInputs,
    valid: {}
  }
}
