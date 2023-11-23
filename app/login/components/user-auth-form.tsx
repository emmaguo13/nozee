"use client"

import * as React from "react"
import Link from "next/link"
import { useSearchParams } from "next/navigation"
import { Status, useApp } from "@/contexts/AppProvider"
import { ec as EC } from "elliptic"
import localforage from "localforage"

import { generate_inputs } from "@/lib/generate_input"
import { cn } from "@/lib/utils"
import { Button } from "@/components/ui/button"
import { Icons } from "@/components/icons"

interface UserAuthFormProps extends React.HTMLAttributes<HTMLDivElement> {}

export function UserAuthForm({ className, ...props }: UserAuthFormProps) {
  const { downloadStatus, zkey } = useApp()
  const searchParams = useSearchParams()
  const [isLoading, setIsLoading] = React.useState<boolean>(false)
  const [domain, setDomain] = React.useState<string>("")

  // todo: this does not actually fix my error right now
  const [previousProof, setPreviousProof] = React.useState<boolean>(false)

  const token = searchParams?.get("msg")
  const key = searchParams?.get("key")

  async function onSubmit(event: React.SyntheticEvent) {
    event.preventDefault()
    if (!token) return
    setIsLoading(true)

    const storedProof = await localforage.getItem<string>("proof")
    const storedPublicSignals = await localforage.getItem<string[]>(
      "publicSignals"
    )
    const storedKey = await localforage.getItem<string>("key")

    // check if priv and pub keys are also stored
    var storedPrivKey = await localforage.getItem<string>("privkey")
    var storedPubKey = await localforage.getItem<string>("pubkey")

    if (!(storedPrivKey && storedPubKey)) {
      // add an ECDSA public key as public input to the proof
      const ec = new EC("secp256k1")
      var ecKey = ec.genKeyPair()
      storedPubKey = ecKey.getPublic("hex")
      storedPrivKey = ecKey.getPrivate("hex")

      await localforage.setItem("privkey", storedPrivKey)
      await localforage.setItem("pubkey", storedPubKey)
    }

    if (storedProof && storedPublicSignals?.length && storedKey) {
      setPreviousProof(true)
      console.log("Proof found in local storage. Skipping proof generation.")
      const res = await fetch(
        process.env.NEXT_PUBLIC_BASE_URL + "/api/addKey",
        {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify({
            proof: JSON.parse(storedProof),
            publicSignals: storedPublicSignals,
            key: storedKey,
            pubkey: storedPubKey,
          }),
        }
      )
      const { domain, isVerified } = await res.json()
      if (isVerified) {
        console.log(
          `Verification successful. Domain: ${domain}. Is verified: ${isVerified}.`
        )
        setDomain(domain)

        return
      }
    } else {
      const splitToken = token.split(".")

      // todo: add pubkey as a public input!
      const inputs = await generate_inputs(
        splitToken[2],
        splitToken[0] + "." + splitToken[1],
        // TODO: change this
        key as string
      )
      console.log("Generated inputs", inputs)

      console.log("Generating proof...")
      const worker = new Worker("./worker.js")
      worker.postMessage(["fullProve", inputs, zkey])
      worker.onmessage = async function (e) {
        const { proof, publicSignals } = e.data
        console.log("Proof successfully generated", proof)
        await localforage.setItem("proof", JSON.stringify(proof))
        await localforage.setItem("publicSignals", publicSignals)
        await localforage.setItem("key", key)
        const res = await fetch(
          process.env.NEXT_PUBLIC_BASE_URL + "/api/addKey",
          {
            method: "POST",
            headers: {
              "Content-Type": "application/json",
            },
            body: JSON.stringify({
              key: key as string,
              proof,
              publicSignals,
              pubkey: storedPubKey,
            }),
          }
        )
        const { domain, isVerified } = await res.json()
        if (isVerified) {
          setDomain(domain)
          return
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
          disabled={!token || isLoading || downloadStatus !== Status.DOWNLOADED}
          onClick={onSubmit}
        >
          {isLoading ||
            (downloadStatus !== Status.DOWNLOADED && (
              <Icons.spinner className="mr-2 h-4 w-4 animate-spin" />
            ))}
          {downloadStatus === Status.DOWNLOADING
            ? "Getting proving key"
            : !token && !previousProof
            ? "No JWT loaded"
            : !zkey
            ? "No proving key loaded"
            : "Generate proof"}
        </Button>
      )}
    </div>
  )
}
