import { Request, Response } from "express"

import { IMedication, MedicationModel } from "../database/schemas/profile"
import CustomError from "../utils/customError"
import ProfileModel from "../database/schemas/profile"

const getAllMedications = async (req: Request, res: Response) => {
  const profile = await ProfileModel.findOne({
    _id: req.params.profile_id,
    userId: req.body.user.id,
  })
  if (!profile) {
    throw new CustomError("Profile for the medication not found", 404)
  }
  return res.json(profile?.medications)
}

const getMedication = async (req: Request, res: Response) => {
  const profile = await ProfileModel.findOne({
    _id: req.params.profile_id,
    userId: req.body.user.id,
  })
  if (!profile) {
    throw new CustomError("Profile for the medication not found", 404)
  }
  const medication = profile?.medications?.find(
    (medication) => String(medication._id) === req.params.id
  )
  if (!medication) {
    throw new CustomError("Medication not found", 404)
  }
  return res.json(medication)
}

const createMedication = async (req: Request, res: Response) => {
  const medication: IMedication = req.body
  const profile = await ProfileModel.findOne({
    _id: req.params.profile_id,
    userId: req.body.user.id,
  })
  if (!profile) {
    throw new CustomError("Profile for the medication not found", 404)
  }
  const medicationCreated = new MedicationModel(medication)
  profile.medications?.push(medicationCreated)
  await profile.save()
  return res.json(medicationCreated)
}

const updateMedication = async (req: Request, res: Response) => {
  const medication: IMedication = req.body
  const profile = await ProfileModel.findOne({
    _id: req.params.profile_id,
    userId: req.body.user.id,
  })
  if (!profile) {
    throw new CustomError("Profile for the medication not found.", 404)
  }
  let medicationUpdated = profile.medications?.id(req.params.id)
  if (!medicationUpdated) {
    throw new CustomError("Medication not found", 404)
  }
  medicationUpdated?.$set(medication)
  medicationUpdated = profile?.medications?.find(
    (medication) => String(medication._id) === req.params.id
  )
  await profile.save()
  return res.json(medicationUpdated)
}

const deleteMedication = async (req: Request, res: Response) => {
  const medication: IMedication = req.body
  const profile = await ProfileModel.findOne({
    _id: req.params.profile_id,
    userId: req.body.user.id,
  })
  if (!profile) {
    throw new CustomError("Profile for the medication not found.", 404)
  }
  const medicationDeleted = profile.medications?.id(req.params.id)
  if (!medicationDeleted) {
    throw new CustomError("Medication not found", 404)
  }
  await medicationDeleted?.deleteOne()
  await profile.save()
  return res.json(medicationDeleted)
}

export {
  getAllMedications,
  getMedication,
  createMedication,
  updateMedication,
  deleteMedication,
}
