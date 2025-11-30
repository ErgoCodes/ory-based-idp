import { Button } from "@workspace/ui/components/button"
import Link from "next/link"

export default function ActionsSection() {
  return (
    <div className="flex gap-4 mt-4 justify-center">
      <Button size="lg">
        <Link href={"/login"}>Admin Login</Link>
      </Button>

      <Button size="lg" variant="outline">
        <Link href={"/register"}>Register</Link>
      </Button>
    </div>
  )
}
