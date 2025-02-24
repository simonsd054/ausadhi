import { useNavigate, useParams } from "react-router"
import { SubmitHandler, useForm } from "react-hook-form"
import { useMutation } from "@tanstack/react-query"
import { Button, Spinner } from "flowbite-react"

import FormInput from "../components/form/FormInput"
import { resetPassword } from "../apis/user"
import { useGlobalContext } from "../utils/reducer"
import IAxiosError from "../types/error"
import { ResetPasswordFormValues } from "../types/form"

export default function ResetPassword() {
  const { dispatch } = useGlobalContext()

  const params = useParams()

  const userMutation = useMutation({
    mutationFn: (values: ResetPasswordFormValues) => {
      return resetPassword(values, params.token)
    },
  })

  const navigate = useNavigate()

  const {
    register,
    handleSubmit,
    formState: { isSubmitting, errors },
  } = useForm<ResetPasswordFormValues>({
    defaultValues: {
      password: "",
    },
  })

  const onSubmit: SubmitHandler<ResetPasswordFormValues> = async (values) => {
    try {
      await userMutation.mutateAsync(values)
      dispatch({
        type: "showToast",
        data: {
          open: true,
          message: "Password Reset Successful",
        },
      })
      navigate("/auth/login")
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
      <h1 className="text-3xl font-bold mb-10">Reset Password</h1>
      <form className="w-6/12" onSubmit={handleSubmit(onSubmit)}>
        <FormInput
          id="password"
          registerName="password"
          label="Enter new password"
          register={register}
          validation={{
            required: "Password is required",
          }}
          errors={errors}
          type="password"
        />
        <div className="flex mb-7">
          <Button disabled={isSubmitting} type="submit">
            {isSubmitting && <Spinner className="mr-1 h-5" />}
            Reset Password
          </Button>
        </div>
      </form>
    </div>
  )
}
