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

type THydratedMedicationDocument = HydratedDocument<
  IMedication & SchemaTimestampsConfig,
  { medications?: Types.DocumentArray<IMedication & SchemaTimestampsConfig> }
>

type MedicationModelType = Model<
  IMedication,
  {},
  {},
  {},
  THydratedMedicationDocument
>

interface IProfile {
  name: string
  relation?: string
  userId: Schema.Types.ObjectId
  medications?: IMedication[]
}

type THydratedProfileDocument = HydratedDocument<
  IProfile & SchemaTimestampsConfig,
  { medications?: Types.DocumentArray<IMedication & SchemaTimestampsConfig> }
>

type ProfileModelType = Model<IProfile, {}, {}, {}, THydratedProfileDocument>

const medicationSchema = new Schema<IMedication, MedicationModelType>(
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
    userId: {
      type: Schema.Types.ObjectId,
      ref: "User",
      required: true,
    },
    medications: [medicationSchema],
  },
  {
    timestamps: true,
  }
)

const MedicationModel = model<IMedication, MedicationModelType>(
  "Medication",
  medicationSchema
)

const ProfileModel = model<IProfile, ProfileModelType>("Profile", profileSchema)


export default ProfileModel

export { IProfile, IMedication, MedicationModel }
