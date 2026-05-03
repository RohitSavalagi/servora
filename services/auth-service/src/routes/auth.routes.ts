import express, { Request, Response } from "express";
import {
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

export default router;
