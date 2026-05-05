import mongoose, { Document, Schema } from "mongoose";

export interface IFanReview extends Document {
  fanId: mongoose.Types.ObjectId;
  celebrityId: mongoose.Types.ObjectId;
  bookingId?: mongoose.Types.ObjectId;
  rating: number;
  comment?: string;
  createdAt: Date;
  updatedAt: Date;
}

const FanReviewSchema = new Schema<IFanReview>(
  {
    fanId: { type: mongoose.Schema.Types.ObjectId, ref: "Fan", required: true },
    celebrityId: { type: mongoose.Schema.Types.ObjectId, ref: "Celebrity", required: true },
    bookingId: { type: mongoose.Schema.Types.ObjectId, ref: "Booking" },
    rating: { type: Number, required: true, min: 0, max: 5 },
    comment: { type: String },
  },
  { timestamps: true },
);

// One review per fan per celebrity
FanReviewSchema.index({ fanId: 1, celebrityId: 1 }, { unique: true });

const FanReview = mongoose.model<IFanReview>("FanReview", FanReviewSchema);
export default FanReview;
