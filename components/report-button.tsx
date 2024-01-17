"use client"

import { Button } from "@/components/ui/button"

import { toast } from "./ui/use-toast"

export function ReportButton({ postId }: { postId: string }) {
  //   TODO: Should anyone be able to report a post? Or only authenticated with proof?
  const handleClick = async () => {
    const res = await fetch(
      process.env.NEXT_PUBLIC_BASE_URL + "/api/reportPost",
      {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          postId,
        }),
      }
    )

    if (res.status === 200) {
      toast({
        title: "Post reported!",
        description: "Thank you for your feedback.",
      })
    } else {
      toast({
        title: "Error!",
        description: "Something went wrong.",
      })
    }
  }
  return (
    <Button onClick={handleClick} variant="ghost">
      Report
    </Button>
  )
}
