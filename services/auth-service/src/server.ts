import app from "./app";
import { dbConnect } from "./config/db.config";
import { redisConnect } from "./config/redis.config";

const PORT = 3001;

redisConnect();
dbConnect();

app.listen(PORT, () => {
  console.log(`Server is running on http://localhost:${PORT}`);
});
