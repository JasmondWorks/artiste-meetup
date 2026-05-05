import mongoose, { Document, Schema } from "mongoose";
import { ChatStatus } from "./chat.entity";

export interface IChat extends Document {
  fanId: mongoose.Types.ObjectId;
  celebrityId: mongoose.Types.ObjectId;
  bookingId?: mongoose.Types.ObjectId;
  telegramUsername: string;
  status: ChatStatus;
  createdAt: Date;
  updatedAt: Date;
}

const ChatSchema = new Schema<IChat>(
  {
    fanId: { type: mongoose.Schema.Types.ObjectId, ref: "Fan", required: true },
    celebrityId: { type: mongoose.Schema.Types.ObjectId, ref: "Celebrity", required: true },
    bookingId: { type: mongoose.Schema.Types.ObjectId, ref: "Booking" },
    telegramUsername: { type: String, required: true, trim: true },
    status: {
      type: String,
      enum: Object.values(ChatStatus),
      default: ChatStatus.ACTIVE,
    },
  },
  { timestamps: true },
);

const Chat = mongoose.model<IChat>("Chat", ChatSchema);
export default Chat;
