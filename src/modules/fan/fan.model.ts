import mongoose, { Document, Schema } from "mongoose";

export interface IFan extends Document {
  userId: mongoose.Types.ObjectId;
  bio: string;
  interests: string[];
  createdAt: Date;
  updatedAt: Date;
}

const FanSchema = new Schema<IFan>(
  {
    userId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      required: true,
      unique: true,
    },
    bio: { type: String, default: "" },
    interests: [{ type: String, trim: true }],
  },
  { timestamps: true },
);

const Fan = mongoose.model<IFan>("Fan", FanSchema);
export default Fan;
