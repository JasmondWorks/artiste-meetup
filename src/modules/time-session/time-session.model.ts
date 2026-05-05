import mongoose, { Document, Schema } from "mongoose";

export interface ITimeSession extends Document {
  celebrityId: mongoose.Types.ObjectId;
  date: Date;
  startTime: string;
  endTime: string;
  isBooked: boolean;
  createdAt: Date;
  updatedAt: Date;
}

const TimeSessionSchema = new Schema<ITimeSession>(
  {
    celebrityId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Celebrity",
      required: true,
    },
    date: { type: Date, required: true },
    startTime: { type: String, required: true, trim: true },
    endTime: { type: String, required: true, trim: true },
    isBooked: { type: Boolean, default: false },
  },
  { timestamps: true },
);

const TimeSession = mongoose.model<ITimeSession>("TimeSession", TimeSessionSchema);
export default TimeSession;
