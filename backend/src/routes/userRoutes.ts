import express from "express"

import { loginUser, registerUser } from "../controllers/userController"
import asyncHandler from "../utils/asyncHandler"

const userRouter = express.Router()

userRouter.post("/register", asyncHandler(registerUser))
userRouter.post("/login", asyncHandler(loginUser))

export default userRouter
