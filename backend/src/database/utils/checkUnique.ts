import mongoose, { Types } from "mongoose"

async function checkUnique(
  model: string,
  field: string,
  data: string,
  id?: Types.ObjectId
): Promise<boolean> {
  const item = await mongoose.model(model).findOne({ [field]: data })
  return !item || item._id.equals(id)
}

export default checkUnique
