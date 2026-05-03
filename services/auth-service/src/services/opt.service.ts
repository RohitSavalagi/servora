import { signUpController } from "./../controllers/auth.controller";
import { IUser, User } from "../models/user.model";
import { Otp } from "../models/otp.model";
import { AppError } from "../utils/app.error";
import otp from "otp-generator";
import axios from "axios";
import { emailTemplate } from "../templates/email.template";
import bcrypt from "bcrypt";
import jwt from "jsonwebtoken";

interface IUserData {
  fullName: string;
  email: string;
  password: string;
  confirmPassword: string;
  role: "user" | "worker" | "admin";
}
interface ISignUpData extends IUserData {
  otp: string;
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

  // save otp in db

  const otpDoc = await Otp.create({
    email: email,
    otp: newOtp,
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

  return otpDoc;
};

export const signUpService = async (data: ISignUpData) => {
  const { fullName, password, email, otp, role } = data;

  const isUserRegistered = await User.findOne({ email });

  if (isUserRegistered) {
    throw new AppError(409, "Email already registered");
  }

  const latestOtp = await Otp.findOne({ email }).sort({ createdAt: -1 });

  //verfiy
  if (!latestOtp) {
    throw new AppError(404, "Otp not found");
  }

  if (latestOtp.otp !== otp) {
    throw new AppError(400, "Otp did not matched");
  }

  // hash password
  const hashedPassword = await bcrypt.hash(password, 10);

  // created a new user

  const newUser = await User.create({
    email: email,
    password: hashedPassword,
    role: role,
    fullName: fullName,
  });

  const payload = {
    email: email,
    role: role,
    fullName: fullName,
    userId: newUser.id,
  };

  const JWT_SECRET = process.env.JWT_SECRET;

  if (!JWT_SECRET) {
    throw new AppError(500, "JWT secret is missing");
  }

  const token = await jwt.sign(payload, JWT_SECRET, { expiresIn: "1y" });

  const userObj = {
    ...newUser.toObject(),
    token: token,
    password: null,
  };

  return userObj;
};
