import express, { Request, Response } from "express";
import dotenv from "dotenv";
import proxy from "express-http-proxy";

const app = express();
dotenv.config();
const PORT = process.env.PORT;

app.get("/", (req: Request, res: Response) => {
  res.send("Api Gateway is running");
});

app.use("/api/v1/auth", proxy("http://localhost:3001"));

app.listen(PORT, () => {
  console.log("gateway service is running at PORT", PORT);
});
