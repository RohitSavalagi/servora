import nodemailer from "nodemailer";
import dotevn from "dotenv";

dotevn.config();

const { MAIL_HOST, MAIL_USER, MAIL_PASS } = process.env;

if (!MAIL_HOST || !MAIL_USER || !MAIL_PASS) {
  throw new Error("MAIL_HOST, MAIL_USER and MAIL_PASS must be configured");
}

export const transporter = nodemailer.createTransport({
  host: MAIL_HOST,
  port: 587,
  secure: false,
  auth: {
    user: MAIL_USER,
    pass: MAIL_PASS,
  },
});
