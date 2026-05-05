import mongoose, { Document, Schema } from "mongoose";
import { BookingStatus } from "./booking.entity";

export interface IBooking extends Document {
  fanId: mongoose.Types.ObjectId;
  celebrityId: mongoose.Types.ObjectId;
  timeSessionId: mongoose.Types.ObjectId;
  message?: string;
  telegramUsername?: string;
  status: BookingStatus;
  createdAt: Date;
  updatedAt: Date;
}

const BookingSchema = new Schema<IBooking>(
  {
    fanId: { type: mongoose.Schema.Types.ObjectId, ref: "Fan", required: true },
    celebrityId: { type: mongoose.Schema.Types.ObjectId, ref: "Celebrity", required: true },
    timeSessionId: { type: mongoose.Schema.Types.ObjectId, ref: "TimeSession", required: true },
    message: { type: String },
    telegramUsername: { type: String, trim: true },
    status: {
      type: String,
      enum: Object.values(BookingStatus),
      default: BookingStatus.PENDING,
    },
  },
  { timestamps: true },
);

const Booking = mongoose.model<IBooking>("Booking", BookingSchema);
export default Booking;
