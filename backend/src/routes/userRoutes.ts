import express from "express"

import { loginUser, registerUser, verifyUser } from "../controllers/userController"
import asyncHandler from "../utils/asyncHandler"

const userRouter = express.Router()

userRouter.post("/register", asyncHandler(registerUser))
userRouter.get("/verifyemail/:token", asyncHandler(verifyUser))
userRouter.post("/login", asyncHandler(loginUser))

export default userRouter
