import express, { Request, Response } from "express";
import { sendMailController } from "../controllers/mail.controller";

const router = express.Router();

router.post("/send-mail", sendMailController);

export default router;
