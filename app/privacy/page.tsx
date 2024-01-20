"use client"

import Link from "next/link"
import { useSearchParams } from "next/navigation"
import { useApp } from "@/contexts/AppProvider"
import { Command } from "lucide-react"

import { cn } from "@/lib/utils"
import { buttonVariants } from "@/components/ui/button"

export default function AuthenticationPage() {
  const searchParams = useSearchParams()

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
      <div className="relative h-full flex-col p-10 text-white sm:flex lg:dark:border-r">
        <div className="absolute inset-0 bg-cover" />
        <div className="relative z-20 hidden items-center text-lg font-medium lg:flex">
          <Command className="mr-2 h-6 w-6" /> nozee
        </div>
        <div className="mt-20 sm:flex lg:p-8">
          <div className="mx-auto flex w-full flex-col justify-center space-y-6 sm:w-[870px]">
            <div className="flex flex-col space-y-3">
              <h1 className="text-2xl font-semibold tracking-tight">
                Our Privacy Policy
              </h1>
              <p className="text-base">
                &emsp; Privacy is at the core of Nozee. Our site's purpose is to
                provide users a completely private, but verified messaging board
                for honest conversations.
              </p>
              <p className="text-base">
                &emsp; We do not collect any personally identifiable
                information, such as name or email address, in our database
                through our authentication process. In addition,{" "}
                <b>no sensitive information gets revealed to our servers</b>,
                unless you voluntarily post sensitive or personally identifiable
                information through your posts/comments. We do not collect IP or
                device information, and do not store cookies for user
                preferences. We do not host advertisements, and do not use any
                third party analytics tools. We also do not use any of the
                content stored in our database for purposes other than
                displaying it to you.
              </p>
              <h3 className="text-lg font-semibold tracking-tight">
                What information we collect
              </h3>
              <p>
                <em>Account information</em>
              </p>
              <p className="text-base">
                &emsp;<b>1.</b> Your ECDSA public key that is used to verify all
                actions made by you is stored in our database. This key is never
                tied to your identity, and only your organization.
              </p>
              <p className="text-base">
                &emsp;<b>2.</b> Your organization's domain.
              </p>
              <p className="text-base">
                &emsp;<b>3.</b> The proof that can be used to verify that you
                are a part of your organization. Personal information, such as
                your name, email, or the raw JSON Web Token, are private inputs,
                and are NEVER revealed to our server, or stored in our database.
              </p>
              <p>
                <em>Content you submit</em>
              </p>
              <p className="text-base">
                &emsp;The posts, comments, and likes you submit to Nozee are
                stored in our database, and are tied to your public key and your
                organization's domain.
              </p>
              <h3 className="text-lg font-semibold tracking-tight">
                How we authenticate completely privately
              </h3>
              <p className="text-base">
                &emsp; We verify JSON Web Tokens (JWTs) signed by Auth0 from the
                ChatGPT server completely privately using zero-knowledge proofs
                to prove that you own an email with your workplace's domain.
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
