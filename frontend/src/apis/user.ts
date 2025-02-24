import axios from "axios"
import {
  ForgetPasswordFormValues,
  LoginFormValues,
  RegisterFormValues,
  ResetPasswordFormValues,
} from "../types/form"

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

const sendVerificationLink = async (
  data: LoginFormValues
): Promise<LoginRegisterResponseType> => {
  return (await axios.post(`/auth/sendVerificationLink`, data)).data
}

const verifyEmail = async (
  code: String | undefined
): Promise<LoginRegisterResponseType> => {
  return (await axios.get(`/auth/verifyEmail/${code}`)).data
}

const forgetPassword = async (
  data: ForgetPasswordFormValues
): Promise<LoginRegisterResponseType> => {
  return (await axios.post("/auth/forget", data)).data
}

const resetPassword = async (
  data: ResetPasswordFormValues,
  token: string | undefined
): Promise<LoginRegisterResponseType> => {
  return (await axios.post(`/auth/reset/${token}`, data)).data
}

export {
  loginUser,
  registerUser,
  sendVerificationLink,
  verifyEmail,
  forgetPassword,
  resetPassword,
}
