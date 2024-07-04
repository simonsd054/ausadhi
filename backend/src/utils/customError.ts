class CustomError extends Error {
  statusCode: number
  constructor(message: string, statusCode: number) {
    super(message)
    this.name = "Custom"
    this.statusCode = statusCode
  }
}

export default CustomError
