import nodemailer from "nodemailer"
import { Readable } from "node:stream"
import { Address, AttachmentLike } from "nodemailer/lib/mailer"

const sendEmail = async (email: string | Address | (string | Address)[] | undefined, subject: string, message: string | Buffer | Readable | AttachmentLike | undefined) => {
  const transporter = nodemailer.createTransport({
    service: "Gmail",
    host: "smtp.gmail.com",
    port: 465,
    secure: true,
    auth: {
      user: process.env.EMAIL,
      pass: process.env.EMAIL_PASSWORD,
    },
  })

  await transporter.sendMail({
    from: `<${process.env.EMAIL}>`,
    to: email,
    subject: subject,
    html: message,
  })
}

export default sendEmail
