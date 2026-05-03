import express, { Request, response, Response } from "express";
import { sendEmailController } from "../controllers/auth.controller";

export const router = express.Router();

router.get("/", (req: Request, res: Response) => {
  console.log("auth service");
  res.send("auth service running successfully");
});

router.post("/signUp", sendEmailController);

export default router;
