import express, { Request, Response } from "express";
import router from "./routes/auth.routes";

const app = express();

app.use(express.json());

// request logger (optional but useful)
app.use((req, res, next) => {
  console.log("Incoming request:", req.method, req.url);
  next();
});

app.use("/", router);

export default app;
