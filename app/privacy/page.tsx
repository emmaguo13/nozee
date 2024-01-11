"use client"

import Link from "next/link"
import { useSearchParams } from "next/navigation"
import { Status, useApp } from "@/contexts/AppProvider"
import { Command, Heading1 } from "lucide-react"

import { cn } from "@/lib/utils"
import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from "@/components/ui/accordion"
import { buttonVariants } from "@/components/ui/button"
import { Progress } from "@/components/ui/progress"
import { Icons } from "@/components/icons"

export default function AuthenticationPage() {
  const { downloadStatus, downloadProgress } = useApp()
  const searchParams = useSearchParams()
  const token = searchParams?.get("msg")

  return (
    <>
      <Link
        href="/"
        className={cn(
          buttonVariants({ variant: "ghost", size: "sm" }),
          "absolute right-4 top-4 z-50 md:right-8 md:top-8"
        )}
      >
        Home
      </Link>
      <div className="sm:hidden">
        <p className="text-sm">
          Please use a desktop browser to login to nozee.
        </p>
      </div>
      <div className="relative hidden h-full flex-col p-10 text-white sm:flex lg:dark:border-r">
        <div className="absolute inset-0 bg-cover" />
        <div className="relative z-20 hidden items-center text-lg font-medium lg:flex">
          <Command className="mr-2 h-6 w-6" /> nozee
        </div>
        <div className="mt-20 hidden sm:flex lg:p-8">
          <div className="mx-auto flex w-full flex-col justify-center space-y-6 sm:w-[870px]">
            <div className="flex flex-col space-y-3">
              <h1 className="text-2xl font-semibold tracking-tight">
                Your privacy is of utmost importance to us.
              </h1>
              <h3 className="text-lg font-semibold tracking-tight">
                Storage of personal information
              </h3>
              <p className="text-base">
                &emsp; We do not store any personally identifiable information
                in our database. In addition,{" "}
                <b>no sensitive information gets revealed to our servers</b>.
              </p>
              <p>We only store:</p>
              <p className="text-base">
                <b>1.</b> Your ECDSA public key that is used to verify all
                actions made by you. This key is never tied to your identity.
              </p>
              <p className="text-base">
                <b>2.</b> Your organization's domain.
              </p>
              <p className="text-base">
                <b>3.</b> The proof and public inputs that can be used to verify
                that you are a part of your organization. Personal information,
                such as your name, email, or the raw JSON Web Token, are private
                inputs, and are NEVER revealed to our server, or stored in our
                database.
              </p>
              <h3 className="text-lg font-semibold tracking-tight">
                How we authenticate
              </h3>
              <p className="text-base">
                &emsp; We verify JSON Web Tokens (JWTs) signed by Auth0 from the ChatGPT
                server completely privately using zero-knowledge proofs to prove
                that you own an email with your workplace's domain.
              </p>
              <p className="text-base">
                &emsp; Our extension extracts your JWT from ChatGPT network
                requests, and passes it as a query parameter to our app. The JWT
                is handled clientside, and never revealed to our servers.
                Instead a zero-knowledge proof is used to verify the signature,
                and output the domain contained within the JWT. Your ECDSA
                public key is tied to the proof, and serves as your Nozee
                identity. However, the public key and the proof are both not
                tied to any personally identifiable information.
              </p>
              <p className="test-base">
                &emsp; Your ECDSA private key is stored in IndexedDB, with the
                extractable feature set to false, meaning a client that is not
                of the https://nozee.xyz origin cannot extract your private key.
              </p>
            </div>
          </div>
        </div>
      </div>
    </>
  )
}
