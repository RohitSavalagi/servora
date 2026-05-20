import { signUpController } from "./../controllers/auth.controller";
import { IUser, User } from "../models/user.model";
import { AppError } from "../utils/app.error";
import otp from "otp-generator";
import axios from "axios";
import { emailTemplate } from "../templates/email.template";
import dotenv from "dotenv";
import { getRedisClient } from "../config/redis.config";

dotenv.config();

export interface IUserData {
  fullName: string;
  email: string;
  password: string;
  confirmPassword: string;
  role: "user" | "worker" | "admin";
}

export const sendEmailService = async (data: Partial<IUserData>) => {
  const { email } = data;

  const isExist = await User.findOne({ email });

  if (isExist) {
    throw new AppError(409, "Email already registerd");
  }

  const newOtp = await otp.generate(4, {
    upperCaseAlphabets: false,
    lowerCaseAlphabets: false,
    specialChars: false,
  });

  // save otp in redis

  const client = getRedisClient();
  await client.set(`signup_otp:${email}`, newOtp, {
    EX: 300,
  });

  const body = emailTemplate(newOtp);

  if (body) {
    const mailData = {
      email,
      subject: "For OTP verification",
      body: emailTemplate(newOtp),
      from: "servora",
    };

    await axios.post("http://localhost:5000/api/v1/send-mail", mailData);
  } else {
    throw new AppError(409, "Email Body is not provided");
  }
};
