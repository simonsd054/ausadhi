import {
  HydratedDocument,
  Model,
  Schema,
  Types,
  model,
  SchemaTimestampsConfig,
} from "mongoose"

import checkUnique from "../utils/checkUnique"
import CustomError from "../../utils/customError"

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

medicationSchema.pre("save", function (next) {
  if (this.dailyFrequency !== this.timings?.length) {
    next(
      new CustomError(
        "Timings length must be equal to daily frequency value",
        400
      )
    )
  } else {
    next()
  }
})

const profileSchema = new Schema<IProfile, ProfileModelType>(
  {
    name: {
      type: String,
      required: true,
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

profileSchema.pre("save", async function (next) {
  const isUnique = await checkUnique("Profile", "name", this.name)
  if (!isUnique) {
    next(new CustomError("Profile with this name already exists", 409))
  } else {
    next()
  }
})

const MedicationModel = model<IMedication, MedicationModelType>(
  "Medication",
  medicationSchema
)

const ProfileModel = model<IProfile, ProfileModelType>("Profile", profileSchema)

export default ProfileModel

export { IProfile, IMedication, MedicationModel }
