import mongoose from "mongoose"

async function checkUnique(
  model: string,
  field: string,
  data: string
): Promise<boolean> {
  const item = await mongoose.model(model).findOne({ [field]: data })
  return item ? false : true
}

export default checkUnique
