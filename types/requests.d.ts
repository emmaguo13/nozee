import { Proof } from "."

export type AddKeyReq = {
  proof: Proof
  publicSignals: string[]
  key: string
  pubkey: string
}
