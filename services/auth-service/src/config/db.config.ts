import mongoose from "mongoose";
import dotenv from "dotenv";

export const dbConnect = async () => {
  try {
    const mongodbUrl =
      process.env.MONGODB_URL ||
      "mongodb+srv://rohitsavalagi70_db_user:80cj15vO4asFAsja@authcluster.ezantmn.mongodb.net/ServoraAuthDatabase";

    if (!mongodbUrl) {
      console.log("db uri is not provided");
      process.exit(1);
    }

    mongoose.connect(mongodbUrl);
    console.log("Auth Service Database connected suceessfully");
  } catch (error) {
    if (error instanceof Error) {
      console.log("Auth service db connections failed", error.message);
      process.exit();
    } else {
      console.log("Auth service db connection failed due to unknown error");
    }
  }
};
