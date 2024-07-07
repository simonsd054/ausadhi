import { useState } from "react"
import { useNavigate, useParams } from "react-router-dom"
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query"
import { Card, Spinner, ListGroup, List, Button, Modal } from "flowbite-react"
import { HiChevronLeft, HiPencilSquare, HiTrash } from "react-icons/hi2"

import { getProfile, deleteMedication } from "../apis/profile"
import MedicationFormModal from "../components/MedicationFormModal"
import { useGlobalContext } from "../utils/reducer"
import IAxiosError from "../types/error"

export default function ProfileDetailPage() {
  const [openAddModal, setOpenAddModal] = useState("")
  const [openEditModal, setOpenEditModal] = useState("")
  const [openDeleteModal, setOpenDeleteModal] = useState("")

  const params = useParams()

  const { dispatch } = useGlobalContext()

  const navigate = useNavigate()

  const { data, isPending, isSuccess, isError } = useQuery({
    queryKey: ["profiles", params.id],
    queryFn: () => {
      return getProfile(params.id as string)
    },
  })

  const queryClient = useQueryClient()

  const deleteMedicationMutation = useMutation({
    mutationFn: (medication_id: string) => {
      return deleteMedication(params.id as string, medication_id)
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["profiles", params.id] })
    },
  })

  const onClickDelete = async (medication_id: string) => {
    try {
      await deleteMedicationMutation.mutateAsync(medication_id)
      dispatch({
        type: "showToast",
        data: {
          open: true,
          message: "Medication Deleted Successfully",
        },
      })
      setOpenDeleteModal("")
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
    <div className="flex flex-col justify-center items-center">
      {isError && (
        <h1 className="text-2xl text-red-700">
          Something's wrong! Try again later!
        </h1>
      )}
      {isPending ? (
        <Spinner />
      ) : (
        isSuccess && (
          <>
            <div className="w-4/5 flex justify-between items-center gap-20 mb-10">
              <div>
                <Button
                  outline
                  color="gray"
                  className="border-none"
                  onClick={() => navigate("/")}
                >
                  <HiChevronLeft className="h-6 w-6" />
                </Button>
              </div>
              <div className="text-3xl font-bold">
                <div>{data.name}</div>
                {data.relation && (
                  <div className="text-lg text-center font-normal">
                    {data.relation}
                  </div>
                )}
              </div>
              <div></div>
            </div>
            <div
              className={`flex ${
                data.medications.length === 0 && "flex-col"
              } flex-wrap justify-around w-full items-center`}
            >
              {data.medications.length === 0 ? (
                <div>No medications found</div>
              ) : (
                <>
                  {data.medications.map((medication) => {
                    return (
                      <div key={medication._id} className="p-10 w-1/3">
                        <Card className="max-w-sm">
                          <h5 className="text-2xl font-bold tracking-tight text-gray-900 dark:text-white">
                            {medication.name}
                          </h5>
                          <ListGroup>
                            <ListGroup.Item>
                              composition: {medication.composition || "N/A"}
                            </ListGroup.Item>
                            <ListGroup.Item>
                              type: {medication.type || "N/A"}
                            </ListGroup.Item>
                            <ListGroup.Item>
                              frequency:{" "}
                              {medication.dailyFrequency
                                ? medication.dailyFrequency + " per day"
                                : "N/A"}
                            </ListGroup.Item>
                            <ListGroup.Item>
                              timings:
                              {medication?.timings &&
                              medication?.timings?.length > 0 ? (
                                <List unstyled className="ml-2">
                                  {medication.timings.map((timing) => (
                                    <List.Item key={timing}>{timing}</List.Item>
                                  ))}
                                </List>
                              ) : (
                                "N/A"
                              )}
                            </ListGroup.Item>
                            <ListGroup.Item>
                              dosage: {medication.dosage || "N/A"}
                            </ListGroup.Item>
                          </ListGroup>
                          <div className="flex justify-around">
                            <Button
                              onClick={() => setOpenEditModal(medication._id)}
                              color="gray"
                            >
                              <HiPencilSquare className="h-5 w-5" />
                            </Button>
                            <Button
                              onClick={() => setOpenDeleteModal(medication._id)}
                              color="gray"
                            >
                              <HiTrash className="h-5 w-5" />
                            </Button>
                            <Modal
                              show={openDeleteModal === medication._id}
                              onClose={() => setOpenDeleteModal("")}
                            >
                              <Modal.Header>
                                Are you sure you want to delete this profile
                                named "{medication.name}"?
                              </Modal.Header>
                              <Modal.Footer>
                                <Button
                                  disabled={deleteMedicationMutation.isPending}
                                  onClick={() => onClickDelete(medication._id)}
                                >
                                  Yes
                                </Button>
                                <Button
                                  color="gray"
                                  onClick={() => setOpenDeleteModal("")}
                                >
                                  No
                                </Button>
                              </Modal.Footer>
                            </Modal>
                          </div>
                        </Card>
                        <MedicationFormModal
                          isEdit
                          medication_id={medication._id}
                          openModal={openEditModal}
                          setOpenModal={setOpenEditModal}
                          profile_id={params.id as string}
                          prevValues={medication}
                        />
                      </div>
                    )
                  })}
                </>
              )}
              <div className="p-10 w-1/3">
                <Card
                  className="max-w-sm flex flex-col items-center justify-center border-dashed text-gray-700 hover:bg-gray-300 hover:cursor-pointer"
                  onClick={() => setOpenAddModal("add")}
                >
                  <div className="text-center text-6xl font-thin">+</div>
                  <div>Add New Medication</div>
                </Card>
                <MedicationFormModal
                  openModal={openAddModal}
                  setOpenModal={setOpenAddModal}
                  profile_id={params.id as string}
                />
              </div>
            </div>
          </>
        )
      )}
    </div>
  )
}
