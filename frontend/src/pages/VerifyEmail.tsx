import { useQuery } from "@tanstack/react-query"
import { Spinner } from "flowbite-react"
import { useParams } from "react-router-dom"

import { verifyEmail } from "../apis/user"
import { useGlobalContext } from "../utils/reducer"
import IAxiosError from "../types/error"

export default function VerifyEmail() {
  const params = useParams()

  const { dispatch } = useGlobalContext()

  const { data, isPending, isSuccess, isError, error } = useQuery({
    queryKey: ["verifyEmail"],
    queryFn: () => {
      return verifyEmail(params.code)
    },
  })

  if (isSuccess) {
    dispatch({
      type: "setUser",
      data: data.user,
    })
    dispatch({
      type: "setToken",
      data: data.token,
    })
  }

  const errMsg = (error as IAxiosError)?.response?.data?.message

  return (
    <div className="flex flex-col justify-center items-center">
      {(isError || (isSuccess && !data?.token)) && (
        <h1 className="text-2xl text-red-700">
          {errMsg
            ? `${errMsg} Please go to the login page and try again.`
            : "Something's wrong! Try again later!"}
        </h1>
      )}
      {isPending ? <Spinner /> : isSuccess && <>Verifying Email...</>}
    </div>
  )
}
