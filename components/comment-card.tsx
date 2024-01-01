import { Comment } from "@/types"
import { Circle, ThumbsUp } from "lucide-react"

import { cn, getHashColor } from "@/lib/utils"
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
} from "@/components/ui/card"
import { ReactButton } from "@/components/react-button"

export function CommentCard({
  comment,
  postId,
}: {
  comment: Comment
  postId: string
}) {
  const MAX_LENGTH = 200
  const truncatedMessage =
    comment.comment?.length > MAX_LENGTH
      ? comment.comment.slice(0, MAX_LENGTH) + "..."
      : comment.comment
  const color = getHashColor(comment.domain)
  const fillClassName = `fill-${color}-400`
  const textClassName = `text-${color}-400`
  return (
    <Card className="min-w-full">
      <CardHeader className="grid grid-cols-[1fr] items-start gap-4 space-y-0">
        <div className=" space-y-1 break-normal">
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
            {comment.domain}
          </div>
          <div>
            {new Date(comment.timestamp).toLocaleDateString("en-us", {
              year: "numeric",
              month: "short",
              day: "numeric",
            })}
          </div>
          <div className="flex items-center capitalize">
            <ReactButton color={color} postId={postId} commentId={comment.id} />
            {comment.upvotes ? comment.upvotes.length : 0}
          </div>
        </div>
      </CardContent>
    </Card>
  )
}
