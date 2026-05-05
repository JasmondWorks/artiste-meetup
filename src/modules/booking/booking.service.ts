import { MongooseRepository } from "../../utils/crud.util";
import { AppError } from "../../utils/app-error.util";
import Booking, { IBooking } from "./booking.model";
import TimeSession from "../time-session/time-session.model";
import Chat from "../chat/chat.model";
import { BookingStatus } from "./booking.entity";
import { CreateBookingDto } from "./booking.dto";

const populate = [
  { path: "fanId" },
  { path: "celebrityId" },
  { path: "timeSessionId" },
];

export class BookingService {
  private repo: MongooseRepository<IBooking>;

  constructor() {
    this.repo = new MongooseRepository(Booking);
  }

  async getAllBookings(queryParams: Record<string, any> = {}) {
    return this.repo.findAll(queryParams, {}, [], populate);
  }

  async getMyBookings(fanId: string, queryParams: Record<string, any> = {}) {
    return this.repo.findAll(queryParams, { fanId }, [], populate);
  }

  async getBookingById(id: string) {
    const booking = await Booking.findById(id).populate(populate).exec();
    if (!booking) throw new AppError("Booking not found", 404);
    return booking;
  }

  async createBooking(fanId: string, data: CreateBookingDto) {
    const session = await TimeSession.findById(data.timeSessionId);
    if (!session) throw new AppError("Time session not found", 404);
    if (session.isBooked) throw new AppError("This time slot is already booked", 400);

    // Lock the slot immediately so no concurrent booking can claim it
    await TimeSession.findByIdAndUpdate(data.timeSessionId, { isBooked: true });

    return this.repo.create({ fanId, ...data } as any);
  }

  async confirmBooking(id: string) {
    const booking = await this.repo.findById(id);
    if (!booking) throw new AppError("Booking not found", 404);
    if (booking.status !== BookingStatus.PENDING) {
      throw new AppError("Only pending bookings can be confirmed", 400);
    }

    const updated = await this.repo.update(id, { status: BookingStatus.CONFIRMED } as any);

    // Auto-create a chat record if the booking has a telegram username
    if (booking.telegramUsername) {
      const existingChat = await Chat.findOne({
        fanId: booking.fanId,
        celebrityId: booking.celebrityId,
      });
      if (!existingChat) {
        await Chat.create({
          fanId: booking.fanId,
          celebrityId: booking.celebrityId,
          bookingId: booking._id,
          telegramUsername: booking.telegramUsername,
        });
      }
    }

    return updated;
  }

  async rejectBooking(id: string) {
    const booking = await this.repo.findById(id);
    if (!booking) throw new AppError("Booking not found", 404);
    if (booking.status !== BookingStatus.PENDING) {
      throw new AppError("Only pending bookings can be rejected", 400);
    }

    // Release the time slot
    await TimeSession.findByIdAndUpdate(booking.timeSessionId, { isBooked: false });

    return this.repo.update(id, { status: BookingStatus.REJECTED } as any);
  }

  async cancelBooking(id: string, fanId: string) {
    const booking = await this.repo.findById(id);
    if (!booking) throw new AppError("Booking not found", 404);
    if (booking.fanId.toString() !== fanId) {
      throw new AppError("You can only cancel your own bookings", 403);
    }
    if (booking.status === BookingStatus.CANCELLED) {
      throw new AppError("Booking is already cancelled", 400);
    }
    if (booking.status === BookingStatus.CONFIRMED) {
      throw new AppError("Confirmed bookings cannot be cancelled. Contact support.", 400);
    }

    // Release the time slot
    await TimeSession.findByIdAndUpdate(booking.timeSessionId, { isBooked: false });

    return this.repo.update(id, { status: BookingStatus.CANCELLED } as any);
  }
}
