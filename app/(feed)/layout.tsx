import { Post } from "@/types"
import * as admin from "firebase-admin"

import { SidebarNav } from "@/components/sidebar-nav"
import { SiteHeader } from "@/components/site-header"

interface MarketingLayoutProps {
  children: React.ReactNode
}

if (!admin.apps.length) {
  admin.initializeApp({
    credential: admin.credential.cert({
      projectId: process.env.NEXT_PUBLIC_PROJECT_ID,
      clientEmail: process.env.FIREBASE_CLIENT_EMAIL,
      privateKey: process.env.FIREBASE_PRIVATE_KEY!.replace(/\\n/g, "\n"),
    }),
  })
}

const db = admin.firestore()

export default async function MarketingLayout({
  children,
}: MarketingLayoutProps) {
  const snapshot = await db
    .collection("posts")
    .orderBy("timestamp", "desc")
    .get()
  const posts = snapshot.docs.map((doc) => doc.data() as Post)
  const domains: string[] = Array.from(
    new Set(posts.map((post: Post) => post.domain))
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
        <div className="space-y-6 p-10 pb-16">
          <div className="flex flex-col justify-center space-y-8 lg:flex-row lg:space-x-12 lg:space-y-0">
            <aside className="-mx-4 lg:w-1/5">
              <SidebarNav items={sidebarNavItems} />
            </aside>
            <div className="flex-1 lg:max-w-2xl">
              <section className="grid items-center gap-6 sm:container">
                <div className="flex flex-col items-start gap-2">
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
