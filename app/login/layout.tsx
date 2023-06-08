import { Suspense } from "react"

interface MarketingLayoutProps {
  children: React.ReactNode
}

export default async function MarketingLayout({
  children,
}: MarketingLayoutProps) {
  return <Suspense fallback={<div>Loading...</div>}>{children}</Suspense>
}
