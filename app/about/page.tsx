"use client"

import Link from "next/link"
import { useSearchParams } from "next/navigation"
import { Status, useApp } from "@/contexts/AppProvider"
import { Command } from "lucide-react"

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
      {/* <div className="container relative grid h-[800px] flex-col items-center justify-center lg:max-w-none lg:grid-cols-2 lg:px-0"> */}
      <div className="container relative grid h-[800px] flex-col items-center justify-center lg:grid-cols-3  lg:px-0">
        <Link
          href="/"
          className={cn(
            buttonVariants({ variant: "ghost", size: "sm" }),
            "absolute right-4 top-4 md:right-8 md:top-8"
          )}
        >
          Home
        </Link>
        <div className="sm:hidden">
          <p className="text-sm">
            Please use a desktop browser to login to nozee.
          </p>
        </div>
        <div className="relative col-span-2 hidden h-full flex-col p-10 text-white sm:flex lg:dark:border-r">
          {/* <div className="absolute inset-0 bg-cover" /> */}
          <div className="relative z-20 hidden items-center text-lg font-medium lg:flex">
            <Command className="mr-2 h-6 w-6" /> nozee
          </div>
          <div className="mt-20 hidden sm:flex lg:p-8">
            <div className="mx-auto flex w-full flex-col justify-center space-y-6 sm:w-[700px]">
              <div className="flex flex-col space-y-3">
                <h1 className="text-2xl font-semibold tracking-tight">
                  Welcome to Nozee, the private app that lets you speak your
                  mind about your workplace.
                </h1>
                <p className="text-base">
                  &emsp;We verify organization membership by checking that{" "}
                  <b>you own an email with your organization domain</b> without
                  ever seeing your name, email, or anything tied to your
                  identity.
                </p>
                <p>
                  &emsp; We deeply value <b>privacy</b> and <b>verifiability</b>
                  . Our code is open source, and we allow anyone to verify the
                  proof attached to each user.
                </p>
                <p className="text-base"></p>
                <h3 className="text-lg font-semibold tracking-tight">
                  How do we verify your email?
                </h3>
                <p className="text-base">
                  &emsp; After you log into certain websites (such as ChatGPT),
                  they generate a token, called a JSON Web Token (JWT) that
                  contains your email and is a "stamp" of your authentication.
                </p>

                <p className="text-base">
                  &emsp; The JWT from ChatGPT is digitally signed by Auth0, meaning that
                  the site attests to your authentication. We verify the
                  signature on the token to ensure you you own your work email.
                </p>
                <p className="text-base">
                  &emsp; What's unique about Nozee is the JWT verification is
                  done using <b>zero knowledge proofs</b>, a cryptographic
                  technique that allows us to verify certain properties of the
                  JWT without ever seeing the contents of the JWT.
                </p>
                <p className="text-base">
                  &emsp; This means that we never see, or even get the chance to
                  store any personally identifiable information, while being
                  able to verify the validity of your email!
                </p>
              </div>
              <p className="px-8 text-center text-sm text-muted-foreground">
                Learn about our{" "}
                <Link
                  href="/guidelines"
                  className="underline underline-offset-4 hover:text-primary"
                >
                  Community Guidelines
                </Link>{" "}
                and{" "}
                <Link
                  href="/privacy"
                  className="underline underline-offset-4 hover:text-primary"
                >
                  Privacy Policy
                </Link>
                .
              </p>
            </div>
          </div>
        </div>
        <div className="col-span-1 hidden sm:flex lg:p-8">
          <div className="relative z-20 m-auto">
            <Accordion type="single" collapsible className="w-96">
              <AccordionItem value="item-1">
                <AccordionTrigger>
                  <div className="flex gap-4">What is a JWT?</div>
                </AccordionTrigger>
                <AccordionContent>
                  <div className="flex flex-col gap-4">
                    <p className="text-base">
                      {" "}
                      JSON Web Token (JWT) is a standard for transmitting
                      information in a JSON object, and is popularly used for
                      authentication. The information contained in the header
                      and payload is signed, meaning the recipient of the token
                      can verify integrity using ECDSA.
                    </p>

                    <p className="text-base">
                      JWTs consist of a header, payload, and signature, all of
                      which are encoded with URLBase64 encoding and separated by
                      dots.{" "}
                    </p>

                    <p className="text-base"> header.payload.signature </p>

                    <p className="text-base">
                      The JWT payload can include information about the user,
                      such as their name, access status, and email address, as
                      well as information about the token, such as the token
                      issuance time and token expiration time.{" "}
                    </p>

                    <p className="text-base">
                      JWTs are signed by the issuer, and can be verified by the
                      recipient using the public key of the issuer.{" "}
                    </p>
                    <p className="text-base">
                      Learn more here: <a href="https://jwt.io/">jwt.io</a>
                    </p>
                  </div>
                </AccordionContent>
              </AccordionItem>
              <AccordionItem value="item-2">
                <AccordionTrigger>
                  <div className="flex gap-4">
                    What are zero-knowledge proofs?
                  </div>
                </AccordionTrigger>
                <AccordionContent>
                  <div className="flex flex-col gap-4">
                    <p className="text-base">
                      Zero-knowledge proving is a cryptographic technique that
                      allows a prover to claim to a verifier: "I have these
                      private inputs x, such that, after doing some defined
                      computation on x, it will result in y". The verifier
                      ensures that this claim is valid without ever seeing the
                      private inputs.
                    </p>
                    <p className="text-base">
                      Learn more here:{" "}
                      <a href="https://vitalik.ca/general/2021/01/26/snarks.html">
                        An approximate introduction to how zk-SNARKs are
                        possible
                      </a>
                    </p>
                  </div>
                </AccordionContent>
              </AccordionItem>
              <AccordionItem value="item-3">
                <AccordionTrigger>
                  <div className="flex gap-4">
                    Where can I learn more about Nozee?
                  </div>
                </AccordionTrigger>
                <AccordionContent>
                  <div className="flex flex-col gap-4">
                    <p className="text-base">
                      <a href="https://github.com/sehyunc/nozee">App code</a>
                      <br />
                      <a href="https://github.com/emmaguo13/zk-blind">
                        Circuit code
                      </a>
                    </p>
                    <p className="text-base">
                      Read our blog post based on the first iteration (a bit
                      outdated): <a href="https://prove.email/blog/jwt">Post</a>
                    </p>
                  </div>
                </AccordionContent>
              </AccordionItem>
            </Accordion>
          </div>
        </div>
      </div>
    </>
  )
}
