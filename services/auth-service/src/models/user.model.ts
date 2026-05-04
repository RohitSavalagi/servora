import mongoose from "mongoose";

export interface IUser {
  fullName: string;
  email: string;
  password: string;
  role: "user" | "worker" | "admin";
  resetToken: string;
  resetTokenExpiry: string;
}

const userSchema = new mongoose.Schema<IUser>(
  {
    fullName: {
      type: String,
      trim: true,
      required: [true, "Full name field in missing"],
    },
    email: {
      type: String,
      required: [true, "email field in missing"],
      trim: true,
      unique: true,
    },
    password: {
      type: String,
      required: [true, "password field in missing"],
      trim: true,
    },
    role: {
      type: String,
      enum: ["user", "worker", "admin"],
      default: "user",
    },
    resetToken: {
      type: String,
    },
    resetTokenExpiry: {
      type: String,
    },
  },
  { timestamps: true },
);

export const User = mongoose.model<IUser>("User", userSchema);
