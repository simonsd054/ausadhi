import { useParams } from "react-router-dom"
import { useQuery } from "@tanstack/react-query"
import { Card, Spinner, ListGroup, List } from "flowbite-react"

import { getProfile } from "../apis/profile"
import { useState } from "react"
import MedicationFormModal from "../components/MedicationFormModal"

export default function ProfileDetailPage() {
  const [openModal, setOpenModal] = useState(false)

  const params = useParams()

  const { data, isPending, isSuccess, isError } = useQuery({
    queryKey: ["profile", params.id],
    queryFn: () => {
      return getProfile(params.id as string)
    },
  })

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
            <h1 className="text-3xl font-bold mb-10">{data.name}</h1>
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
                              composition: {medication.composition ?? "N/A"}
                            </ListGroup.Item>
                            <ListGroup.Item>
                              type: {medication.type ?? "N/A"}
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
                              dosage: {medication.dosage ?? "N/A"}
                            </ListGroup.Item>
                          </ListGroup>
                        </Card>
                      </div>
                    )
                  })}
                </>
              )}
              <div className="p-10 w-1/3">
                <Card
                  className="max-w-sm flex flex-col items-center justify-center border-dashed text-gray-700 hover:bg-gray-300 hover:cursor-pointer"
                  onClick={() => setOpenModal(true)}
                >
                  <div className="text-center text-6xl font-thin">+</div>
                  <div>Add New Medication</div>
                </Card>
                <MedicationFormModal
                  openModal={openModal}
                  setOpenModal={setOpenModal}
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
