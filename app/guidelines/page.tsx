"use client"

import Link from "next/link"
import { Command } from "lucide-react"

import { cn } from "@/lib/utils"
import { buttonVariants } from "@/components/ui/button"

export default function AuthenticationPage() {
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
        <div className="absolute inset-0 bg-cover" />
        <div className="relative z-20 hidden items-center text-lg font-medium lg:flex">
          <Command className="mr-2 h-6 w-6" /> nozee
        </div>
        <div className="mt-20 hidden sm:flex lg:p-8">
          <div className="mx-auto flex w-full flex-col justify-center space-y-6 sm:w-[800px]">
            <div className="flex flex-col space-y-3">
              <h1 className="text-2xl font-semibold tracking-tight">
                We want to curate a safe, yet anonymous space for everyone on
                Nozee.
              </h1>
              <h3 className="text-lg font-semibold tracking-tight">
                By hitting post, you agree that:
              </h3>
              <p className="text-base">
                &emsp; Your post or comment will be automatically published to
                Nozee, and you may not delete or edit your comment due to our
                content moderation policy.
              </p>
              <p>
                &emsp; Your post will be tied to your organization, and can be
                seen by anyone through the frontend and our database (as our
                database is public for anyone to read). Your post will have a
                key attached to it, and every key can be verified by any user.
              </p>
              <h3 className="text-lg font-semibold tracking-tight">
                Content moderation
              </h3>
              <p className="text-base">
                &emsp; Posts that are deemed to be offensive, hateful, or
                otherwise inappropriate will be removed.
              </p>
              <p className="text-base">
                &emsp; A moderator will review each post and decide whether to
                publish the post or not. Published posts that are flagged by the
                community may be removed.
              </p>
            </div>
          </div>
        </div>
      </div>
    </>
  )
}
