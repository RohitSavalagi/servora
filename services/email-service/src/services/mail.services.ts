import { transporter } from "../config/mail.config";
import { IMailData } from "../controllers/mail.controller";

export const sendMailService = async (data: IMailData) => {
  const info = await transporter.sendMail({
    from: `"${data.from}" <${process.env.MAIL_USER}>`,
    to: data.email,
    subject: data.subject,
    html: data.body,
  });

  return info;
};
