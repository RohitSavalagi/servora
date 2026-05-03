export const emailTemplate = (otp: string) => {
  return `<!DOCTYPE html>
<html lang="en">
<head>
  <meta charset="UTF-8" />
  <title>OTP Verification</title>
</head>
<body style="margin:0; padding:0; background-color:#f4f4f7; font-family: Arial, sans-serif;">
  <table width="100%" cellpadding="0" cellspacing="0" style="background-color:#f4f4f7; padding:20px;">
    <tr>
      <td align="center">
        <table width="500" cellpadding="0" cellspacing="0" style="background:#ffffff; border-radius:10px; padding:30px; box-shadow:0 4px 10px rgba(0,0,0,0.05);">
          
          <!-- Header -->
          <tr>
            <td align="center" style="padding-bottom:20px;">
              <h2 style="margin:0; color:#333;">Servora</h2>
            </td>
          </tr>

          <!-- Message -->
          <tr>
            <td style="color:#555; font-size:16px; line-height:1.5;">
              <p>Hello,</p>
              <p>Use the following One-Time Password (OTP) to complete your verification process:</p>
            </td>
          </tr>

          <!-- OTP Box -->
          <tr>
            <td align="center" style="padding:20px 0;">
              <div style="
                display:inline-block;
                padding:15px 25px;
                font-size:24px;
                letter-spacing:5px;
                font-weight:bold;
                color:#ffffff;
                background-color:#4CAF50;
                border-radius:8px;
              ">
                ${otp}
              </div>
            </td>
          </tr>

          <!-- Expiry -->
          <tr>
            <td style="color:#777; font-size:14px;">
              <p><strong>Note:</strong> This OTP will expire in <strong>5 minutes</strong>.</p>
            </td>
          </tr>

          <!-- Warning -->
          <tr>
            <td style="color:#999; font-size:13px;">
              <p>If you did not request this, please ignore this email.</p>
            </td>
          </tr>

          <!-- Footer -->
          <tr>
            <td style="padding-top:20px; border-top:1px solid #eee; font-size:13px; color:#777;">
              <p>Regards,<br/>
              <strong>Rohit Savalagi</strong><br/>
              Founder, Servora</p>

              <p>Support: 
                <a href="mailto:rohitsavalagi810@gmail.com" style="color:#4CAF50; text-decoration:none;">
                  rohitsavalagi810@gmail.com
                </a>
              </p>
            </td>
          </tr>

        </table>
      </td>
    </tr>
  </table>
</body>
</html>`;
};
