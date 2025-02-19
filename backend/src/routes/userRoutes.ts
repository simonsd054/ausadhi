import express from "express"

import {
  loginUser,
  registerUser,
  verifyEmail,
  sendVerificationLink,
} from "../controllers/userController"
import asyncHandler from "../utils/asyncHandler"

const userRouter = express.Router()

userRouter.post("/register", asyncHandler(registerUser))
userRouter.get("/verifyEmail/:code", asyncHandler(verifyEmail))
userRouter.post("/sendVerificationLink", asyncHandler(sendVerificationLink))
userRouter.post("/login", asyncHandler(loginUser))

export default userRouter
