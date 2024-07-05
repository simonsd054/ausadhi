import { AxiosError } from "axios"

type AxiosErrorType = {
  message: string
  name: string
  status: number
  statusCode: number
  stack?: string
}

interface IAxiosError extends AxiosError<AxiosErrorType> {}

export default IAxiosError
