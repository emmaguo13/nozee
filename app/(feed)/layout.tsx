import { BASE_URL } from "@/constants"
import { Post } from "@/types"

import { SiteHeader } from "@/components/site-header"
import { SidebarNav } from "@/app/(feed)/components/sidebar-nav"

interface MarketingLayoutProps {
  children: React.ReactNode
}

export default async function MarketingLayout({
  children,
}: MarketingLayoutProps) {
  const response = await fetch(BASE_URL + "/api/posts", {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify({}),
  })
  const data = await response.json()
  const domains: string[] = Array.from(
    new Set(data.map((post: Post) => post.domain))
  )
  const sidebarNavItems = domains.sort().map((domain: string) => ({
    title: domain,
    href: `/${domain?.toLowerCase()}`,
  }))
  sidebarNavItems.unshift({
    title: "All",
    href: "/",
  })
  return (
    <div className="flex min-h-screen flex-col">
      <SiteHeader />
      <main className="flex-1">
        <div className="hidden space-y-6 p-10 pb-16 md:block">
          <div className="flex flex-col justify-center space-y-8 lg:flex-row lg:space-x-12 lg:space-y-0">
            <aside className="-mx-4 lg:w-1/5">
              <SidebarNav items={sidebarNavItems} />
            </aside>
            <div className="flex-1 lg:max-w-2xl">
              <section className="container grid items-center gap-6">
                <div className="flex max-w-[980px] flex-col items-start gap-2">
                  {children}
                </div>
              </section>
            </div>
          </div>
        </div>
      </main>
    </div>
  )
}
