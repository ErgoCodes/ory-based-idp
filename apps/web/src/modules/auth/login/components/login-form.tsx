import RHFTextField from "@/components/common/rhf-text-field"
import React from "react"

function LoginForm() {
  return (
    <div className=" flex flex-col gap-4">
      <RHFTextField name="email" label="Email" required placeholder="Enter your email..." />
      <RHFTextField
        name="password"
        type="password"
        label="Password"
        useCase="password"
        placeholder="Enter your password..."
        required
      />
    </div>
  )
}

export default LoginForm
