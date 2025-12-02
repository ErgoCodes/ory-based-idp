"use client"

import { useState } from "react"
import { useRouter } from "next/navigation"
import { useForm } from "react-hook-form"
import { z } from "zod"
import { zodResolver } from "@hookform/resolvers/zod"

import {
  Card,
  CardHeader,
  CardTitle,
  CardDescription,
  CardContent,
  CardFooter,
} from "../../../../../../packages/ui/src/components/card"
import {
  Form,
  FormField,
  FormItem,
  FormLabel,
  FormControl,
  FormMessage,
} from "../../../../../../packages/ui/src/components/form"
import { Input } from "../../../../../../packages/ui/src/components/input"
import { Button } from "../../../../../../packages/ui/src/components/button"

const formSchema = z.object({
  email: z.string().email().min(1, "required"),
})

export default function RecoveryPage() {
  const apiUrl = process.env.NEXT_PUBLIC_API_URL
  const router = useRouter()
  const [loading, setLoading] = useState(false)

  const form = useForm<z.infer<typeof formSchema>>({
    resolver: zodResolver(formSchema),
    defaultValues: { email: "" },
  })

  async function onSubmit(values: z.infer<typeof formSchema>) {
    try {
      setLoading(true)
      const response = await fetch(`${apiUrl}/auth/recovery/start`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          email: values.email,
        }),
      })

      if (!response.ok) {
        const errorText = await response.text()
        console.error("[RecoveryPage] Error response:", errorText)
        return
      }

      const result = await response.json()
      console.log("[RecoveryPage] Success response:", result)

      // Expecting result to contain { flowId: string }
      const flowId = result?.value?.flowId || result?.flowId
      if (!flowId) {
        console.error("[RecoveryPage] Missing flowId in response")
        return
      }

      // Redirect to /recovery with flowId as query param
      router.push(`/recovery?flowId=${flowId}`)
    } catch (err) {
      console.error("[RecoveryPage] Exception:", err)
    } finally {
      setLoading(false)
    }
  }

  return (
    <div className="min-h-screen flex items-center justify-center p-4">
      <Card className="max-w-md w-full">
        <CardHeader>
          <CardTitle>Password Recovery</CardTitle>
          <CardDescription>A recovery email will be sent to your account.</CardDescription>
        </CardHeader>
        <CardContent>
          <Form {...form}>
            <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-4">
              <FormField
                control={form.control}
                name="email"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Email</FormLabel>
                    <FormControl>
                      <Input placeholder="Enter your email" {...field} disabled={loading} />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
              <Button type="submit" className="w-full" disabled={loading}>
                {loading ? "Submitting..." : "Submit"}
              </Button>
            </form>
          </Form>
        </CardContent>
        <CardFooter />
      </Card>
    </div>
  )
}
