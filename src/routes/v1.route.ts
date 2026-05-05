import express from "express";
import authRoutes from "../modules/auth/auth.route";
import userRoutes from "../modules/user/user.route";
import celebrityRoutes from "../modules/celebrity/celebrity.route";
import fanRoutes from "../modules/fan/fan.route";
import timeSessionRoutes from "../modules/time-session/time-session.route";
import bookingRoutes from "../modules/booking/booking.route";
import chatRoutes from "../modules/chat/chat.route";
import fanReviewRoutes from "../modules/fan-review/fan-review.route";
import dashboardRoutes from "../modules/dashboard/dashboard.route";

const router = express.Router();

router.use("/auth", authRoutes);
router.use("/users", userRoutes);
router.use("/celebrities", celebrityRoutes);
router.use("/fans", fanRoutes);
router.use("/time-sessions", timeSessionRoutes);
router.use("/bookings", bookingRoutes);
router.use("/chats", chatRoutes);
router.use("/reviews", fanReviewRoutes);
router.use("/dashboard", dashboardRoutes);

export default router;
