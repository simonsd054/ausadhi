import { FloatingLabel } from "flowbite-react"

import ErrorMessage from "../ErrorMessage"
import { FieldErrors, UseFormRegister } from "react-hook-form"

export default function FormInput({
  id,
  registerName,
  label,
  register,
  validation = {},
  errors,
  ...restProps
}: {
  id: string
  registerName: string
  label: string
  /* eslint-disable @typescript-eslint/no-explicit-any */
  register: UseFormRegister<any>
  validation?: object
  errors: FieldErrors
  /* eslint-disable @typescript-eslint/no-explicit-any */
  [restProps: string]: any
}) {
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
      {errors[registerName] && (
        <ErrorMessage message={errors?.[registerName]?.message} />
      )}
    </div>
  )
}
