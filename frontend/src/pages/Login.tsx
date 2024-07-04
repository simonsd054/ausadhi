import { useNavigate } from "react-router"
import { useForm } from "react-hook-form"
import { useMutation } from "@tanstack/react-query"
import { Button, Spinner } from "flowbite-react"

import FormInput from "../components/form/FormInput"
// import { useToast } from "@/components/ui/use-toast"

import { loginUser } from "../apis/user"
import { useState } from "react"
import { useGlobalContext } from "../utils/reducer"
import Toast from "../components/Toast"
import { AxiosError } from "axios"

export default function Login() {
  const { dispatch } = useGlobalContext()
  const [showToast, setShowToast] = useState(false)
  const [message, setMessage] = useState("")

  const userMutation = useMutation({
    mutationFn: (values) => {
      return loginUser(values)
    },
  })

  const navigate = useNavigate()

  const {
    register,
    handleSubmit,
    formState: { isSubmitting, errors },
  } = useForm({
    defaultValues: {
      email: "",
      password: "",
    },
  })

  const onSubmit = async (values: void) => {
    try {
      const loginResp = await userMutation.mutateAsync(values)
      setMessage("Login Successful")
      setShowToast(true)
      console.log(loginResp.data.user)
      dispatch({
        type: "setUser",
        data: loginResp.data.user,
      })
      dispatch({
        type: "setToken",
        data: loginResp.data.token,
      })
      navigate("/")
    } catch (err) {
      if (err.response.data.name === "Custom") {
        setMessage(err.response.data.message)
        setShowToast(true)
      } else {
        setMessage("Something went wrong!")
        setShowToast(true)
      }
    }
  }

  return (
    <div className="flex flex-col items-center">
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

        <Button disabled={isSubmitting} type="submit">
          {isSubmitting && <Spinner />}
          Login
        </Button>
      </form>
      <Toast
        message={message}
        showToast={showToast}
        onDismiss={() => setShowToast(false)}
      />
    </div>
  )
}
