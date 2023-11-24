"use client"

import React, { useEffect } from "react"
import { useRouter } from "next/navigation"
import { Comment, Post } from "@/types"
import { ec as EC } from "elliptic"
import localforage from "localforage"

import { Button } from "@/components/ui/button"
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Textarea } from "@/components/ui/textarea"
import { Icons } from "@/components/icons"
import { PostCard } from "@/components/post-card"
import MarketingLayout from "@/app/(feed)/layout"

import { CommentCard } from "./comment-card"
import { Card } from "./ui/card"
import { toast } from "./ui/use-toast"

export function PostWrapper({ post }: { post: Post }) {
  const [body, setBody] = React.useState("")
  const [open, setOpen] = React.useState(false)
  const [isLoading, setIsLoading] = React.useState(false)
  const router = useRouter()

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
    const hexMsg = Buffer.from(post.id, "utf8").toString("hex")
    const key = ec.keyFromPrivate(storedPrivKey as string, "hex")
    const signature = key.sign(hexMsg, "hex", { canonical: true }).toDER("hex")

    const res = await fetch(process.env.NEXT_PUBLIC_BASE_URL + "/api/comment", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        pubkey: storedPubKey,
        signature,
        postId: post.id,
        comment: body,
      }),
    })
    if (res.status === 200) {
      setOpen(false)
      setBody("")
      toast({
        title: "Success!",
        description: "Your comment has been created",
      })
      setIsLoading(false)
      router.refresh()
    }
  }

  // TODO: change to form
  return (
    <Card className="min-w-full">
      <Dialog onOpenChange={setOpen} open={open}>
        <DialogTrigger asChild>
          <div onClick={() => setOpen(true)}>
            <PostCard post={post} key={post.id} />
          </div>
        </DialogTrigger>
        <DialogContent className="sm:max-w-[425px]">
          <div className="grid gap-4 py-4">
            <div>
              <div className="flex flex-col items-start gap-2">
                <PostCard post={post} key={post.id} />
                {post.comments ? (
                  post.comments.map((comment: Comment) => (
                    <CommentCard comment={comment} postId={post.id} />
                  ))
                ) : (
                  <div></div>
                )}
              </div>
            </div>
            {/* <div className="grid grid-cols-4 items-center gap-4"> */}
            <Input
              id="body"
              value={body}
              onChange={(e) => setBody(e.target.value)}
              className="col-span-3"
            />
            {/* </div> */}
          </div>
          <DialogFooter>
            <Button disabled={isLoading} onClick={() => handleSubmit()}>
              {isLoading && (
                <Icons.spinner className="mr-2 h-4 w-4 animate-spin" />
              )}
              Comment
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </Card>
  )
}
