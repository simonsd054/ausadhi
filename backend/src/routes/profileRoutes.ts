import express from "express"

import {
  getAllProfiles,
  getProfile,
  createProfile,
  updateProfile,
  deleteProfile,
} from "../controllers/profileController"
import asyncHandler from "../utils/asyncHandler"
import auth from "../middlewares/auth"
import medicationRouter from "./medicationRoutes"

const profileRouter = express.Router()

profileRouter.use("/:profile_id/medications", medicationRouter)

profileRouter.get("/", auth, asyncHandler(getAllProfiles))
profileRouter.get("/:id", auth, asyncHandler(getProfile))
profileRouter.post("/", auth, asyncHandler(createProfile))
profileRouter.put("/:id", auth, asyncHandler(updateProfile))
profileRouter.patch("/:id", auth, asyncHandler(updateProfile))
profileRouter.delete("/:id", auth, asyncHandler(deleteProfile))

export default profileRouter
