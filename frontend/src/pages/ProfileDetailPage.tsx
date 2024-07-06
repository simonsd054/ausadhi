import { useParams } from "react-router-dom"
import { useQuery } from "@tanstack/react-query"
import { Card, Spinner, ListGroup, List } from "flowbite-react"

import { getProfile } from "../apis/profile"

export default function ProfileDetailPage() {
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
            {data.medications.length === 0 ? (
              "No medications found"
            ) : (
              <div className="flex flex-wrap justify-around w-full">
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
                            {medication.timings ? (
                              <List unstyled className="ml-2">
                                {medication.timings.map((timing) => (
                                  <List.Item key={timing}>
                                    {timing}
                                  </List.Item>
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
              </div>
            )}
          </>
        )
      )}
    </div>
  )
}
