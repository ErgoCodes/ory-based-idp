import { LoggedOutCard } from "../../../modules/oauth/components/logged-out-card"

export default function LoggedOutPage() {
  return (
    <div className="flex min-h-screen items-center justify-center bg-background p-4">
      <LoggedOutCard />
    </div>
  )
}
