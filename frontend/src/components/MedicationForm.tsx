import { FieldErrors, UseFormRegister } from "react-hook-form"
import FormInput from "./form/FormInput"

export default function MedicationForm({
  register,
  errors,
  index = 0,
  dailyFrequencyValue,
  registerNamePrefix,
  isArrayField = true,
}: {
  /* eslint-disable @typescript-eslint/no-explicit-any */
  register: UseFormRegister<any>
  validation?: object
  errors: FieldErrors
  index?: number
  dailyFrequencyValue: number
  registerNamePrefix?: string
  isArrayField?: boolean
}) {
  return (
    <div>
      <FormInput
        id="name"
        registerName={`${
          registerNamePrefix ? registerNamePrefix + "." : ""
        }name`}
        arrayFieldInfo={
          isArrayField
            ? {
                arrayName: "medications",
                index: index,
                registerName: "name",
              }
            : undefined
        }
        label="Name"
        register={register}
        validation={{
          required: "Name is required",
        }}
        errors={errors}
      />
      <FormInput
        id="composition"
        registerName={`${
          registerNamePrefix ? registerNamePrefix + "." : ""
        }composition`}
        arrayFieldInfo={
          isArrayField
            ? {
                arrayName: "medications",
                index: index,
                registerName: "composition",
              }
            : undefined
        }
        label="Composition"
        register={register}
        errors={errors}
      />
      <FormInput
        id="type"
        registerName={`${
          registerNamePrefix ? registerNamePrefix + "." : ""
        }type`}
        arrayFieldInfo={
          isArrayField
            ? {
                arrayName: "medications",
                index: index,
                registerName: "type",
              }
            : undefined
        }
        label="Type"
        register={register}
        errors={errors}
      />
      <FormInput
        id="dailyFrequency"
        registerName={`${
          registerNamePrefix ? registerNamePrefix + "." : ""
        }dailyFrequency`}
        arrayFieldInfo={
          isArrayField
            ? {
                arrayName: "medications",
                index: index,
                registerName: "dailyFrequency",
              }
            : undefined
        }
        label="Daily Frequency"
        register={register}
        validation={{
          min: {
            value: 0,
            message: "Daily Frequency must be at least 0",
          },
        }}
        errors={errors}
        type="number"
      />
      <div className="flex gap-5 items-center">
        <h1 className="mb-2">Timings:</h1>
        {Number(dailyFrequencyValue) < 1 && "N/A"}
        <div>
          {Array.from(
            Array(Number(dailyFrequencyValue >= 0 ? dailyFrequencyValue : 0))
          ).map((_, timingIndex) => (
            <FormInput
              key={timingIndex}
              insideIndex={timingIndex}
              id="timings"
              arrayName="timings"
              isArray
              validation={{
                required: "Timing is required",
              }}
              registerName={`${
                registerNamePrefix ? registerNamePrefix + "." : ""
              }timings.${timingIndex}`}
              arrayFieldInfo={
                isArrayField
                  ? {
                      arrayName: "medications",
                      index: index,
                      registerName: "timings",
                    }
                  : undefined
              }
              label={`Timing ${timingIndex + 1}`}
              register={register}
              errors={errors}
              type="time"
            />
          ))}
        </div>
      </div>
      <FormInput
        id="dosage"
        registerName={`${
          registerNamePrefix ? registerNamePrefix + "." : ""
        }dosage`}
        arrayFieldInfo={
          isArrayField
            ? {
                arrayName: "medications",
                index: index,
                registerName: "dosage",
              }
            : undefined
        }
        label="Dosage"
        register={register}
        errors={errors}
        type="number"
      />
    </div>
  )
}
