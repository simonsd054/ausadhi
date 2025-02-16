import { Request, Response } from "express"
import crypto from "crypto"
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

  // Send verification email
  const verificationUrl = `${req.protocol}://${req.get(
    "origin"
  )}/api/auth/verifyemail/${verificationCode}`
  const message = `Please verify your email by clicking the following link: ${verificationUrl}`

  await sendEmail(user.email, "Email Verification", message)
  // const payload = {
  //   id: userCreated._id,
  // }
  // const token = jwt.sign(payload, process.env.JWT_SECRET as string)
  return res.json({
    user: {
      name: userCreated.name,
      email: userCreated.email,
      id: userCreated._id,
    },
  })
}

const verifyUser = async (req: Request, res: Response) => {
  const hashedToken = crypto
    .createHash("sha256")
    .update(req.params.token)
    .digest("hex")

  const user = await UserModel.findOne({
    verificationCode: hashedToken,
    verificationExpire: { $gt: Date.now() },
  })

  if (!user) {
    throw new CustomError("Invalid or expired token", 400)
  }

  user.verificationCode = undefined
  user.verificationExpire = undefined
  user.emailVerifiedAt = new Date()

  await user.save()

  return res
    .json({ success: true, message: "Email verified successfully" })
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

export { registerUser, verifyUser, loginUser }
