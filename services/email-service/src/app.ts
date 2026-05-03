import express from "express";
import router from "./routes/mail.routes";

const app = express();

app.use(express.json());
app.use("/api/v1", router);

export default app;
