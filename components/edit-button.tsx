// todo: in progress, unused rn
"use client"

import React from "react"
import { useRouter } from "next/navigation"
import { Comment, Post } from "@/types"
import localforage from "localforage"
import { Pencil } from "lucide-react"

import { cn } from "@/lib/utils"
import { ecdsaSign, retrievePublicKey } from "@/lib/webcrypto"

export function EditButton({
  color,
  postId,
  commentId,
  body,
  object, // post or comment
}: {
  color: string
  postId: string
  commentId: string
  body: string
  object: Post | Comment
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
    const storedPubKey = await retrievePublicKey()
    // although we do not need to verify a proof upon posting, we want the user to have prev verified a proof
    if (!storedProof || storedPublicSignals?.length === 0 || !storedKey) {
      alert("Please go to the login page and generate a proof")
      return
    }

    if (!storedPubKey) {
      alert("Please go to the login page to generate a key pair")
      return
    }

    const signatureBuff = await ecdsaSign(commentId == "" ? postId : commentId)
    const signature = btoa(
      String.fromCharCode(...new Uint8Array(signatureBuff))
    )

    if (commentId == "") {
      const res = await fetch(
        process.env.NEXT_PUBLIC_BASE_URL + "/api/comment",
        {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify({
            pubkey: storedPubKey,
            signature,
            postId: postId,
            comment: body,
            id: commentId,
          }),
        }
      )
    } else {
      const res = await fetch(process.env.NEXT_PUBLIC_BASE_URL + "/api/write", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          title: (object as Post).title,
          pubkey: object.pubkey,
          msgHash: body,
          signature,
          postId: postId,
        }),
      })
      if (res.status === 200) {
        setIsLoading(false)
        router.refresh()
      }
    }
  }

  return (
    <Pencil
      onClick={() => handleSubmit()}
      className={cn("mr-1 h-3 w-3", fillClassName, textClassName)}
    />
  )
}
