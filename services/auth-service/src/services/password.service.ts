import axios from "axios";
import { User } from "../models/user.model";
import { emailTemplate } from "../templates/email.template";
import { AppError } from "../utils/app.error";
import otpGenerator from "otp-generator";
import { getRedisClient } from "../config/redis.config";

interface IForgotPasswordData {
  email: string;
}

export const forgotPasswordService = async (data: IForgotPasswordData) => {
  const { email } = data;
  const user = await User.findOne({ email });

  if (!user) {
    throw new AppError(400, "Email is not registered");
  }

  const newOtp = await otpGenerator.generate(4, {
    upperCaseAlphabets: false,
    lowerCaseAlphabets: false,
    specialChars: false,
  });

  // save this opt in redis client
  const client = getRedisClient();
  await client.set(`forgot_password_otp:${email}`, newOtp, {
    EX: 300,
  });

  const body = emailTemplate(newOtp);

  if (body) {
    const mailData = {
      email,
      subject: "For OTP verification",
      body: body,
      from: "servora",
    };

    await axios.post("http://localhost:5000/api/v1/send-mail", mailData);
  } else {
    throw new AppError(409, "Email Body is not provided");
  }
};
