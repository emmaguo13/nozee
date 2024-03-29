import Link from "next/link"

import { Post } from "@/types"
import { Circle, MessageCircle } from "lucide-react"

import { cn, getHashColor } from "@/lib/utils"
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card"
import { ReactButton } from "@/components/react-button"

export function PostCard({ post, preview }: { post: Post; preview: boolean }) {
  var MAX_LENGTH = 150

  if (!preview) {
    MAX_LENGTH = 500
  }

  const truncatedMessage =
    post.body?.length > MAX_LENGTH
      ? post.body.slice(0, MAX_LENGTH) + "..."
      : post.body
  const color = getHashColor(post.domain)
  const fillClassName = `fill-${color}-400`
  const textClassName = `text-${color}-400`
  return (
    <Card className="min-w-full">
      <CardHeader className="grid grid-cols-[1fr] items-start gap-4 space-y-0">
        <div className=" space-y-1 break-normal">
          <CardTitle>{post.title}</CardTitle>
          <CardDescription>
            <div className="text-white">{truncatedMessage}</div>
          </CardDescription>
        </div>
      </CardHeader>
      <CardContent>
        <div className="flex justify-between">
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
          <div className="flex items-center capitalize">
            <ReactButton color={color} postId={post.id} commentId={""} />
            {post.upvotes ? post.upvotes.length : 0}
          </div>

          <div className="flex items-center capitalize">
            {/* <EditButton color={color} postId={post.id} commentId={""} body={} /> */}
            <MessageCircle
              className={cn("mr-1 h-3 w-3", fillClassName, textClassName)}
            />
            {post.comments ? post.comments.length : 0}
          </div>
        </div>
        <div className="flex  space-x-4 text-sm text-muted-foreground">
          {preview && post.cid ? <Link
              href={`https://ipfs.io/ipfs/${post.cid}`}
              target="_blank"
              rel="noreferrer"
            >
              <div>View in IPFS</div>
            </Link> :
            <div></div>
          }
          
          </div>
        </div>
      </CardContent>
    </Card>
  )
}
