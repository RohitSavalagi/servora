import { Request, Response } from "express";
import { IUser } from "../models/user.model";
import { AppError } from "../utils/app.error";
import { sendEmailService, signUpService } from "../services/opt.service";
import { ApiResponse } from "../types/api-response.types";

export const sendEmailController = async (req: Request, res: Response) => {
  try {
    // fetch data
    const { fullName, email, password, role, confirmPassword } = req.body;

    // validation
    if (!fullName || !email || !password || !role || !confirmPassword) {
      throw new AppError(400, "Please fill all the input fields");
    }

    if (confirmPassword !== password) {
      throw new AppError(422, "password didnot match");
    }

    if (password.length < 8) {
      throw new AppError(422, "password is too short");
    }

    // service call
    const newOtp = await sendEmailService({ email });

    res.status(201).json({
      success: true,
      message: "Otp send successfully",
      data: newOtp,
    } as ApiResponse<typeof newOtp>);
  } catch (error: any) {
    console.log(error);
    res.status(error.statusCode || 500).json({
      success: false,
      message: error.message || "Internal server error",
    });
  }
};

export const signUpController = async (req: Request, res: Response) => {
  try {
    // fetch data
    const { fullName, email, password, role, confirmPassword, otp } = req.body;

    // validation
    if (!fullName || !email || !password || !role || !confirmPassword || !otp) {
      throw new AppError(400, "Please fill all the input fields");
    }

    if (confirmPassword !== password) {
      throw new AppError(422, "password didnot match");
    }

    if (password.length < 8) {
      throw new AppError(422, "password is too short");
    }

    // service call
    const newUser = await signUpService({
      fullName,
      email,
      password,
      role,
      confirmPassword,
      otp,
    });

    const options = {
      expires: new Date(Date.now() + 3 * 24 * 60 * 60 * 1000),
      httpOnly: true,
    };

    res
      .cookie("token", newUser.token, options)
      .status(201)
      .json({
        success: true,
        message: "New user signup Succesfully",
        data: newUser,
      } as ApiResponse<typeof newUser>);
  } catch (error: any) {
    console.log(error);
    res.status(error.statusCode || 500).json({
      success: false,
      message: error.message || "Internal server error",
    });
  }
};
