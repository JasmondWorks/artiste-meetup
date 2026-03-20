import mongoose, { Document, Schema } from "mongoose";
import { UserRole } from "./user.entity";


export interface IUser extends Document {
  name: string;
  email: string;
  password: string;
  role: UserRole;
  isEmailVerified: boolean;
  isFirstLogin: boolean;
  // Excluded from query results by default (select: false)
  emailVerificationOTP?: string;
  emailVerificationOTPExpires?: Date;
  createdAt: Date;
  updatedAt: Date;
}

const UserSchema = new Schema<IUser>(
  {
    name: { type: String, required: true, trim: true },
    email: { type: String, required: true, unique: true, lowercase: true, trim: true },
    password: { type: String, required: true, select: false },
    role: {
      type: String,
      enum: Object.values(UserRole),
      required: true,
    },
    isEmailVerified: { type: Boolean, default: false },
    isFirstLogin: { type: Boolean, default: true },
    emailVerificationOTP: { type: String, select: false },
    emailVerificationOTPExpires: { type: Date, select: false },
  },
  { timestamps: true },
);

const User = mongoose.model<IUser>("User", UserSchema);

export default User;
