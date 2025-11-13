import { UserResponse } from "@repo/api/dtos/user.dto"
import { Button } from "@workspace/ui/components/button"

export default async function Page() {
  const helloResponse = await fetch("http://localhost:3000/")
  const helloString = helloResponse.text()
  const user: UserResponse = {
    password: "",
    username: "asd",
  }

  return (
    <div className="flex items-center justify-center min-h-svh">
      <div className="flex flex-col items-center justify-center gap-4">
        <h1 className="text-2xl font-bold">Hello World</h1>
        <Button size="sm">Button</Button>
        <span>{helloString}</span>
      </div>
    </div>
  )
}
