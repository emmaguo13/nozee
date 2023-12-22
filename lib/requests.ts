// Library that makes and handles requests to our API

import localforage from "localforage"

import { AddKeyReq } from "@/types/requests"
import { toast } from "@/components/ui/use-toast"

const authErrors = new Set([
  "Proof not verified",
  "Invalid proof public key",
  "Invalid timestamp: generated too early",
  "Expired public key",
])

export async function addKey(inputs: AddKeyReq) {
  const req = await fetch(process.env.NEXT_PUBLIC_BASE_URL + "/api/addKey", {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify(inputs),
  })
  const res = await req.json()

  if (req.status != 200) {
    if (authErrors.has(res.error)) {
      // toast for error
      toast({
        title: "Verification failed",
        description:
          "Please get a new token with our extension and authenticate again.",
      })
      // todo: redirect to login somewhere
    } else {
      toast({
        title: "Adding user failed",
        description:
          "Make sure you have a token from ChatGPT with a valid work email.",
      })
    }

    // remove the proof in localforage for user
    // await localforage.removeItem("proof")
    // await localforage.removeItem("publicSignals")
    // await localforage.removeItem("key")
    throw new Error(res.error)
  } else {
    return res
  }
}
