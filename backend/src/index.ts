import express, { Request, Response } from "express"
import mongoose from "mongoose"
import { config } from "dotenv"
import path from "path"
import cors from "cors"

import userRouter from "./routes/userRoutes"
import profileRouter from "./routes/profileRoutes"
import errorHandler from "./middlewares/errorHandler"

config()

const app = express()

let port = process.env.PORT || 8000

app.use(cors())

app.use(express.json())

app.use("/api/auth", userRouter)
app.use("/api/profiles", profileRouter)

app.use(errorHandler)

app.use(express.static(path.resolve(__dirname, "..", "dist")))
app.get("*", (req, res) => {
  res.sendFile(path.join(__dirname, "..", "dist/index.html"))
})

app.listen(port, () => {
  console.log(`Server running at port ${port}`)
  mongoose.connect(process.env.MONGO_URI as string).then(() => {
    console.log("Database connnected")
  })
})
