import express, { Request, Response } from "express";
import dotenv from "dotenv";
import proxy from "express-http-proxy";
import { loginValidation } from "./auth.middleware";

const app = express();
dotenv.config();
const PORT = process.env.PORT;

app.get("/", (req: Request, res: Response) => {
  res.send("Api Gateway is running");
});

const authProxy = proxy("http://localhost:3001", {
  proxyReqPathResolver: (req) => {
    return req.originalUrl.replace("/api/v1/auth", "")
  },

  proxyReqOptDecorator: (proxyReqOpts, srcReq) => {
    if (srcReq.user) {
      proxyReqOpts.headers['user_id'] = JSON.stringify(srcReq.user);
    }

    return proxyReqOpts;
  }
})

// Public routes
app.use("/api/v1/auth/send-mail-auth", authProxy);
app.use("/api/v1/auth/signUp", authProxy);
app.use("/api/v1/auth/login", authProxy);
app.use("/api/v1/auth/forgot-password", authProxy);
app.use("/api/v1/auth/forgot-password-verify-otp", authProxy);
app.use("/api/v1/auth/reset-password", authProxy);

// Protected Route
app.use("/api/v1/auth/update-password", loginValidation, authProxy);

app.listen(PORT, () => {
  console.log("gateway service is running at PORT", PORT);
});
