import axios from "axios"

type loginResponseType = {
  token: string
  user: {
    id: string
    email: string
    name: string
  }
}

const loginUser = async (data: any): Promise<loginResponseType> => {
  return (await axios.post("/auth/login", data)).data
}

export { loginUser }
