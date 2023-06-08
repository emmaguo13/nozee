import { Post } from "@/types"
import { Circle } from "lucide-react"

import { cn, getHashColor } from "@/lib/utils"
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card"

export function PostCard({ post }: { post: Post }) {
  const MAX_LENGTH = 200
  const truncatedMessage =
    post.body?.length > MAX_LENGTH
      ? post.body.slice(0, MAX_LENGTH) + "..."
      : post.body
  const color = getHashColor(post.domain)
  const fillClassName = `fill-${color}-400`
  const textClassName = `text-${color}-400`
  return (
    <Card>
      <CardHeader className="grid grid-cols-[1fr] items-start gap-4 space-y-0">
        <div className="w-[500px] space-y-1 break-all">
          <CardTitle>{post.title}</CardTitle>
          <CardDescription>
            <div className="text-white">{truncatedMessage}</div>
          </CardDescription>
        </div>
      </CardHeader>
      <CardContent>
        <div className="flex  space-x-4 text-sm text-muted-foreground">
          <div className="flex items-center capitalize">
            <Circle
              className={cn("mr-1 h-3 w-3", fillClassName, textClassName)}
            />
            {post.domain}
          </div>
          <div>
            {new Date(post.timestamp).toLocaleDateString("en-us", {
              year: "numeric",
              month: "short",
              day: "numeric",
            })}
          </div>
        </div>
      </CardContent>
    </Card>
  )
}
