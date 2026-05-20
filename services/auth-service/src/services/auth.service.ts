import { AppError } from "../utils/app.error";
import jwt from "jsonwebtoken";
import { IUserData } from "./opt.service";
import { User } from "../models/user.model";
import crypto from "node:crypto";
import bcrypt from "bcrypt";
import { getRedisClient } from "../config/redis.config";

interface ISignUpData extends IUserData {
  otp: string;
}

interface ILogInData {
  email: string;
  password: string;
}

interface IForgotPasswordVerifyOtpData {
  email: string;
  otp: string;
}

interface IResetPasswordData {
  resetToken: string;
  password: string;
  confirmPassword: string;
}

interface IUpdatePassword {
  userId: string;
  password: string;
  confirmPassword: string;
  oldPassword: string;
}

export const signUpService = async (data: ISignUpData) => {
  const { fullName, password, email, otp, role } = data;

  const isUserRegistered = await User.findOne({ email });

  if (isUserRegistered) {
    throw new AppError(409, "Email already registered");
  }

  // ger redis client
  const latestOtp = await getRedisClient().get(`signup_otp:${email}`);

  // verify
  if (!latestOtp) {
    throw new AppError(404, "Otp not found");
  }

  if (latestOtp !== otp) {
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

  const refreshTokenPayload = {
    userId: newUser._id,
  };

  const ACCESS_TOKEN_JWT_SECRET = process.env.ACCESS_TOKEN_JWT_SECRET;

  if (!ACCESS_TOKEN_JWT_SECRET) {
    throw new AppError(500, "JWT secret is missing");
  }

  const accessToken = await jwt.sign(payload, ACCESS_TOKEN_JWT_SECRET, {
    expiresIn: "15min",
  });

  const REFRESH_TOKEN_JWT_SECRET = process.env.REFRESH_TOKEN_JWT_SECRET;

  if (!REFRESH_TOKEN_JWT_SECRET) {
    throw new AppError(500, "JWT REFRESH_TOKEN_JWT_SECRET secret is missing");
  }

  const refreshToken = await jwt.sign(
    refreshTokenPayload,
    REFRESH_TOKEN_JWT_SECRET,
    {
      expiresIn: "7d",
    },
  );

  // redis client
  const client = getRedisClient();

  // save refresh token in redis
  await client.set(`session:${newUser._id}`, refreshToken, {
    EX: 604800,
  });

  const userObj = {
    ...newUser.toObject(),
    accessToken: accessToken,
    refreshToken: refreshToken,
    password: null,
  };

  return userObj;
};

export const loginService = async (data: ILogInData) => {
  const { email, password } = data;

  if (!email || !password) {
    throw new AppError(400, "Please fill all the required Fields");
  }

  const user = await User.findOne({ email });

  if (!user) {
    throw new AppError(404, "Email does not exists");
  }

  const passwordMatch = await bcrypt.compare(password, user.password);

  if (!passwordMatch) {
    throw new AppError(422, "Password did not match");
  }

  // generate token
  const payload = {
    email: email,
    role: user.role,
    fullName: user.fullName,
    userId: user._id,
  };

  const ACCESS_TOKEN_JWT_SECRET = process.env.ACCESS_TOKEN_JWT_SECRET;

  if (!ACCESS_TOKEN_JWT_SECRET) {
    throw new AppError(500, "JWT secret is missing");
  }

  const accessToken = await jwt.sign(payload, ACCESS_TOKEN_JWT_SECRET, {
    expiresIn: "15min",
  });

  const REFRESH_TOKEN_JWT_SECRET = process.env.REFRESH_TOKEN_JWT_SECRET;

  if (!REFRESH_TOKEN_JWT_SECRET) {
    throw new AppError(500, "JWT REFRESH_TOKEN_JWT_SECRET secret is missing");
  }

  const refreshTokenPayload = {
    userId: payload.userId,
  };

  const refreshToken = await jwt.sign(
    refreshTokenPayload,
    REFRESH_TOKEN_JWT_SECRET,
    {
      expiresIn: "7d",
    },
  );

  // redis client
  const client = getRedisClient();

  // save refresh token in redis
  await client.set(`session:${payload.userId}`, refreshToken, {
    EX: 604800,
  });

  const userObj = {
    ...user.toObject(),
    accessToken: accessToken,
    refreshToken: refreshToken,
    password: null,
  };

  return userObj;
};

export const forgotPasswordVerifyOtpService = async (
  data: IForgotPasswordVerifyOtpData,
) => {
  const { email, otp } = data;

  // redis client
  const latestOtp = await getRedisClient().get(`forgot_password_otp:${email}`);

  if (!latestOtp) {
    throw new AppError(422, "Otp not found / expired");
  }

  if (latestOtp != otp) {
    throw new AppError(422, "Otp did not match");
  }

  // generate token
  const token = crypto.randomBytes(32).toString("hex");

  const updatedUser = await User.findOneAndUpdate(
    { email },
    {
      resetToken: token,
      resetTokenExpiry: Date.now() + 10 * 60 * 1000,
    },
    { returnDocument: "after" },
  ).select("-password");

  return updatedUser;
};

export const resetPasswordService = async (data: IResetPasswordData) => {
  const { resetToken, password, confirmPassword } = data;

  if (!password || !confirmPassword) {
    throw new AppError(400, "Please fill in all the required Fields");
  }

  if (password !== confirmPassword) {
    throw new AppError(422, "Password did not match");
  }

  if (password.length < 8) {
    throw new AppError(422, "Password is too short");
  }

  const userDetails = await User.findOne({ resetToken });

  if (!userDetails) {
    throw new AppError(400, "Session expired");
  }

  if (userDetails.resetTokenExpiry < Date.now().toString()) {
    throw new AppError(400, "Session Expired");
  }

  const hashedPassword = await bcrypt.hash(password, 10);

  // update the user
  const updatedUser = await User.findOneAndUpdate(
    { resetToken },
    {
      password: hashedPassword,
      resetToken: "",
      resetTokenExpiry: "",
    },
    { returnDocument: "after" },
  );

  return updatedUser;
};

export const updatePasswordService = async (data: IUpdatePassword) => {
  const { userId, password, confirmPassword, oldPassword } = data;

  if (password !== confirmPassword) {
    throw new AppError(422, "confirm password did not match");
  }

  if (password.length < 8) {
    throw new AppError(422, "password length is less than 8");
  }

  const user = await User.findOne({ _id: userId });

  if (!user?._id) {
    throw new AppError(404, "Email is not registered");
  }

  const passwordMatch = await bcrypt.compare(oldPassword, user.password);

  if (!passwordMatch) {
    throw new AppError(409, "Password did not match");
  }

  const hashedPassword = await bcrypt.hash(password, 10);

  const updatedUser = await User.findOneAndUpdate(
    { _id: userId },
    {
      password: hashedPassword,
    },
    { returnDocument: "after" },
  ).select("-password");

  return updatedUser?.toObject();
};
