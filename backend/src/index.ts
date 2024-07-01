import express, { Request, Response } from "express"

const app = express()

const port = process.env.PORT || 8000

app.get("/", (req: Request, res: Response) => {
  res.json({
    message: "Hello World!!",
  })
})

app.listen(port, () => {
  console.log(`Server running at port ${port}`)
})
