import express, { Request, Response } from "express";

const app = express();

app.use(express.json());

// request logger (optional but useful)
app.use((req, res, next) => {
  console.log("Incoming request:", req.method, req.url);
  next();
});

app.get("/", (req: Request, res: Response) => {
  console.log("auth service hit");
  res.status(200).send("auth service running successfully");
});

export default app;
