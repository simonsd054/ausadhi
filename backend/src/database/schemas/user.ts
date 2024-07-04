import {
  Model,
  Schema,
  model,
  SchemaTimestampsConfig,
  HydratedDocument,
} from "mongoose"

import checkUnique from "../utils/checkUnique"

interface IUser {
  name: string
  email: string
  emailVerifiedAt?: Date
  password: string
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
      validate: {
        validator: async function (v: string) {
          return await checkUnique("User", "email", v)
        },
        message: ({ value }: { value: string }) => `${value} already exists`,
      },
    },
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

const UserModel = model<IUser, UserModelType>("User", userSchema)

export default UserModel

export { IUser }
