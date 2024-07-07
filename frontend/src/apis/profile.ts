import axios from "axios"
import { MedicationFormValues, ProfileFormValues } from "../types/form"

type GetMedicationResponseType = {
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
  medications: GetMedicationResponseType[]
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

const createMedication = async (
  data: MedicationFormValues,
  profile_id: string
): Promise<GetMedicationResponseType> => {
  return (await axios.post(`/profiles/${profile_id}/medications`, data)).data
}

const editProfile = async (
  data: ProfileFormValues,
  profile_id: string
): Promise<GetProfileResponseType> => {
  return (await axios.patch(`/profiles/${profile_id}`, data)).data
}

const deleteProfile = async (
  profile_id: string
): Promise<GetProfileResponseType> => {
  return (await axios.delete(`/profiles/${profile_id}`)).data
}

export {
  getProfiles,
  getProfile,
  createProfile,
  createMedication,
  editProfile,
  deleteProfile,
}
