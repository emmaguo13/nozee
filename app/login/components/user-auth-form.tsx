"use client"

import * as React from "react"
import Link from "next/link"
import { useSearchParams } from "next/navigation"
import { Status, useApp } from "@/contexts/AppProvider"
import localforage from "localforage"

import { AddKeyReq } from "@/types/requests"
import { generate_inputs } from "@/lib/generate_input"
import { addKey } from "@/lib/requests"
import { cn } from "@/lib/utils"
import { generateAndStoreKey, retrievePublicKey } from "@/lib/webcrypto"
import { Button } from "@/components/ui/button"
import { toast } from "@/components/ui/use-toast"
import { Icons } from "@/components/icons"

interface UserAuthFormProps extends React.HTMLAttributes<HTMLDivElement> {}

export function UserAuthForm({ className, ...props }: UserAuthFormProps) {
  const { downloadStatus, zkey, proofExists } = useApp()
  const searchParams = useSearchParams()
  const [isLoading, setIsLoading] = React.useState<boolean>(false)
  const [domain, setDomain] = React.useState<string>("")

  const token = searchParams?.get("msg")
  const key = searchParams?.get("key")

  async function onSubmit(event: React.SyntheticEvent) {
    event.preventDefault()
    if (!token && !proofExists) return
    setIsLoading(true)

    const storedProof = await localforage.getItem<string>("proof")
    const storedPublicSignals = await localforage.getItem<string[]>(
      "publicSignals"
    )
    const storedKey = await localforage.getItem<string>("key")

    // check if priv and pub keys are also stored
    var pubKey = await retrievePublicKey()

    if (pubKey == "") {
      // add an ECDSA public key as public input to the proof
      await generateAndStoreKey()
      pubKey = await retrievePublicKey()
    }

    if (storedProof && storedPublicSignals?.length && storedKey) {
      console.log("Proof found in local storage. Skipping proof generation.")

      const addKeyInput = {
        proof: JSON.parse(storedProof),
        publicSignals: storedPublicSignals,
        key: storedKey,
        pubkey: pubKey,
      } as AddKeyReq

      try {
        const { domain } = await addKey(addKeyInput)
        console.log(`Verification successful. Domain: ${domain}.`)
        setDomain(domain)
        return
      } catch (error) {
        console.log("Error with verification", error)
      }
    } else {
      const splitToken = (token as string).split(".")

      // todo: add pubkey as a public input!
      const inputs = await generate_inputs(
        splitToken[2],
        splitToken[0] + "." + splitToken[1],
        // TODO: change this
        key as string,
        pubKey
      )
      console.log("Generated inputs", inputs)

      console.log("Generating proof...")
      toast({
        title: "Generating proof...",
        description: "This may take around 25 seconds. Please wait.",
      })
      const worker = new Worker("./worker.js")
      worker.postMessage(["fullProve", inputs, zkey])
      worker.onmessage = async function (e) {
        if (e.data == "Error: Couldn't prove the circuit") {
          setIsLoading(false)
          toast({
            title: "Failed to generate proof",
            description:
              "Please get a new, unexpired JWT or view our about page to contact for help.",
          })
          return
        }
        const { proof, publicSignals } = e.data

        console.log("Public Signals", publicSignals)
        console.log("Proof successfully generated", proof)

        const addKeyInput = {
          proof,
          publicSignals,
          key: key as string,
          pubkey: pubKey,
        } as AddKeyReq

        try {
          const { domain } = await addKey(addKeyInput)
          console.log(`Verification successful. Domain: ${domain}.`)
          setDomain(domain)
          await localforage.setItem("proof", JSON.stringify(proof))
          await localforage.setItem("publicSignals", publicSignals)
          await localforage.setItem("key", key)
          return
        } catch (error) {
          console.log("Error with verification", error)
        }
      }
    }
  }

  return (
    <div className={cn("grid gap-6", className)} {...props}>
      {domain ? (
        <Button asChild>
          <Link href="/">
            Enter nozee as:&nbsp;<span className="capitalize">{domain}</span>
          </Link>
        </Button>
      ) : (
        <Button
          disabled={
            (!token || isLoading || downloadStatus !== Status.DOWNLOADED) 
          }
          onClick={onSubmit}
        >
          {isLoading || downloadStatus !== Status.DOWNLOADED ? (
            <Icons.spinner className="mr-2 h-4 w-4 animate-spin" />
          ) : (
            <div></div>
          )}
          {downloadStatus === Status.DOWNLOADING
            ? "Getting proving key"
            : !token && !proofExists
            ? "No JWT loaded"
            : !zkey
            ? "No proving key loaded"
            : proofExists
            ? "You are logged in"
            : "Authenticate"}
        </Button>
      )}
    </div>
  )
}
