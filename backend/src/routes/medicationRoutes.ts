import express from "express"

import {
  getAllMedications,
  getMedication,
  createMedication,
  updateMedication,
  deleteMedication,
} from "../controllers/medicationController"
import asyncHandler from "../utils/asyncHandler"
import auth from "../middlewares/auth"

const medicationRouter = express.Router({ mergeParams: true })

medicationRouter.get("/", auth, asyncHandler(getAllMedications))
medicationRouter.get("/:id", auth, asyncHandler(getMedication))
medicationRouter.post("/", auth, asyncHandler(createMedication))
medicationRouter.put("/:id", auth, asyncHandler(updateMedication))
medicationRouter.patch("/:id", auth, asyncHandler(updateMedication))
medicationRouter.delete("/:id", auth, asyncHandler(deleteMedication))

export default medicationRouter
