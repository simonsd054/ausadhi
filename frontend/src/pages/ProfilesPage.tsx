import { useState } from "react"
import { Link } from "react-router-dom"
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query"
import { Button, Card, Modal, Spinner } from "flowbite-react"
import { HiPencilSquare, HiTrash } from "react-icons/hi2"

import { getProfiles, deleteProfile } from "../apis/profile"
import { useGlobalContext } from "../utils/reducer"
import IAxiosError from "../types/error"

export default function ProfilesPage() {
  const [openModal, setOpenModal] = useState("")

  const { dispatch } = useGlobalContext()

  const { data, isPending, isSuccess, isError } = useQuery({
    queryKey: ["profiles"],
    queryFn: () => {
      return getProfiles()
    },
  })

  const queryClient = useQueryClient()

  const deleteProfileMutation = useMutation({
    mutationFn: (profile_id: string) => {
      return deleteProfile(profile_id)
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["profiles"] })
    },
  })

  const onClickDelete = async (profile_id: string) => {
    try {
      await deleteProfileMutation.mutateAsync(profile_id)
      dispatch({
        type: "showToast",
        data: {
          open: true,
          message: "Profile Deleted Successfully",
        },
      })
      setOpenModal("")
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
      <h1 className="text-3xl font-bold mb-10">Profiles</h1>
      {isError ||
        (!Array.isArray(data) && (
          <h1 className="text-2xl text-red-700">
            Something's wrong! Try again later!
          </h1>
        ))}
      {isPending ? (
        <Spinner />
      ) : (
        isSuccess &&
        Array.isArray(data) && (
          <div
            className={`flex ${
              data.length === 0 && "flex-col"
            } flex-wrap justify-around w-full items-center`}
          >
            {data.length === 0 ? (
              "No Profiles found"
            ) : (
              <>
                {data?.map((profile) => {
                  return (
                    <div key={profile._id} className="p-10 w-1/3">
                      <Card className="max-w-sm hover:bg-gray-300">
                        <Link
                          className="hover:underline"
                          to={`/profiles/${profile._id}`}
                        >
                          <div>
                            <h5 className="text-2xl font-bold tracking-tight text-gray-900 dark:text-white">
                              {profile.name}
                            </h5>
                            <p className="font-normal text-gray-700 dark:text-gray-400">
                              {profile.relation}
                            </p>
                          </div>
                        </Link>
                        <div className="flex justify-around">
                          <Button
                            as={Link}
                            to={`/profiles/${profile._id}/edit`}
                            color="gray"
                            className="hover:bg-slate-100 hover:text-blue-700"
                          >
                            <HiPencilSquare className="h-5 w-5" />
                          </Button>
                          <Button
                            onClick={() => setOpenModal(profile._id)}
                            color="gray"
                          >
                            <HiTrash className="h-5 w-5" />
                          </Button>
                          <Modal
                            show={openModal === profile._id}
                            onClose={() => setOpenModal("")}
                          >
                            <Modal.Header>
                              Are you sure you want to delete this profile named
                              "{profile.name}"?
                            </Modal.Header>
                            <Modal.Footer>
                              <Button
                                onClick={() => onClickDelete(profile._id)}
                              >
                                Yes
                              </Button>
                              <Button
                                color="gray"
                                onClick={() => setOpenModal("")}
                              >
                                No
                              </Button>
                            </Modal.Footer>
                          </Modal>
                        </div>
                      </Card>
                    </div>
                  )
                })}
              </>
            )}
            <div className="p-10 w-1/3">
              <Link to={`/profiles/create`}>
                <Card className="max-w-sm flex flex-col items-center justify-center border-dashed text-gray-700 hover:bg-gray-300 hover:cursor-pointer">
                  <div>
                    <div className="text-center text-6xl font-thin">+</div>
                    <div>Add New Profile</div>
                  </div>
                </Card>
              </Link>
            </div>
          </div>
        )
      )}
    </div>
  )
}
