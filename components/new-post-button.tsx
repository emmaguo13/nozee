"use client"

import React, { useEffect } from "react"
import { useRouter } from "next/navigation"
import localforage from "localforage"

import { ecdsaSign, retrievePublicKey } from "@/lib/webcrypto"
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

import { toast } from "./ui/use-toast"

export function NewPostButton() {
  const [body, setBody] = React.useState("")
  const [open, setOpen] = React.useState(false)
  const [title, setTitle] = React.useState("")
  const [isLoading, setIsLoading] = React.useState(false)
  const [domain, setDomain] = React.useState("")
  const router = useRouter()

  useEffect(() => {
    const get = async () => {
      const storedPublicSignals = await localforage.getItem<string[]>(
        "publicSignals"
      )
      if (storedPublicSignals && storedPublicSignals.length > 0) {
        let domain = ""
        for (var i = 0; i < 30; i++) {
          if (storedPublicSignals[i] != "0") {
            let next_char = String.fromCharCode(
              parseInt(storedPublicSignals[i])
            )
            if (next_char != ".") {
              domain += next_char
            } else {
              break
            }
          }
        }
        setDomain(domain)
      }
    }
    get()
  }, [])

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
    // todo: change msgHash to just msgHex, since we're not hashing the message, there's no need
    const storedPubKey = await retrievePublicKey()
    if (!storedPubKey) {
      alert("Please go to the login page to generate a key pair")
      return
    }
    const signatureBuff = await ecdsaSign(body)
    const signature = btoa(
      String.fromCharCode(...new Uint8Array(signatureBuff))
    )
    try {
      const res = await fetch(process.env.NEXT_PUBLIC_BASE_URL + "/api/write", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          title,
          pubkey: storedPubKey,
          body,
          signature,
          postId: "",
        }),
      })
      if (res.status === 200) {
        setOpen(false)
        setTitle("")
        setBody("")
        toast({
          title: "Success!",
          description: "Your post has been created",
        })
        setIsLoading(false)
        router.refresh()
      } else {
        setOpen(false)
        setTitle("")
        setBody("")
        setIsLoading(false)

        const resJson = (await res.json()) as any

        if (resJson.error == "Invalid signature in write") {
          await localforage.removeItem("proof")
          await localforage.removeItem("publicSignals")
          await localforage.removeItem("key")
          toast({
            title: "Posting failed!",
            description:
              "Please go to ChatGPT to retrieve a new token, then go to the login page and reauthenticate.",
          })
          router.push("/login")
        } else {
          toast({
            title: "Posting failed!",
            description: "There was an error with posting.",
          })
        }
      }
    } catch (error) {
      console.log("Error with posting", error)
      setIsLoading(false)
      toast({
        title: "Posting failed!",
        description: "There was an error with posting. Please try again.",
      })
    }
  }

  // TODO: change to form
  return (
    <Dialog onOpenChange={setOpen} open={open}>
      <DialogTrigger asChild>
        <Button onClick={() => setOpen(true)} variant="ghost" size="sm">
          <Icons.add />
          <span className="sr-only">New Post</span>
        </Button>
      </DialogTrigger>
      <DialogContent className="sm:max-w-[425px]">
        <DialogHeader>
          <DialogTitle>Create a Post</DialogTitle>
          <DialogDescription>
            Anonymously post while attesting that you&apos;re from{" "}
            <p className="capitalize">{domain}</p>
          </DialogDescription>
        </DialogHeader>
        <div className="grid gap-4 py-4">
          <div className="grid grid-cols-4 items-center gap-4">
            <Label htmlFor="title" className="text-right">
              Title
            </Label>
            <Input
              id="title"
              value={title}
              onChange={(e) => setTitle(e.target.value)}
              className="col-span-3"
            />
          </div>
          <div className="grid grid-cols-4 items-center gap-4">
            <Label htmlFor="body" className="text-right">
              Body
            </Label>
            <Textarea
              id="body"
              value={body}
              onChange={(e) => setBody(e.target.value)}
              className="col-span-3"
            />
          </div>
        </div>
        <DialogFooter>
          <Button disabled={isLoading} onClick={() => handleSubmit()}>
            {isLoading && (
              <Icons.spinner className="mr-2 h-4 w-4 animate-spin" />
            )}
            Post
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  )
}
