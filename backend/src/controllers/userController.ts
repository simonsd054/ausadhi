import { Request, Response } from "express"
import bcrypt from "bcrypt"
import jwt from "jsonwebtoken"

import UserModel, { IUser } from "../database/schemas/user"
import CustomError from "../utils/customError"
import generateEmailVerificationCodeAndExpire from "../utils/generateEmailVerificationCodeAndExpire"
import sendEmail from "../utils/sendEmail"

const registerUser = async (req: Request, res: Response) => {
  const user: IUser = req.body
  const hashedPassword = await bcrypt.hash(user.password, 10)
  const { verificationCode, verificationExpire } =
    generateEmailVerificationCodeAndExpire()
  const userCreated = await UserModel.create({
    ...user,
    password: hashedPassword,
    verificationCode,
    verificationExpire,
  })

  const verificationUrl = `${req.get(
    "origin"
  )}/auth/verifyEmail/${verificationCode}`
  const message = `Please verify your email by clicking the following link: <a href="${verificationUrl}" target="_blank">${verificationUrl}</a>`

  sendEmail(user.email, "Email Verification", message)
  return res.json({
    user: {
      name: userCreated.name,
      email: userCreated.email,
      id: userCreated._id,
    },
  })
}

const sendVerificationLink = async (req: Request, res: Response) => {
  const user: IUser = req.body
  const existingUser = await UserModel.findOne({ email: user.email })
  if (!existingUser) {
    throw new CustomError("User with that email does not exist", 401)
  }
  const isMatch = await bcrypt.compare(user.password, existingUser.password)
  if (!isMatch) {
    throw new CustomError("Password is incorrect", 401)
  }
  const { verificationCode, verificationExpire } =
    generateEmailVerificationCodeAndExpire()

  existingUser.verificationCode = verificationCode
  existingUser.verificationExpire = verificationExpire

  await existingUser.save({ validateBeforeSave: false })

  const verificationUrl = `${req.get(
    "origin"
  )}/auth/verifyEmail/${verificationCode}`
  const message = `Please verify your email by clicking the following link: <a href="${verificationUrl}" target="_blank">${verificationUrl}</a>`

  sendEmail(user.email, "Email Verification", message)
  return res.json({
    user: {
      name: existingUser.name,
      email: existingUser.email,
      id: existingUser._id,
    },
  })
}

const verifyEmail = async (req: Request, res: Response) => {
  const user = await UserModel.findOne({
    verificationCode: req.params.code,
    verificationExpire: { $gt: Date.now() },
  })

  if (!user) {
    throw new CustomError("Invalid or expired token.", 400)
  }

  user.verificationCode = undefined
  user.verificationExpire = undefined
  user.emailVerifiedAt = new Date()

  await user.save({ validateBeforeSave: false })

  const payload = {
    id: user._id,
  }
  const token = jwt.sign(payload, process.env.JWT_SECRET as string)

  return res.json({
    token,
    user: {
      name: user.name,
      email: user.email,
      id: user._id,
    },
  })
}

const loginUser = async (req: Request, res: Response) => {
  const user: IUser = req.body
  const existingUser = await UserModel.findOne({ email: user.email })
  if (!existingUser) {
    throw new CustomError("User with that email does not exist", 401)
  }
  const isMatch = await bcrypt.compare(user.password, existingUser.password)
  if (!isMatch) {
    throw new CustomError("Password is incorrect", 401)
  }
  if (existingUser.verificationCode) {
    throw new CustomError(
      "Please verify the email address first. There should be a link sent to your email. If you want to send the verification link again, click on the 'Send verification link' button",
      401
    )
  }
  const payload = {
    id: existingUser._id,
  }
  const token = jwt.sign(payload, process.env.JWT_SECRET as string)
  return res.json({
    token,
    user: {
      name: existingUser.name,
      email: existingUser.email,
      id: existingUser._id,
    },
  })
}

export { registerUser, verifyEmail, sendVerificationLink, loginUser }
