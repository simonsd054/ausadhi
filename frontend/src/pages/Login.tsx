import { useState } from "react"
import { useNavigate } from "react-router"
import { SubmitHandler, useForm } from "react-hook-form"
import { useMutation } from "@tanstack/react-query"
import { Button, Spinner } from "flowbite-react"

import FormInput from "../components/form/FormInput"
import { loginUser, sendVerificationLink } from "../apis/user"
import { useGlobalContext } from "../utils/reducer"
import IAxiosError from "../types/error"
import { LoginFormValues } from "../types/form"
import { Link } from "react-router-dom"

export default function Login() {
  const [showVerificationButton, setShowVerificationButton] = useState(false)

  const { dispatch } = useGlobalContext()

  const userMutation = useMutation({
    mutationFn: (values: LoginFormValues) => {
      return loginUser(values)
    },
  })

  const verificationMutation = useMutation({
    mutationFn: (values: LoginFormValues) => {
      return sendVerificationLink(values)
    },
  })

  const navigate = useNavigate()

  const {
    register,
    handleSubmit,
    formState: { isSubmitting, errors },
  } = useForm<LoginFormValues>({
    defaultValues: {
      email: "",
      password: "",
    },
  })

  const onSubmit: SubmitHandler<LoginFormValues> = async (values) => {
    try {
      const loginResp = await userMutation.mutateAsync(values)
      dispatch({
        type: "setUser",
        data: loginResp.user,
      })
      dispatch({
        type: "setToken",
        data: loginResp.token,
      })
      dispatch({
        type: "showToast",
        data: {
          open: true,
          message: "Login Successful",
        },
      })
      navigate("/")
    } catch (err) {
      const error = err as IAxiosError
      if (error.response?.data?.name === "Custom") {
        if (error.response?.data?.message.includes("verification")) {
          setShowVerificationButton(true)
        }
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

  const onClickVerification: SubmitHandler<LoginFormValues> = async (
    values
  ) => {
    try {
      await verificationMutation.mutateAsync(values)
      dispatch({
        type: "showToast",
        data: {
          open: true,
          message: "Verification Link has been sent. Check your email.",
        },
      })
      navigate("/")
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
      <h1 className="text-3xl font-bold mb-10">Login</h1>
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

        <FormInput
          id="password"
          registerName="password"
          label="Password"
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
            Login
          </Button>
          {showVerificationButton && (
            <Button
              disabled={isSubmitting}
              className="ml-5"
              color="gray"
              onClick={handleSubmit(onClickVerification)}
            >
              {isSubmitting && <Spinner className="mr-1 h-5" />}
              Send Verification Link
            </Button>
          )}
        </div>
        <div>
          Forgot Password?{" "}
          <Link
            className="cursor-pointer text-blue-700 hover:underline"
            to="/auth/forgetPassword"
          >
            Click here.
          </Link>
        </div>
      </form>
    </div>
  )
}
