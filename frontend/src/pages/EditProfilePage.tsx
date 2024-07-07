import { useNavigate } from "react-router"
import { SubmitHandler } from "react-hook-form"
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query"
import { useParams } from "react-router-dom"

import { editProfile, getProfile } from "../apis/profile"
import { useGlobalContext } from "../utils/reducer"
import IAxiosError from "../types/error"
import ProfileForm from "../components/ProfileForm"
import { ProfileFormValues } from "../types/form"
import { Spinner } from "flowbite-react"

export default function EditProfilePage() {
  const { dispatch } = useGlobalContext()

  const params = useParams()

  const queryClient = useQueryClient()

  const { data, isPending } = useQuery({
    queryKey: ["profiles", params.id],
    queryFn: () => {
      return getProfile(params.id as string)
    },
  })

  const editProfileMutation = useMutation({
    mutationFn: (variables: ProfileFormValues) => {
      return editProfile(variables, params.id as string)
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["profiles", params.id] })
    },
  })
  const navigate = useNavigate()

  const onSubmit: SubmitHandler<ProfileFormValues> = async (values) => {
    values.medications = values.medications.map((medication) => ({
      ...medication,
      timings: medication.timings?.filter((timing) => timing !== ""),
    }))

    try {
      await editProfileMutation.mutateAsync(values)
      dispatch({
        type: "showToast",
        data: {
          open: true,
          message: "Profile Edited Successfully",
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
  return isPending ? (
    <div className="flex justify-center">
      <Spinner />
    </div>
  ) : (
    <ProfileForm isEdit prevValues={data} onSubmit={onSubmit} />
  )
}
