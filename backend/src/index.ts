import express, { Request, Response } from "express"
import mongoose from "mongoose"
import { config } from "dotenv"

import userRouter from "./routes/userRoutes"
import profileRouter from "./routes/profileRoutes"
import errorHandler from "./middlewares/errorHandler"

config()

const app = express()

let port = process.env.PORT || 8000

app.use(express.json())

app.use("/auth", userRouter)
app.use("/profiles", profileRouter)

app.get("/", (req: Request, res: Response) => {
  res.json({
    message: "Hello World!!",
  })
})

app.use(errorHandler)

app.listen(port, () => {
  console.log(`Server running at port ${port}`)
  mongoose.connect(process.env.MONGO_URI as string).then(() => {
    console.log("Database connnected")
  })
})
