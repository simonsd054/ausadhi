import { Request, Response } from "express"
import bcrypt from "bcrypt"
import jwt from "jsonwebtoken"

import UserModel, { IUser } from "../database/schemas/user"
import CustomError from "../utils/customError"

const registerUser = async (req: Request, res: Response) => {
  const user: IUser = req.body
  const hashedPassword = await bcrypt.hash(user.password, 10)
  const userCreated = await UserModel.create({
    ...user,
    password: hashedPassword,
  })
  const payload = {
    id: userCreated._id,
  }
  const token = jwt.sign(payload, process.env.JWT_SECRET as string)
  return res.json({ token })
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
  return res.json({ token })
}

export { registerUser, loginUser }
