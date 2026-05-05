import { Response } from "express";
import { BookingService } from "./booking.service";
import { sendSuccess } from "../../utils/api-response.util";
import { AuthenticatedRequest } from "../../middlewares/auth.middleware";

export class BookingController {
  private service: BookingService;

  constructor() {
    this.service = new BookingService();
  }

  async getAll(req: AuthenticatedRequest, res: Response) {
    const result = await this.service.getAllBookings(req.query as Record<string, any>);
    sendSuccess(res, result, "Bookings retrieved successfully");
  }

  async getMyBookings(req: AuthenticatedRequest, res: Response) {
    const result = await this.service.getMyBookings(
      req.user!.id,
      req.query as Record<string, any>,
    );
    sendSuccess(res, result, "Your bookings retrieved successfully");
  }

  async getById(req: AuthenticatedRequest, res: Response) {
    const booking = await this.service.getBookingById(req.params.id);
    sendSuccess(res, booking, "Booking retrieved successfully");
  }

  async create(req: AuthenticatedRequest, res: Response) {
    const booking = await this.service.createBooking(req.user!.id, req.body);
    sendSuccess(res, booking, "Booking created successfully", 201);
  }

  async confirm(req: AuthenticatedRequest, res: Response) {
    const booking = await this.service.confirmBooking(req.params.id);
    sendSuccess(res, booking, "Booking confirmed successfully");
  }

  async reject(req: AuthenticatedRequest, res: Response) {
    const booking = await this.service.rejectBooking(req.params.id);
    sendSuccess(res, booking, "Booking rejected");
  }

  async cancel(req: AuthenticatedRequest, res: Response) {
    const booking = await this.service.cancelBooking(req.params.id, req.user!.id);
    sendSuccess(res, booking, "Booking cancelled successfully");
  }
}
