import { NextFunction, Request, Response } from "express"
import CustomError from "../utils/customError"

const errorHandler = (
  err: CustomError,
  req: Request,
  res: Response,
  next: NextFunction
) => {
  let error = {}
  if (process.env.NODE_ENV === "development") {
    error = { ...err, stack: err.stack }
  }
  if (err.name === "Custom") {
    const errStatus = err.statusCode
    const errMsg = err.message
    error = {
      ...error,
      status: errStatus,
      message: errMsg,
    }
    return res.status(errStatus).json(error)
  } else {
    const errStatus = 500
    const errMsg = "Something went wrong"
    error = {
      ...error,
      status: errStatus,
      message: errMsg,
    }
    return res.status(errStatus).json(error)
  }
}

export default errorHandler
