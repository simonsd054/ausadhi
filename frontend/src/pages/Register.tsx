import { useNavigate } from "react-router"
import { SubmitHandler, useForm } from "react-hook-form"
import { useMutation } from "@tanstack/react-query"
import { Button, Spinner } from "flowbite-react"

import FormInput from "../components/form/FormInput"
import { registerUser } from "../apis/user"
import { useGlobalContext } from "../utils/reducer"
import IAxiosError from "../types/error"
import { RegisterFormValues } from "../types/form"

export default function Register() {
  const { dispatch } = useGlobalContext()

  const userMutation = useMutation({
    mutationFn: (variables: RegisterFormValues) => {
      return registerUser(variables)
    },
  })

  const navigate = useNavigate()

  const {
    register,
    handleSubmit,
    formState: { isSubmitting, errors },
    trigger,
  } = useForm<RegisterFormValues>({
    defaultValues: {
      name: "",
      email: "",
      password: "",
      confirmPassword: "",
    },
  })

  const onSubmit: SubmitHandler<RegisterFormValues> = async (values) => {
    try {
      const registerResp = await userMutation.mutateAsync(values)
      dispatch({
        type: "setUser",
        data: registerResp.user,
      })
      dispatch({
        type: "setToken",
        data: registerResp.token,
      })
      dispatch({
        type: "showToast",
        data: {
          open: true,
          message: "Verification Code Sent. Please check your mail.",
        },
      })
      // navigate("/")
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
      <h1 className="text-3xl font-bold mb-10">Register</h1>
      <form className="w-6/12" onSubmit={handleSubmit(onSubmit)}>
        <FormInput
          id="name"
          registerName="name"
          label="Full Name"
          register={register}
          validation={{
            required: "Full Name is required",
          }}
          errors={errors}
        />

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

        <FormInput
          id="password"
          registerName="password"
          label="Password"
          register={register}
          validation={{
            required: "Password is required",
            // to trigger the match of password and confirmPassword
            validate: () => {
              trigger("confirmPassword")
              return true
            },
          }}
          errors={errors}
          type="password"
        />

        <FormInput
          id="confirmPassword"
          registerName="confirmPassword"
          label="Confirm Password"
          register={register}
          validation={{
            required: "Confirm Password is required",
            validate: (value: string, formValues: RegisterFormValues) =>
              value === formValues.password ||
              "Password and Confirm Password must match",
          }}
          errors={errors}
          type="password"
        />

        <Button disabled={isSubmitting} type="submit">
          {isSubmitting && <Spinner className="mr-1 h-5" />}
          Register
        </Button>
      </form>
    </div>
  )
}
