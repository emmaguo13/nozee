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
import { UserAuthForm } from "@/app/login/components/user-auth-form"

export default function AuthenticationPage() {
  const { downloadStatus, downloadProgress } = useApp()
  const searchParams = useSearchParams()
  const token = searchParams?.get("msg")
  return (
    <>
      <div className="container relative grid h-[800px] flex-col items-center justify-center lg:max-w-none lg:grid-cols-2 lg:px-0">
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
        <div className="relative hidden h-full flex-col p-10 text-white sm:flex lg:dark:border-r">
          <div className="absolute inset-0 bg-cover" />
          <div className="relative z-20 hidden items-center text-lg font-medium lg:flex">
            <Command className="mr-2 h-6 w-6" /> nozee
          </div>
          <div className="relative z-20 m-auto">
            <Accordion type="single" collapsible className="w-96">
              <AccordionItem value="item-1">
                <AccordionTrigger>
                  <div className="flex gap-4">
                    {downloadStatus === Status.DOWNLOADED ? (
                      <Icons.thumbsup className="" />
                    ) : (
                      <Icons.close className="" />
                    )}
                    {downloadStatus === Status.DOWNLOADING
                      ? "Downloading proving key"
                      : "Proving key downloaded"}
                  </div>
                </AccordionTrigger>
                <AccordionContent>
                  <div className="flex flex-col gap-4">
                    Proving keys are saved in .zkey format -- they represent a
                    preprocessed and optimized version of the circuit that we
                    will use to generate proofs, all on the client! We do not
                    record or store any data.
                    {downloadStatus === Status.DOWNLOADING ? (
                      <Progress value={downloadProgress} />
                    ) : (
                      <></>
                    )}
                  </div>
                </AccordionContent>
              </AccordionItem>
              <AccordionItem value="item-2">
                <AccordionTrigger>
                  <div className="flex gap-4">
                    {token ? (
                      <Icons.thumbsup className="" />
                    ) : (
                      <Icons.close className="" />
                    )}
                    {token ? "JWT loaded" : "No JWT loaded"}
                  </div>
                </AccordionTrigger>
                <AccordionContent>
                  Follow the steps{" "}
                  <Link href="/help" className="underline">
                    here
                  </Link>{" "}
                  to download the extension to get your JWT.
                </AccordionContent>
              </AccordionItem>
            </Accordion>
          </div>
        </div>
        <div className="hidden sm:flex lg:p-8">
          <div className="mx-auto flex w-full flex-col justify-center space-y-6 sm:w-[350px]">
            <div className="flex flex-col space-y-2 text-center">
              <h1 className="text-2xl font-semibold tracking-tight">
                Authenticate yourself
              </h1>
              <p className="text-sm text-muted-foreground">
                Make sure you have both the items to the left
              </p>
            </div>
            <UserAuthForm />
            <p className="px-8 text-center text-sm text-muted-foreground">
              By clicking continue, you agree to our{" "}
              <Link
                href="/terms"
                className="underline underline-offset-4 hover:text-primary"
              >
                Terms of Service
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
    </>
  )
}
