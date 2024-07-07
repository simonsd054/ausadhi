import { SubmitHandler, useForm } from "react-hook-form"
import { Button, Modal } from "flowbite-react"
import { useMutation, useQueryClient } from "@tanstack/react-query"

import { createMedication } from "../apis/profile"
import MedicationForm from "./MedicationForm"
import { MedicationFormValues } from "../types/form"
import { useGlobalContext } from "../utils/reducer"
import IAxiosError from "../types/error"

export default function MedicationFormModal({
  openModal,
  setOpenModal,
  prevValues = {
    name: "",
    dailyFrequency: 0,
  },
  profile_id,
}: {
  openModal: boolean
  setOpenModal: (data: boolean) => void
  prevValues?: MedicationFormValues
  profile_id: string
}) {
  const { dispatch } = useGlobalContext()

  const queryClient = useQueryClient()

  const createMedicationMutation = useMutation({
    mutationFn: (variables: MedicationFormValues) => {
      return createMedication(variables, profile_id)
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["profile", profile_id] })
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
      await createMedicationMutation.mutateAsync(values)
      dispatch({
        type: "showToast",
        data: {
          open: true,
          message: "Medication Created Successfully",
        },
      })
      setOpenModal(false)
      reset()
    } catch (err) {
      console.log(err)
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
    <Modal show={openModal} onClose={() => setOpenModal(false)}>
      <Modal.Header>Terms of Service</Modal.Header>
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
          Add
        </Button>
        <Button
          disabled={isSubmitting}
          color="gray"
          onClick={() => setOpenModal(false)}
        >
          Cancel
        </Button>
      </Modal.Footer>
    </Modal>
  )
}
