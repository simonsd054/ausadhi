import { Request, Response } from "express"
import bcrypt from "bcrypt"
import jwt from "jsonwebtoken"

import UserModel, { IUser } from "../database/schemas/user"

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
  //check if username exists
  const existingUser = await UserModel.findOne({ email: user.email })
  if (!existingUser) {
    return res.status(401).json({ error: "username or password is incorrect" })
  }
  //match the password
  const isMatch = await bcrypt.compare(user.password, existingUser.password)
  if (!isMatch) {
    return res.status(401).json({ error: "username or password is incorrect" })
  }
  //create the token
  const payload = {
    id: existingUser._id,
    // is_admin: undefined which translates to false
  }
  const token = jwt.sign(payload, process.env.JWT_SECRET as string)
  //return the token
  return res.json({ token })
}

export { registerUser, loginUser }
