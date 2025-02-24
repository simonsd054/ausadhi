import express from "express"

import {
  loginUser,
  registerUser,
  verifyEmail,
  sendVerificationLink,
  forgetPassword,
  resetPassword,
} from "../controllers/userController"
import asyncHandler from "../utils/asyncHandler"

const userRouter = express.Router()

userRouter.post("/register", asyncHandler(registerUser))
userRouter.get("/verifyEmail/:code", asyncHandler(verifyEmail))
userRouter.post("/sendVerificationLink", asyncHandler(sendVerificationLink))
userRouter.post("/forget", asyncHandler(forgetPassword))
userRouter.post("/reset/:token", asyncHandler(resetPassword))
userRouter.post("/login", asyncHandler(loginUser))

export default userRouter
