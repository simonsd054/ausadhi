import express, { Request, Response } from "express"
import mongoose from "mongoose"
import { config } from "dotenv"
import cors from "cors"

import userRouter from "./routes/userRoutes"
import profileRouter from "./routes/profileRoutes"
import errorHandler from "./middlewares/errorHandler"

config()

const app = express()

let port = process.env.PORT || 8000

app.use(
  cors({
    origin: [process.env.FRONTEND_ENDPOINT as string], // the origin that we want to accept, i.e. our frontend
    optionsSuccessStatus: 200,
  })
)

app.use(express.json())

app.use("/api/auth", userRouter)
app.use("/api/profiles", profileRouter)

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
