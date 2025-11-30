// app/page.tsx
import { redirect } from "next/navigation"
import { getServerSession } from "next-auth"
import { authOptions } from "@/lib/auth/auth-config"
import ActionsSection from "../components/action-section"
import EndpointsCard from "../components/endpoints-card"
import HeroSection from "../components/hero-section"
export default async function HomePage() {
  const session = await getServerSession(authOptions)

  if (session) {
    redirect("/dashboard")
  }

  return (
    <div className="items-center justify-center bg-background px-4">
      <div className="flex flex-col items-center justify-center gap-6 text-center max-w-2xl">
        <HeroSection />
        <ActionsSection />
        <EndpointsCard />
      </div>
    </div>
  )
}
