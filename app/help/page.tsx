"use client"

import Link from "next/link"
import { Command } from "lucide-react"

import { cn } from "@/lib/utils"
import { buttonVariants } from "@/components/ui/button"

export default function HelpPage() {
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

      <div className="relative hidden h-full flex-col p-10 text-white sm:flex lg:dark:border-r">
        {/* <div className="absolute inset-0 bg-cover" /> */}
        <div className="relative z-20 hidden items-center text-lg font-medium lg:flex">
          <Command className="mr-2 h-6 w-6" /> nozee
        </div>
        {/* <div className="mt-20 hidden sm:flex lg:p-8"> */}
          <div className="mt-20 mx-auto flex w-full flex-col justify-center space-y-6 sm:w-[800px]">
            <div className="flex flex-col space-y-3">
              <h1 className="text-2xl font-semibold tracking-tight">
                Logging into Nozee
              </h1>
              <p className="text-base">
                &emsp; Nozee uses JSON Web Tokens (JWTs), a widely used standard
                for securely transmitting information. When you log in to Nozee,
                you use a JWT obtained from another site, such as ChatGPT, as
                your authentication token. This token contains essential
                information about you, like your email address, securely
                embedded within it. <br />
                <br />
                &emsp; To ensure the integrity and authenticity of the JWT,
                Nozee incorporates a robust zero knowledge proof system. This
                system verifies the token without compromising any sensitive
                information it contains. By performing this verification, we can
                confidently authenticate your identity. Additionally, the email
                address extracted from the JWT forms the basis for determining
                your company affiliation.
              </p>

              <p className="text-base">
                <b>1. </b>
                <Link
                  className="underline"
                  href="https://chromewebstore.google.com/detail/nozee-jwt-login/kmdecbclihhhlabbacccfggjkjopkgjn?hl=en-GB"
                  passHref={true}
                >
                  Download the Nozee extension.
                </Link>{" "}
              </p>
              <p className="text-base">
                <b>2.</b> Log into ChatGPT with your work email.{" "}
              </p>
              <p className="text-base">
                <b>3.</b> Open the extension and click &quot;Login to
                Nozee&quot;. In the extension, you can see the contents of the
                JWT.{" "}
              </p>
              <p className="text-base">
                <b>4.</b> When you're redirected to Nozee, click
                &quot;Authenticate&quot;.{" "}
              </p>
            </div>
          </div>
        {/* </div> */}
      </div>
    </>
  )
}
