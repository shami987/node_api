import nodemailer from "nodemailer";

export const transporter = nodemailer.createTransport({
  service: "gmail", // or outlook, yahoo, etc.
  auth: {
    user: process.env.EMAIL_USER,
    pass: process.env.EMAIL_PASS
  }
})