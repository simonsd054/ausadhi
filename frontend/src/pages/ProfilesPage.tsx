import { Link } from "react-router-dom"
import { useQuery } from "@tanstack/react-query"
import { Card, Spinner } from "flowbite-react"

import { getProfiles } from "../apis/profile"

export default function ProfilesPage() {
  const { data, isPending, isSuccess, isError } = useQuery({
    queryKey: ["profiles"],
    queryFn: () => {
      return getProfiles()
    },
  })

  return (
    <div className="flex flex-col justify-center items-center">
      <h1 className="text-3xl font-bold mb-10">Profiles</h1>
      {isError && (
        <h1 className="text-2xl text-red-700">
          Something's wrong! Try again later!
        </h1>
      )}
      {isPending ? (
        <Spinner />
      ) : (
        isSuccess &&
        (data.length === 0 ? (
          "No Profiles found"
        ) : (
          <div className="flex flex-wrap justify-around w-full">
            {data.map((profile) => {
              return (
                <div key={profile._id} className="p-10 w-1/3">
                  <Link to={`/profiles/${profile._id}`}>
                    <Card className="max-w-sm">
                      <h5 className="text-2xl font-bold tracking-tight text-gray-900 dark:text-white">
                        {profile.name}
                      </h5>
                      <p className="font-normal text-gray-700 dark:text-gray-400">
                        {profile.relation}
                      </p>
                    </Card>
                  </Link>
                </div>
              )
            })}
          </div>
        ))
      )}
    </div>
  )
}
