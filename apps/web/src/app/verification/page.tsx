"use client"
import { z } from "zod"
import { useSearchParams } from "next/navigation"
import { toast } from "sonner"
import { Button } from "../../../../../packages/ui/src/components/button"
import {
  InputOTP,
  InputOTPGroup,
  InputOTPSlot,
} from "../../../../../packages/ui/src/components/input-otp"
import {
  Form,
  FormControl,
  FormItem,
  FormLabel,
  FormField,
  FormMessage,
} from "../../../../../packages/ui/src/components/form"
import { useRouter } from "next/navigation"
import { zodResolver } from "@hookform/resolvers/zod"
import { useForm } from "react-hook-form"

export const verificationFormSchema = z.object({
  code: z
    .string()
    .min(1, { message: "Verification code is required" })
    .length(6, { message: "Verification code must be 6 digits" }),
})

export type VerificationFormValues = z.infer<typeof verificationFormSchema>

const NewVerificationPage = () => {
  const apiUrl = process.env.NEXT_PUBLIC_API_URL
  const router = useRouter()
  const searchParams = useSearchParams()
  const flowId = searchParams.get("flow")
  const form = useForm<VerificationFormValues>({
    resolver: zodResolver(verificationFormSchema),
    defaultValues: { code: "" },
  })

  const onSubmit = async (values: VerificationFormValues) => {
    if (!flowId) {
      toast.error("No se encontró el ID del flujo en la URL")

      return
    }
    try {
      const response = await fetch(`${apiUrl}/auth/complete-email-verification`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          flowId: flowId,
          code: values.code,
        }),
      })

      const res = await response.text()
      console.log(res)

      toast.success("success")
      router.push("/")
    } catch (err) {
      console.error(err)
      toast.error("error")
    }
  }
  return (
    <div className="max-w-md mx-auto mt-36">
      <h1 className="text-xl font-semibold text-center mb-4">
        An email with a verification code has been sent to you
      </h1>
      <Form {...form}>
        <form
          onSubmit={form.handleSubmit(onSubmit)}
          className="space-y-6 flex flex-col justify-center items-center"
        >
          <FormField
            control={form.control}
            name="code"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Enter verification code</FormLabel>
                <FormControl>
                  <InputOTP maxLength={6} value={field.value} onChange={field.onChange}>
                    <InputOTPGroup>
                      <InputOTPSlot index={0} />
                      <InputOTPSlot index={1} />
                      <InputOTPSlot index={2} />
                      <InputOTPSlot index={3} />
                      <InputOTPSlot index={4} />
                      <InputOTPSlot index={5} />
                    </InputOTPGroup>
                  </InputOTP>
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />
          <Button type="submit" className="w-full">
            Verify
          </Button>
        </form>
      </Form>
    </div>
  )
}

export default NewVerificationPage
