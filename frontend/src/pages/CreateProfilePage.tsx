import { useNavigate } from "react-router"
import { SubmitHandler } from "react-hook-form"
import { useMutation } from "@tanstack/react-query"

import { createProfile } from "../apis/profile"
import { useGlobalContext } from "../utils/reducer"
import IAxiosError from "../types/error"
import ProfileForm from "../components/ProfileForm"
import { ProfileFormValues } from "../types/form"

export default function CreateProfilePage() {
  const { dispatch } = useGlobalContext()

  const createProfileMutation = useMutation({
    mutationFn: (variables: ProfileFormValues) => {
      return createProfile(variables)
    },
  })
  const navigate = useNavigate()

  const onSubmit: SubmitHandler<ProfileFormValues> = async (values) => {
    values.medications = values.medications.map((medication) => ({
      ...medication,
      timings: medication.timings?.filter((timing) => timing !== ""),
    }))

    try {
      await createProfileMutation.mutateAsync(values)
      dispatch({
        type: "showToast",
        data: {
          open: true,
          message: "Profile Created Successfully",
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
  return <ProfileForm onSubmit={onSubmit} />
}
