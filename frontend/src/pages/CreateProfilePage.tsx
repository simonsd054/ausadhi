import { useNavigate } from "react-router"
import { SubmitHandler, useFieldArray, useForm } from "react-hook-form"
import { useMutation } from "@tanstack/react-query"
import { Button, Spinner } from "flowbite-react"

import FormInput from "../components/form/FormInput"
import { createProfile } from "../apis/profile"
import { useGlobalContext } from "../utils/reducer"
import IAxiosError from "../types/error"
import { MedicationFormValues, ProfileFormValues } from "../types/form"
import MedicationForm from "../components/MedicationForm"

export default function CreateProfilePage({
  prevValues,
  isEdit,
}: {
  prevValues: ProfileFormValues
  isEdit: boolean
}) {
  const { dispatch } = useGlobalContext()

  const createProfileMutation = useMutation({
    mutationFn: (variables: ProfileFormValues) => {
      return createProfile(variables)
    },
  })

  const navigate = useNavigate()

  const {
    control,
    register,
    handleSubmit,
    formState: { isSubmitting, errors },
  } = useForm<ProfileFormValues>({
    defaultValues: prevValues,
  })

  const { fields, append, prepend, remove, swap, move, insert } =
    useFieldArray<ProfileFormValues>({
      control,
      name: "medications",
    })

  const onSubmit: SubmitHandler<ProfileFormValues> = async (values) => {
    console.log(values)
    return
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

  return (
    <div className="flex flex-col items-center">
      <h1 className="text-3xl font-bold mb-10">Create Profile</h1>
      <form className="w-6/12" onSubmit={handleSubmit(onSubmit)}>
        <FormInput
          id="name"
          registerName="name"
          label="Name"
          register={register}
          validation={{
            required: "Name is required",
          }}
          errors={errors}
        />
        <FormInput
          id="relation"
          registerName="relation"
          label="Relation"
          register={register}
          errors={errors}
        />
        <div className="flex items-center gap-5 mb-5">
          <div className="font-bold">Medications:</div>
          <Button
            size="sm"
            color="gray"
            onClick={() => append({ medications: "medications" })}
          >
            Add Medication
          </Button>
        </div>
        No Medications. Add by clicking on the Add Medication button.
        {fields.map((field, index) => {
          return (
            <MedicationForm
              key={field.id}
              index={index}
              register={register}
              errors={errors}
            />
          )
        })}
        <Button className="mt-5" disabled={isSubmitting} type="submit">
          {isSubmitting && <Spinner className="mr-1 h-5" />}
          {isEdit ? "Edit Profile" : "Create Profile"}
        </Button>
      </form>
    </div>
  )
}
