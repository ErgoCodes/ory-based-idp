import RHFTextField from "@/components/common/rhf-text-field"
import React from "react"

function LoginForm() {
  return (
    <div className=" flex flex-col gap-4">
      <RHFTextField name="email" label="Email" required />
      <RHFTextField name="password" label="Contraseña" required />
    </div>
  )
}

export default LoginForm
