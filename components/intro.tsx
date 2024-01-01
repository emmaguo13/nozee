import { cn, getHashColor } from "@/lib/utils"
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card"
import { ReactButton } from "@/components/react-button"

export function Intro() {
  const truncatedMessage =
    "Your completely private platform for candid company conversations, powered by zero knowledge proofs."
  const color = getHashColor("All")
  const fillClassName = `fill-${color}-400`
  const textClassName = `text-${color}-400`
  return (
    <div className="space-y-2">
      <div className=" space-y-1 break-all">
        <CardTitle>
          <div className="break-normal text-xl text-white">
            Your <em>completely private</em> platform for candid company
            conversations, powered by zero knowledge proofs
          </div>
        </CardTitle>
      </div>
      <div>
        {/* <div className="flex space-x-10 text-sm">
        <div className="flex capitalize font-medium">
            Learn
          </div>
          <div className="flex capitalize font-medium">
            Privacy
          </div>
        </div> */}
      </div>
    </div>
  )
}
