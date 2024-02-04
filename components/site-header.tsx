"use client"

import Link from "next/link"
import { useApp } from "@/contexts/AppProvider"

import { siteConfig } from "@/config/site"
import { buttonVariants } from "@/components/ui/button"
import { MainNav } from "@/components/main-nav"

import { Icons } from "./icons"
import { NewPostButton } from "./new-post-button"

export function SiteHeader() {
  const { proofExists } = useApp()
  return (
    <header className="sticky top-0 z-40 w-full border-b bg-background">
      <div className="container flex h-16 items-center space-x-4 sm:justify-between sm:space-x-0">
        <MainNav items={siteConfig.mainNav} />
        <div className="flex flex-1 items-center justify-end space-x-4">
          <nav className="flex items-center space-x-1">
            <Link href="/login">
              <div
                className={buttonVariants({
                  size: "sm",
                  variant: "ghost",
                })}
              >
                {proofExists ? (
                  <Icons.loggedIn className="h-5 w-5" />
                ) : (
                  <Icons.notLoggedIn className="h-5 w-5" />
                )}
                {proofExists ? (
                  <span>Logged in</span>
                ) : (
                  <span>Not logged in</span>
                )}
              </div>
            </Link>
            <Link
              href={siteConfig.links.github}
              target="_blank"
              rel="noreferrer"
            >
              <div
                className={buttonVariants({
                  size: "sm",
                  variant: "ghost",
                })}
              >
                <Icons.gitHub className="h-5 w-5" />
                <span className="sr-only">GitHub</span>
              </div>
            </Link>
            <NewPostButton />
          </nav>
        </div>
      </div>
    </header>
  )
}
