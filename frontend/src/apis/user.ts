import axios, { AxiosResponse } from "axios"

const loginUser = async (data: any): Promise<AxiosResponse> => {
  return await axios.post("/auth/login", data)
}

export { loginUser }
