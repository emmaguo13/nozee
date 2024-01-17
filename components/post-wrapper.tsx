"use client"

import React from "react"
import { useRouter } from "next/navigation"
import { Comment, Post } from "@/types"
import localforage from "localforage"

import { ecdsaSign, retrievePublicKey } from "@/lib/webcrypto"
import { Button } from "@/components/ui/button"
import {
  Dialog,
  DialogContent,
  DialogFooter,
  DialogTrigger,
} from "@/components/ui/dialog"
import { Input } from "@/components/ui/input"
import { Icons } from "@/components/icons"
import { ReportButton } from "@/components/report-button"

import { CommentCard } from "./comment-card"
import { PostCard } from "./post-card"
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

    // although we do not need to verify a proof upon posting, we want the user to have prev verified a proof
    if (!storedProof || storedPublicSignals?.length === 0 || !storedKey) {
      alert("Please go to the login page and generate a proof")
      return
    }

    const storedPubKey = await retrievePublicKey()
    const signatureBuff = await ecdsaSign(post.id)
    const signature = btoa(
      String.fromCharCode(...new Uint8Array(signatureBuff))
    )

    if (!storedPubKey) {
      alert("Please go to the login page to generate a key pair")
      return
    }

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
        id: "",
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
    } else {
      setOpen(false)
      setBody("")
      setIsLoading(false)

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
      } else {
        toast({
          title: "Failure!",
          description: "Please go to the login page and reauthenticate.",
        })
      }
      router.push("/login")
    }
  }

  // TODO: change to form
  return (
    <Card className="min-w-full">
      <Dialog onOpenChange={setOpen} open={open}>
        <DialogTrigger asChild>
          <div onClick={() => setOpen(true)}>
            <PostCard post={post} key={post.id} preview={true} />
          </div>
        </DialogTrigger>
        <DialogContent className="sm:max-w-[440px]">
          <div className="grid gap-4 py-4">
            <div className="col-span-3 flex max-h-60 w-full flex-col items-start gap-2 overflow-auto">
              <PostCard post={post} key={post.id} preview={false} />
              {post.comments ? (
                post.comments.map((comment: Comment) => (
                  <CommentCard comment={comment} postId={post.id} />
                ))
              ) : (
                <div></div>
              )}
            </div>
            <Input
              id="body"
              value={body}
              onChange={(e) => setBody(e.target.value)}
              className="col-span-3"
            />
            {/* </div> */}
          </div>
          <DialogFooter>
            <ReportButton postId={post.id} />
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
