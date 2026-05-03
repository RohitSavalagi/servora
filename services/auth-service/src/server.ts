import app from "./app";
import { dbConnect } from "./config/db.config";

const PORT = 3001;

dbConnect();

app.listen(PORT, () => {
  console.log(`Server is running on http://localhost:${PORT}`);
});
