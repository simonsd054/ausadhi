import { SubmitHandler, useForm } from "react-hook-form"
import { useMutation } from "@tanstack/react-query"
import { Button, Spinner } from "flowbite-react"

import FormInput from "../components/form/FormInput"
import { forgetPassword } from "../apis/user"
import { useGlobalContext } from "../utils/reducer"
import IAxiosError from "../types/error"
import { ForgetPasswordFormValues } from "../types/form"

export default function ForgetPassword() {

  const { dispatch } = useGlobalContext()

  const userMutation = useMutation({
    mutationFn: (values: ForgetPasswordFormValues) => {
      return forgetPassword(values)
    },
  })

  const {
    register,
    handleSubmit,
    formState: { isSubmitting, errors },
  } = useForm<ForgetPasswordFormValues>({
    defaultValues: {
      email: ""
    },
  })

  const onSubmit: SubmitHandler<ForgetPasswordFormValues> = async (values) => {
    try {
      await userMutation.mutateAsync(values)
      dispatch({
        type: "showToast",
        data: {
          open: true,
          message: "Password Reset Link Sent. Check your email.",
        },
      })
    } catch (err) {
      const error = err as IAxiosError
      if (error.response?.data?.name === "Custom") {
        dispatch({
          type: "showToast",
          data: {
            open: true,
            message: error.response?.data?.message,
          },
        })
      } else {
        dispatch({
          type: "showToast",
          data: {
            open: true,
            message: "Something went wrong",
          },
        })
      }
    }
  }

  return (
    <div className="flex flex-col items-center">
      <h1 className="text-3xl font-bold mb-10">Forgot Password</h1>
      <form className="w-6/12" onSubmit={handleSubmit(onSubmit)}>
        <FormInput
          id="email"
          registerName="email"
          label="Email Address"
          register={register}
          validation={{
            required: "Email is required",
            pattern: {
              value: /^[A-Z0-9._%+-]+@[A-Z0-9.-]+\.[A-Z]{2,}$/i,
              message: "Invalid email address format",
            },
          }}
          errors={errors}
        />
        <div className="flex mb-7">
          <Button disabled={isSubmitting} type="submit">
            {isSubmitting && <Spinner className="mr-1 h-5" />}
            Send Password Reset Link
          </Button>
        </div>
      </form>
    </div>
  )
}
