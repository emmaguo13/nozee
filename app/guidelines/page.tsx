"use client"

import Link from "next/link"
import { Command } from "lucide-react"

import { cn } from "@/lib/utils"
import { buttonVariants } from "@/components/ui/button"

export default function GuidelinesPage() {
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
          <div className="mx-auto flex w-full flex-col justify-center space-y-6 sm:w-[800px]">
            <div className="flex flex-col space-y-3">
              <h1 className="text-2xl font-semibold tracking-tight">
                Terms of Service
              </h1>

              <h3 className="text-lg font-semibold tracking-tight">
                We want to curate a safe, yet anonymous space for everyone on
                Nozee. "Services" refers to the Nozee site in the following
                statements. By hitting post, you agree that:
              </h3>
              <p>
                &emsp; <strong>"Content"</strong> refers to content such as
                text, images, or other information that can be posted, uploaded,
                linked to or otherwise made available by You, regardless of the
                form of that content.
              </p>

              <p className="text-base">
                &emsp; We take no responsibility for, and we do not endorse or
                guarantee the accuracy of your Content.
              </p>
              <p className="text-base">
                &emsp; By submitting your Content to the Services, you warrant
                that you have all rights to your Content. You understand that
                you may expose yourself to liability if you post Content without
                having all the necessary rights to it.
              </p>
              <p className="text-base">
                &emsp; We have the rights to delete or remove your Content from
                our Serivces at any time for posting harmful or offensive
                content.
              </p>
              <p className="text-base">
                &emsp; Your Content will be automatically published to Nozee,
                and you may not delete or edit your comment due to our content
                moderation policy.
              </p>
              <p>
                &emsp; Your Content will be tied to your organization, and can
                be seen by anyone through the frontend and our database (as our
                database is public for anyone to read). Your Content will have a
                key attached to it, and every key can be verified by any user.
              </p>
              <h3 className="text-lg font-semibold tracking-tight">
                Content moderation
              </h3>
              <p className="text-base">
                &emsp; Content that is deemed to be offensive, hateful, or
                otherwise inappropriate will be removed.
              </p>
              <p className="text-base">
                &emsp; Published posts that are flagged by the community may be
                removed. A moderator will review all reported posts.
              </p>
            </div>
          </div>
        </div>
      </div>
    </>
  )
}
