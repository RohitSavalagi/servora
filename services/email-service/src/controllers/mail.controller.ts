import { Request, Response } from "express";
import { AppError } from "../utils/app-error";
import { sendMailService } from "../services/mail.services";

export interface IMailData {
  email: string;
  subject: string;
  body: string;
  from: string;
}

export const sendMailController = async (req: Request, res: Response) => {
  try {
    // Fetch request payload
    const { email, subject, body, from } = req.body;
    console.log(req.body);

    // Validate the required email fields before sending
    if (!email || !subject || !body || !from) {
      throw new AppError("data is not sufficient to send mail", 400);
    }

    await sendMailService({
      email,
      subject,
      body,
      from,
    });

    return res.status(200).json({
      success: true,
      message: "Otp Mail sent successfully",
    });
  } catch (error) {
    const message =
      error instanceof Error ? error.message : "Failed to send mail";

    return res.status(400).json({
      success: false,
      message,
    });
  }
};
