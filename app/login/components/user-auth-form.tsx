"use client"

import * as React from "react"
import Link from "next/link"
import { useSearchParams } from "next/navigation"
import { Status, useApp } from "@/contexts/AppProvider"
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

  const token = searchParams?.get("msg")

  async function onSubmit(event: React.SyntheticEvent) {
    event.preventDefault()
    if (!token) return
    setIsLoading(true)

    const storedProof = await localforage.getItem<string>("proof")
    const storedPublicSignals = await localforage.getItem<string[]>(
      "publicSignals"
    )
    if (storedProof && storedPublicSignals?.length) {
      console.log("Proof found in local storage. Skipping proof generation.")
      const res = await fetch(
        process.env.NEXT_PUBLIC_BASE_URL + "/api/verify",
        {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify({
            proof: JSON.parse(storedProof),
            publicSignals: storedPublicSignals,
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
      const inputs = await generate_inputs(
        splitToken[2],
        splitToken[0] + "." + splitToken[1],
        // TODO: change this
        "jwt_client"
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
        const res = await fetch(
          process.env.NEXT_PUBLIC_BASE_URL + "/api/verify",
          {
            method: "POST",
            headers: {
              "Content-Type": "application/json",
            },
            body: JSON.stringify({
              key: "openai",
              proof,
              publicSignals,
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
            : !token
            ? "No JWT loaded"
            : !zkey
            ? "No proving key loaded"
            : "Generate proof"}
        </Button>
      )}
    </div>
  )
}
