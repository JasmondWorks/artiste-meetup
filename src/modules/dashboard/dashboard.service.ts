import Booking from "../booking/booking.model";
import Chat from "../chat/chat.model";
import { BookingStatus } from "../booking/booking.entity";
import { ChatStatus } from "../chat/chat.entity";

export class DashboardService {
  async getStats() {
    const [
      totalBookings,
      pendingBookings,
      confirmedBookings,
      rejectedBookings,
      cancelledBookings,
      activeChats,
    ] = await Promise.all([
      Booking.countDocuments(),
      Booking.countDocuments({ status: BookingStatus.PENDING }),
      Booking.countDocuments({ status: BookingStatus.CONFIRMED }),
      Booking.countDocuments({ status: BookingStatus.REJECTED }),
      Booking.countDocuments({ status: BookingStatus.CANCELLED }),
      Chat.countDocuments({ status: ChatStatus.ACTIVE }),
    ]);

    const activeChatsDetail = await Chat.find({ status: ChatStatus.ACTIVE })
      .populate("fanId")
      .populate("celebrityId")
      .select("fanId celebrityId telegramUsername status createdAt")
      .limit(10)
      .exec();

    return {
      bookings: {
        total: totalBookings,
        pending: pendingBookings,
        confirmed: confirmedBookings,
        rejected: rejectedBookings,
        cancelled: cancelledBookings,
      },
      chats: {
        active: activeChats,
        recentActive: activeChatsDetail,
      },
    };
  }
}
