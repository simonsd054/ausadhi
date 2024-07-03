import {
  HydratedDocument,
  Model,
  Schema,
  Types,
  model,
  SchemaTimestampsConfig,
} from "mongoose"

import checkUnique from "../utils/checkUnique"

interface IMedication {
  _id: Types.ObjectId
  name: string
  composition?: string
  type?: string
  dailyFrequency: number
  timings?: string[]
  dosage?: number
}

interface IProfile {
  name: string
  relation?: string
  medication?: IMedication[]
}

type THydratedProfileDocument = HydratedDocument<
  IProfile & SchemaTimestampsConfig,
  { medication?: Types.DocumentArray<IMedication & SchemaTimestampsConfig> }
>

type ProfileModelType = Model<IProfile, {}, {}, {}, THydratedProfileDocument>

const medicationSchema = new Schema<IMedication>(
  {
    name: {
      type: String,
      required: true,
    },
    composition: String,
    type: String,
    dailyFrequency: {
      type: Number,
      required: true,
    },
    timings: [String],
    dosage: Number,
  },
  {
    timestamps: true,
  }
)

const profileSchema = new Schema<IProfile, ProfileModelType>(
  {
    name: {
      type: String,
      required: true,
      validate: {
        validator: async function (v: string) {
          return await checkUnique("Profile", "email", v)
        },
        message: ({ value }: { value: string }) => `${value} already exists`,
      },
    },
    relation: String,
    medication: [medicationSchema],
  },
  {
    timestamps: true,
  }
)

const ProfileModel = model<IProfile, ProfileModelType>("Profile", profileSchema)

export default ProfileModel
