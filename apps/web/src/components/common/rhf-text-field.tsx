"use client"

import React, { ReactNode, useState } from "react"
import { Controller, useFormContext } from "react-hook-form"
import { Eye, EyeOff } from "lucide-react"
import { Label } from "@workspace/ui/components/label"
import { Input } from "@workspace/ui/components/input"

type TextFieldProps = React.ComponentProps<"input"> & {
  name: string
  label?: string | ReactNode
  required?: boolean
  disableErrorLabel?: boolean
  useCase?: "tel" | "ci" | "card" | "name" | "password"
  description?: string
}

const RHFTextField = ({
  label,
  name,
  required,
  type = "text",
  disableErrorLabel,
  useCase,
  description,
  ...others
}: TextFieldProps) => {
  const { control } = useFormContext()
  const [showPassword, setShowPassword] = useState(false)
  function togglePasswordVisibility() {
    setShowPassword(!showPassword)
  }

  const passwordType = showPassword ? "text" : "password"

  const inputType = useCase === "password" ? passwordType : type

  return (
    <Controller
      render={({ field, fieldState: { error } }) => {
        let renderedLabel: ReactNode = null
        if (label) {
          if (typeof label === "string") {
            renderedLabel = (
              <Label htmlFor={name} className={`${error && "text-destructive"} font-medium `}>
                {label} {required && "*"}
              </Label>
            )
          } else {
            renderedLabel = label
          }
        }
        return (
          <div className="flex flex-col gap-2">
            {renderedLabel}
            <div className="relative">
              <Input
                {...field}
                onChange={(event: React.ChangeEvent<HTMLInputElement>) => {
                  if (type === "number") {
                    field.onChange(Number(event.target.value))
                  } else {
                    switch (useCase) {
                      case "tel":
                        event.target.value = event.target.value.replace(/\D/g, "")
                        if (event.target.value.length > 8) {
                          event.target.value = event.target.value.slice(0, 8)
                        }
                        break
                      case "ci":
                        event.target.value = event.target.value.replace(/\D/g, "")
                        if (event.target.value.length > 11) {
                          event.target.value = event.target.value.slice(0, 11)
                        }
                        break
                      case "card":
                        event.target.value = event.target.value.replace(/\D/g, "")
                        if (event.target.value.length > 16) {
                          event.target.value = event.target.value.slice(0, 16)
                        }
                        break
                      case "name":
                        event.target.value = event.target.value.replace(/[^\p{L}\s]/gu, "")
                        break
                      default:
                        break
                    }
                    field.onChange(event.target.value)
                  }
                }}
                className={`${error && "border-destructive focus-visible:ring-destructive focus-visible:outline-none"}`}
                type={inputType}
                {...others}
              />
              {useCase === "password" && (
                <button
                  type="button"
                  onClick={togglePasswordVisibility}
                  className="absolute inset-y-0 right-0 pr-3 flex items-center text-gray-400 hover:text-gray-500 cursor-pointer"
                >
                  {showPassword ? (
                    <Eye className="h-[1.2rem] w-[1.2rem]" />
                  ) : (
                    <EyeOff className="h-[1.2rem] w-[1.2rem]" />
                  )}
                </button>
              )}
            </div>
            {error && !disableErrorLabel && (
              <Label className="text-destructive text-xs mt-1">{error.message}</Label>
            )}
            {description && (
              <span className="text-muted-foreground text-sm leading-normal">{description}</span>
            )}
          </div>
        )
      }}
      rules={{ required }}
      name={name}
      control={control}
    />
  )
}

export default RHFTextField
