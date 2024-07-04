import { Request, Response, NextFunction } from "express"
import CustomError from "../utils/customError"

import jwt from "jsonwebtoken"

function auth(req: Request, res: Response, next: NextFunction) {
  try {
    let token = req.get("authorization")
    token = token?.split(" ")?.[1]
    if (!token) {
      throw new Error()
    }
    const payload = jwt.verify(token, process.env.JWT_SECRET as string)
    req.body.user = payload
    if (!req.body.user.id) {
      throw new Error()
    }
    next()
  } catch (err) {
    throw new CustomError("Unauthenticated", 401)
  }
}

export default auth
