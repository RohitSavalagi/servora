import express, { Response } from "express";
import {
  forgotPasswordController,
  forgotPasswordVerifyOtpController,
  logInController,
  resetPassWordController,
  sendEmailController,
  signUpController,
  updatePassWordController,
} from "../controllers/auth.controller";

export const router = express.Router();

router.get("/", (_, res: Response) => {
  console.log("auth service");
  res.send("auth service running successfully");
});

router.post("/send-mail-auth", sendEmailController);
router.post("/signUp", signUpController);
router.post("/login", logInController);
router.post("/forgot-password", forgotPasswordController);
router.post("/forgot-password-verify-otp", forgotPasswordVerifyOtpController);
router.post("/reset-password", resetPassWordController);
router.post("/update-password", updatePassWordController);

export default router;
