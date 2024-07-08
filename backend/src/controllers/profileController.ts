import { Request, Response } from "express"

import ProfileModel, { IProfile } from "../database/schemas/profile"
import CustomError from "../utils/customError"

const getAllProfiles = async (req: Request, res: Response) => {
  const profiles = await ProfileModel.find({ userId: req.body.user.id })
  return res.json(profiles)
}

const getProfile = async (req: Request, res: Response) => {
  const profile = await ProfileModel.findOne({
    _id: req.params.id,
    userId: req.body.user.id,
  })
  if (!profile) {
    throw new CustomError("Profile not found", 404)
  }
  return res.json(profile)
}

const createProfile = async (req: Request, res: Response) => {
  const profile: IProfile = req.body
  const profileCreated = await ProfileModel.create({
    ...profile,
    userId: req.body.user.id,
  })
  return res.json(profileCreated)
}

const updateProfile = async (req: Request, res: Response) => {
  const profile: IProfile = req.body
  const profileUpdated = await ProfileModel.findOneAndUpdate(
    {
      _id: req.params.id,
      userId: req.body.user.id,
    },
    profile,
    { new: true, runValidators: true }
  )
  if (!profileUpdated) {
    throw new CustomError("Profile couldn't be updated.", 400)
  }
  return res.json(profileUpdated)
}

const deleteProfile = async (req: Request, res: Response) => {
  const profileDeleted = await ProfileModel.findOneAndDelete({
    _id: req.params.id,
    userId: req.body.user.id,
  })
  if (!profileDeleted) {
    throw new CustomError("Profile couldn't be deleted.", 400)
  }
  profileDeleted.deleteOne()
  return res.json(profileDeleted)
}

export {
  getAllProfiles,
  getProfile,
  createProfile,
  updateProfile,
  deleteProfile,
}
