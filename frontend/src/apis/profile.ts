import axios from "axios"
import { ProfileFormValues } from "../types/form"

type MedicationType = {
  _id: string
  name: string
  composition?: string
  type?: string
  dailyFrequency: number
  timings?: string[]
  dosage?: number
}

type GetProfileResponseType = {
  _id: string
  name: string
  relation: string
  userId: string
  medications: MedicationType[]
}

type GetProfilesResponseType = GetProfileResponseType[]

const getProfiles = async (): Promise<GetProfilesResponseType> => {
  return (await axios.get("/profiles")).data
}

const getProfile = async (id: string): Promise<GetProfileResponseType> => {
  return (await axios.get(`/profiles/${id}`)).data
}

const createProfile = async (
  data: ProfileFormValues
): Promise<GetProfileResponseType> => {
  return (await axios.post("/profiles", data)).data
}

export { getProfiles, getProfile, createProfile }
