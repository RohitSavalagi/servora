import { Request, Response } from "express";
import { IUser } from "../models/user.model";
import { AppError } from "../utils/app.error";
import { sendEmailService } from "../services/auth.service";
import { ApiResponse } from "../types/api-response.types";

export const sendEmailController = async (req: Request, res: Response) => {
  try {
    const { fullName, email, password, role } = req.body as IUser;

    if (!fullName || !email || !password || !role) {
      throw new AppError(400, "Please fill all the input fields");
    }

    if (password.length < 8) {
      throw new AppError(422, "Password is too short");
    }

    const newOtp = await sendEmailService({ fullName, email, password, role });

    res.status(201).json({
      success: true,
      message: "Otp sent successfully",
      data: newOtp,
    } as ApiResponse<typeof newOtp>);
  } catch (error: any) {
    console.log(error);
    res.status(error.statusCode || 500).json({
      success: false,
      message: error.message || "Internal Server Error",
    });
  }
};
