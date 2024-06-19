"use client"

import React from "react"
import { useRouter } from "next/navigation"
import localforage from "localforage"
import { ThumbsUp } from "lucide-react"

import { cn } from "@/lib/utils"
import { ecdsaSign, retrievePublicKey } from "@/lib/webcrypto"

import { toast } from "./ui/use-toast"

export function ReactButton({
  color,
  postId,
  commentId,
}: {
  color: string
  postId: string
  commentId: string
}) {
  const [isLoading, setIsLoading] = React.useState(false)
  const router = useRouter()
  // Add your component logic here
  const fillClassName = `fill-${color}-400`
  const textClassName = `text-${color}-400`

  const handleSubmit = async () => {
    setIsLoading(true)
    const storedProof = await localforage.getItem<string>("proof")
    const storedPublicSignals = await localforage.getItem<string[]>(
      "publicSignals"
    )
    const storedKey = await localforage.getItem<string>("key")
    // although we do not need to verify a proof upon posting, we want the user to have prev verified a proof
    if (!storedProof || storedPublicSignals?.length === 0 || !storedKey) {
      alert("Please go to the login page to generate a proof")
      return
    }
    const storedPubKey = await retrievePublicKey()
    const signatureBuff = await ecdsaSign(commentId == "" ? postId : commentId)
    const signature = btoa(
      String.fromCharCode(...new Uint8Array(signatureBuff))
    )

    if (!storedPubKey) {
      alert("Please go to the login page to generate a key pair")
      return
    }

    const res = await fetch(process.env.NEXT_PUBLIC_BASE_URL + "/api/upvote", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        pubkey: storedPubKey,
        signature,
        postId: postId,
        commentId: commentId,
      }),
    })
    if (res.status === 200) {
      setIsLoading(false)
      router.refresh()
    } else {
      const resJson = (await res.json()) as any
      if (resJson.error == "Expired public key") {
        await localforage.removeItem("proof")
        await localforage.removeItem("publicSignals")
        await localforage.removeItem("key")
        toast({
          title: "Failure!",
          description:
            "Please go to ChatGPT to retrieve a new token, then go to the login page and reauthenticate.",
        })
        router.push("/login")
      } else {
        toast({
          title: "Upvote failed!",
          description: "There was a problem with upvoting. Please try again.",
        })
      }
    }
  }

  return (
    <ThumbsUp
      onClick={() => handleSubmit()}
      className={cn("mr-1 h-3 w-3", fillClassName, textClassName)}
    />
  )
}
