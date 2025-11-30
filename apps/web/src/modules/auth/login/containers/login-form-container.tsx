"use client"
import { zodResolver } from "@hookform/resolvers/zod"
import { useForm } from "react-hook-form"
import { LoginUserDto, loginUserSchema } from "../schemas/login-schemas"
import { Form } from "@workspace/ui/components/form"
import LoginForm from "../components/login-form"
import { signIn } from "next-auth/react"
import { useRouter, useSearchParams } from "next/navigation"
import { toast } from "sonner"
import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@workspace/ui/components/card"
import RHFSubmitButton from "@/components/common/rhf-submit-button"
import { Label } from "@workspace/ui/components/label"
import Link from "next/link"

function LoginFormContainer() {
  const form = useForm<LoginUserDto>({
    resolver: zodResolver(loginUserSchema),
  })
  const router = useRouter()
  const searchParams = useSearchParams()

  const callbackUrl = searchParams.get("callbackUrl") || "/dashboard"
  const handleSubmit = async (data: LoginUserDto) => {
    try {
      const result = await signIn("credentials", {
        email: data.email,
        password: data.password,
        redirect: false,
      })

      if (result?.error) {
        throw new Error(result.error)
      }

      if (result?.ok) {
        toast.success("Authentication successful")
        router.push(callbackUrl)
        router.refresh()
      }
    } catch (error) {
      toast.error(error instanceof Error ? error.message : "Authentication error")
    }
  }

  return (
    <Form {...form}>
      <form onSubmit={form.handleSubmit(handleSubmit)} className="w-full max-w-md mx-auto my-50">
        <Card className="shadow-md border border-muted">
          <CardHeader className="space-y-1 text-center">
            <CardTitle className="text-2xl font-semibold">Admin Login</CardTitle>
            <CardDescription>Sign in to manage OAuth2 clients</CardDescription>
          </CardHeader>

          <CardContent className="space-y-4">
            <LoginForm />
          </CardContent>

          <CardFooter className="flex flex-col gap-4">
            <RHFSubmitButton className="w-full" label="Sign In" />

            <div className="text-sm text-center text-muted-foreground">
              <Label className="flex items-center justify-center gap-1">
                Don't have an account?
                <Link href="/register" className="text-primary hover:underline">
                  Register
                </Link>
              </Label>
            </div>
          </CardFooter>
        </Card>
      </form>
    </Form>
  )
}

export default LoginFormContainer
