import axios from "axios"

export type getProfilesResponseType = {
  _id: string
  name: string
  relation: string
  userId: string
  medications: string[]
  createdAt: string
  updatedAt: string
}[]

const getProfiles = async (): Promise<getProfilesResponseType> => {
  return (await axios.get("/profiles")).data
}

export { getProfiles }
