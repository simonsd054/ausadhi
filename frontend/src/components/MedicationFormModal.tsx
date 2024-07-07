import { SubmitHandler, useForm } from "react-hook-form"
import { Button, Modal } from "flowbite-react"
import { useMutation, useQueryClient } from "@tanstack/react-query"

import { createMedication, editMedication } from "../apis/profile"
import MedicationForm from "./MedicationForm"
import { MedicationFormValues } from "../types/form"
import { useGlobalContext } from "../utils/reducer"
import IAxiosError from "../types/error"

export default function MedicationFormModal({
  isEdit = false,
  openModal,
  setOpenModal,
  prevValues = {
    name: "",
    dailyFrequency: 0,
  },
  profile_id,
  medication_id,
}: {
  isEdit?: boolean
  openModal: string
  setOpenModal: (data: string) => void
  prevValues?: MedicationFormValues
  profile_id: string
  medication_id?: string
}) {
  const { dispatch } = useGlobalContext()

  const queryClient = useQueryClient()

  const createMedicationMutation = useMutation({
    mutationFn: (variables: MedicationFormValues) => {
      return createMedication(variables, profile_id)
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["profiles", profile_id] })
    },
  })

  const editMedicationMutation = useMutation({
    mutationFn: (variables: MedicationFormValues) => {
      return editMedication(variables, profile_id, medication_id as string)
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["profiles", profile_id] })
    },
  })

  const {
    register,
    handleSubmit,
    formState: { isSubmitting, errors },
    watch,
    reset,
  } = useForm<MedicationFormValues>({
    defaultValues: prevValues,
  })

  const onClickSubmit: SubmitHandler<MedicationFormValues> = async (
    values: MedicationFormValues
  ) => {
    values.timings = values.timings?.filter((timing) => timing !== "")

    try {
      if (isEdit) {
        await editMedicationMutation.mutateAsync(values)
      } else {
        await createMedicationMutation.mutateAsync(values)
      }
      dispatch({
        type: "showToast",
        data: {
          open: true,
          message: `Medication ${isEdit ? "Edited" : "Created"} Successfully`,
        },
      })
      setOpenModal("")
      if (!isEdit) {
        reset({
          name: "",
          dailyFrequency: 0,
          composition: "",
          dosage: 0,
          timings: [],
          type: "",
        })
      }
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

  const dailyFrequencyValue = watch(`dailyFrequency`)

  return (
    <Modal
      show={Boolean(openModal) && (isEdit ? openModal === medication_id : true)}
      onClose={() => setOpenModal("")}
    >
      <Modal.Header>{isEdit ? "Edit" : "Add"} Medication</Modal.Header>
      <Modal.Body>
        <MedicationForm
          dailyFrequencyValue={dailyFrequencyValue}
          register={register}
          errors={errors}
          isArrayField={false}
        />
      </Modal.Body>
      <Modal.Footer>
        <Button disabled={isSubmitting} onClick={handleSubmit(onClickSubmit)}>
          {isEdit ? "Edit" : "Add"}
        </Button>
        <Button
          disabled={isSubmitting}
          color="gray"
          onClick={() => setOpenModal("")}
        >
          Cancel
        </Button>
      </Modal.Footer>
    </Modal>
  )
}
