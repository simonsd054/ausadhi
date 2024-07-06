import { FieldErrors, UseFormRegister } from "react-hook-form"
import FormInput from "./form/FormInput"

export default function MedicationForm({
  register,
  errors,
  index,
}: {
  /* eslint-disable @typescript-eslint/no-explicit-any */
  register: UseFormRegister<any>
  validation?: object
  errors: FieldErrors
  index: number
}) {
  return (
    <div>
      <FormInput
        id="name"
        registerName={`medications.${index}.name`}
        label="Name"
        register={register}
        validation={{
          required: "Name is required",
        }}
        errors={errors}
      />
      <FormInput
        id="composition"
        registerName={`medications.${index}.composition`}
        label="Composition"
        register={register}
        errors={errors}
      />
      <FormInput
        id="type"
        registerName={`medications.${index}.type`}
        label="Type"
        register={register}
        errors={errors}
      />
      <FormInput
        id="dailyFrequency"
        registerName={`medications.${index}.dailyFrequency`}
        label="Daily Frequency"
        register={register}
        validation={{
          required: "Daily Frequency is required",
        }}
        errors={errors}
      />
      <FormInput
        id="timings"
        registerName={`medications.${index}.timings`}
        label="Timings"
        register={register}
        errors={errors}
      />
      <FormInput
        id="dosage"
        registerName={`medications.${index}.dosage`}
        label="Dosage"
        register={register}
        errors={errors}
      />
    </div>
  )
}
