import { FloatingLabel } from "flowbite-react"

import ErrorMessage from "../ErrorMessage"
import { FieldErrors, UseFormRegister } from "react-hook-form"

export default function FormInput({
  id,
  registerName,
  arrayFieldInfo,
  label,
  register,
  validation = {},
  insideIndex = 0,
  errors,
  isArray = false,
  arrayName,
  ...restProps
}: {
  id: string
  registerName: string
  arrayFieldInfo?: {
    arrayName: string
    index: number
    registerName: string
  }
  label: string
  /* eslint-disable @typescript-eslint/no-explicit-any */
  register: UseFormRegister<any>
  validation?: object
  insideIndex?: number
  errors: FieldErrors
  isArray?: boolean
  arrayName?: string
  /* eslint-disable @typescript-eslint/no-explicit-any */
  [restProps: string]: any
}) {
  let error: { message?: string } = {}
  if (arrayFieldInfo) {
    if ((errors?.[arrayFieldInfo?.arrayName] as any)?.[arrayFieldInfo?.index])
      error = (errors?.[arrayFieldInfo?.arrayName] as any)?.[
        arrayFieldInfo?.index
      ]
    if (isArray && arrayName) {
      error = (error as any)?.[arrayName]?.[insideIndex]
    } else {
      error = (error as any)?.[arrayFieldInfo.registerName]
    }
  } else {
    if (errors[registerName]) {
      error = errors?.[registerName]
    }
    if (isArray && arrayName) {
      error = (errors as any)?.[arrayName]?.[insideIndex]
    }
  }

  return (
    <div className="space-y-2 mb-7">
      <FloatingLabel
        id={id}
        variant="standard"
        label={label}
        {...register(registerName, {
          ...validation,
        })}
        {...restProps}
      />
      {error && <ErrorMessage message={error.message} />}
    </div>
  )
}
