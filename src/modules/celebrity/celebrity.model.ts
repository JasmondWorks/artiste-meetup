import mongoose, { Document, Schema } from "mongoose";
import { CelebrityCategory, CelebrityStatus } from "./celebrity.entity";

export interface ICelebrity extends Document {
  name: string;
  profession: string;
  category: CelebrityCategory;
  userId: mongoose.Types.ObjectId | null;
  status: CelebrityStatus;
  bio: string;
  bookingPrice: number;
  interests: string[];
  createdAt: Date;
  updatedAt: Date;
}

const CelebritySchema = new Schema<ICelebrity>(
  {
    name: { type: String, required: true, trim: true },
    profession: { type: String, required: true, trim: true },
    category: {
      type: String,
      enum: Object.values(CelebrityCategory),
      required: true,
    },
    userId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      default: null,
    },
    status: {
      type: String,
      enum: Object.values(CelebrityStatus),
      default: CelebrityStatus.AVAILABLE,
    },
    bio: { type: String, default: "" },
    bookingPrice: { type: Number, required: true, min: 0 },
    interests: [{ type: String, trim: true }],
  },
  { timestamps: true },
);

const Celebrity = mongoose.model<ICelebrity>("Celebrity", CelebritySchema);
export default Celebrity;
