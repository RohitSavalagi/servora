import app from "./app";
import dotenv from "dotenv";

dotenv.config();

const PORT = process.env.PORT;

app.listen(PORT, () => {
  console.log("mail servive is successfully runnging at", PORT);
});
