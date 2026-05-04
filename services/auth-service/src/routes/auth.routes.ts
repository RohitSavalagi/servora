import express, { Request, Response } from "express";
import {
  forgotPasswordController,
  forgotPasswordVerifyOtpController,
  logInController,
  resetPassWordController,
  sendEmailController,
  signUpController,
} from "../controllers/auth.controller";

export const router = express.Router();

router.get("/", (req: Request, res: Response) => {
  console.log("auth service");
  res.send("auth service running successfully");
});

router.post("/send-mail-auth", sendEmailController);
router.post("/signUp", signUpController);
router.post("/login", logInController);
router.post("/forgot-password", forgotPasswordController);
router.post("/forgot-password-verify-otp", forgotPasswordVerifyOtpController);
router.post("/reset-password", resetPassWordController);

export default router;
