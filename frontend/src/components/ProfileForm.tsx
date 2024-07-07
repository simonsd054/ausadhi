import { useFieldArray, useForm } from "react-hook-form"
import { Button, Card, Spinner } from "flowbite-react"
import { HiTrash } from "react-icons/hi2"

import FormInput from "../components/form/FormInput"

import { ProfileFormValues } from "../types/form"
import MedicationForm from "../components/MedicationForm"

export default function ProfileForm({
  prevValues,
  isEdit = false,
  onSubmit,
}: {
  prevValues?: ProfileFormValues
  isEdit?: boolean
  onSubmit: (values: ProfileFormValues) => void
}) {
  const {
    control,
    register,
    handleSubmit,
    formState: { isSubmitting, errors },
    watch,
  } = useForm<ProfileFormValues>({
    defaultValues: prevValues,
  })

  const { fields, append, remove } = useFieldArray<ProfileFormValues>({
    control,
    name: "medications",
  })

  return (
    <div className="flex flex-col items-center">
      <h1 className="text-3xl font-bold mb-10">
        {isEdit ? "Edit " : "Create "}Profile
      </h1>
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
        {!isEdit && (
          <>
            <div className="flex items-center gap-5 mb-5">
              <div className="font-bold text-xl">Medications:</div>
            </div>
            {fields.length === 0 &&
              "No Medications. Add by clicking on the Add Medication button."}
            {fields.map((field, index) => {
              const dailyFrequencyValue = watch(
                `medications.${index}.dailyFrequency`
              )
              return (
                <Card key={field.id} className="mb-5">
                  <div className="flex justify-between items-center">
                    <h5 className="text-lg font-bold tracking-tight text-gray-900 dark:text-white">
                      Medication {index + 1}
                    </h5>
                    <Button color="gray" onClick={() => remove(index)}>
                      <HiTrash className="h-5 w-5 mr-2" /> Remove
                    </Button>
                  </div>
                  <MedicationForm
                    index={index}
                    register={register}
                    errors={errors}
                    dailyFrequencyValue={dailyFrequencyValue}
                    registerNamePrefix={`medications.${index}`}
                  />
                </Card>
              )
            })}
            <Button
              size="sm"
              color="gray"
              onClick={() =>
                append({
                  name: "",
                  dailyFrequency: 0,
                })
              }
            >
              Add {fields.length !== 0 && "More"} Medication
            </Button>
          </>
        )}
        <Button className="mt-5" disabled={isSubmitting} type="submit">
          {isSubmitting && <Spinner className="mr-1 h-5" />}
          {isEdit ? "Edit Profile" : "Create Profile"}
        </Button>
      </form>
    </div>
  )
}
