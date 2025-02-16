import {
  Model,
  Schema,
  model,
  SchemaTimestampsConfig,
  HydratedDocument,
} from "mongoose"

import checkUnique from "../utils/checkUnique"
import CustomError from "../../utils/customError"

interface IUser {
  name: string
  email: string
  emailVerifiedAt?: Date
  password: string
  verificationCode: String | undefined
  verificationExpire: Date |undefined
}

type THydratedUserDocument = HydratedDocument<IUser & SchemaTimestampsConfig>

type UserModelType = Model<IUser, {}, {}, {}, THydratedUserDocument>

const userSchema = new Schema<IUser, UserModelType>(
  {
    name: {
      type: String,
      required: true,
    },
    email: {
      type: String,
      required: true,
    },
    verificationCode: String,
    verificationExpire: Date,
    emailVerifiedAt: Date,
    password: {
      type: String,
      required: true,
    },
  },
  {
    timestamps: true,
  }
)

userSchema.pre("validate", async function (next) {
  const isUnique = await checkUnique("User", "email", this.email)
  if (!isUnique) {
    next(new CustomError("Email address already exists", 409))
  } else {
    next()
  }
})

const UserModel = model<IUser, UserModelType>("User", userSchema)

export default UserModel

export { IUser }
