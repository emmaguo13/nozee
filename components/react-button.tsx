"use client"

import React from "react"
import { useRouter } from "next/navigation"
import { ec as EC } from "elliptic"
import localforage from "localforage"
import { ThumbsUp } from "lucide-react"

import { cn } from "@/lib/utils"

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
    const storedPubKey = await localforage.getItem<string>("pubkey")
    const storedPrivKey = await localforage.getItem<string>("privkey")
    // although we do not need to verify a proof upon posting, we want the user to have prev verified a proof
    if (!storedProof || storedPublicSignals?.length === 0 || !storedKey) {
      alert("Please generate a proof first")
      return
    }

    // todo: change msgHash to just msgHex, since we're not hashing the message, there's no need
    const ec = new EC("secp256k1")
    const hexMsg = Buffer.from(postId, "utf8").toString("hex")
    const key = ec.keyFromPrivate(storedPrivKey as string, "hex")
    const signature = key.sign(hexMsg, "hex", { canonical: true }).toDER("hex")

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
    }
  }

  return (
    <ThumbsUp
      onClick={() => handleSubmit()}
      className={cn("mr-1 h-3 w-3", fillClassName, textClassName)}
    />
  )
}
