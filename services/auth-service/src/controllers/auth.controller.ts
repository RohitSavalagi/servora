import { Request, Response } from "express";
import { IUser, User } from "../models/user.model";
import { AppError } from "../utils/app.error";
import { sendEmailService } from "../services/opt.service";
import { ApiResponse } from "../types/api-response.types";
import { forgotPasswordVerifyOtpService, loginService, resetPasswordService, signUpService, updatePasswordService } from "../services/auth.service";
import { forgotPasswordService } from "../services/password.service";

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

export const logInController = async (req: Request, res: Response) => {
  try {
    const { email, password } = req.body;

    if (!email || !password) {
      throw new AppError(400, 'Please fill all the required Fields');
    }

    const callLoginsService = await loginService({ email, password });

    const cookieOption = {
      expires: new Date(Date.now() + 3 * 24 * 60 * 60 * 1000),
      httpOnly: true,
    }

    return res.cookie(
      'token', 
      callLoginsService, 
      cookieOption
    ).status(200).json({
      success: true,
      message: "login successful",
      data: callLoginsService,
    } as ApiResponse<typeof callLoginsService>)

  } catch (error: any) {
    console.log(error);
    res.status(error.statusCode || 500).json({
      success: false,
      message: error.message || 'Internal server error',
    })
  }
}

export const forgotPasswordController = async (req: Request, res: Response) => {
  try {
    const { email } = req.body;

    if (!email) {
      throw new AppError(400, 'Please fill in all the fields');
    }

    const forgotPasswordServiceCall = await forgotPasswordService({ email });

    res.status(201).json({
      success: true,
      data: forgotPasswordServiceCall,
      message: "OTP sent successfully for the forgot password",
    } as ApiResponse<typeof forgotPasswordServiceCall>);
  } catch (error) {
      console.log(error);
      if (error instanceof AppError) {
        res.status(error.statusCode || 5000).json({
          success: false,
          message: error.message || 'Internal Server Error',
        })
      }
  }
}

export const forgotPasswordVerifyOtpController = async (req: Request, res: Response) => {
  try {
    // fetch data
    const { email, otp } = req.body;

    if (!email || !otp) {
      throw new AppError(400, "Please fill all the fields");
    }

    if (otp.length < 4) {
      throw new AppError(400, 'Please fill the otp');
    }

    // call the service
    const updatedUser = await forgotPasswordVerifyOtpService({ email, otp });

    res.status(200).json({
      success: true,
      message: "Otp verified successfully",
      data: updatedUser,
    } as ApiResponse<typeof updatedUser>);

  } catch (error: any) {
    console.log(error);
    
    res.status(error.statusCode || 500).json({
      success: false,
      message: error.message || "Internal Server Error"
    });
  }
}

export const resetPassWordController = async (req: Request, res: Response) => {
  try {
    const { resetToken, password, confirmPassword } = req.body;
    
    if (!resetToken || !password || !confirmPassword) {
      throw new AppError(400, "Please fill in all the fields");
    }

    if (!resetToken) {
      throw new AppError(400, "something went wrong");
    }

    const resetPassWordCall = await resetPasswordService({ resetToken, password, confirmPassword });

    res.status(200).json({
      success: true,
      message: "Password updated successfully"
    } as ApiResponse<null>);
  } catch (error: any) {
      console.log(error);

      res.status(error.statusCode || 500).json({
        success: false,
        message: error.message,
      })
  }
}

export const updatePassWordController = async (req: Request, res: Response) => {
  try {

    const userData = JSON.parse(req.headers?.['user_id'] as string);

    const userId = userData.userId;

    const { password, confirmPassword, oldPassword } = req.body;

    if (!userId || !password || !confirmPassword || !oldPassword) {
      throw new AppError(400, "Please fill in all the required fields");
    }

    const callUpdatePasswordService = await updatePasswordService({ userId, password, confirmPassword, oldPassword }); 

    res.status(200).json({
      success: true,
      message: 'Password update successful',
      data: callUpdatePasswordService,
    } as ApiResponse<typeof callUpdatePasswordService>);
  } catch (error: any) {
    console.log(error);
    res.status(error.statusCode || 500).json({
      success: false,
      message: error.message || "Internal server error",
    })
  }
}
