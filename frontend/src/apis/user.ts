import axios from "axios"
import { LoginFormValues, RegisterFormValues } from "../types/form"

type LoginRegisterResponseType = {
  token: string
  user: {
    id: string
    email: string
    name: string
  }
}

const loginUser = async (
  data: LoginFormValues
): Promise<LoginRegisterResponseType> => {
  return (await axios.post("/auth/login", data)).data
}

const registerUser = async (
  data: RegisterFormValues
): Promise<LoginRegisterResponseType> => {
  return (await axios.post("/auth/register", data)).data
}

export { loginUser, registerUser }
