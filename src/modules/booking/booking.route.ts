import { Router } from "express";
import { BookingController } from "./booking.controller";
import { protect, restrictTo } from "../../middlewares/auth.middleware";
import { validateRequest } from "../../middlewares/validate-request.middleware";
import { catchAsync } from "../../utils/catch-async.util";
import { createBookingValidator } from "./booking.validator";
import { UserRole } from "../user/user.entity";

const controller = new BookingController();
const router = Router();

/**
 * @openapi
 * tags:
 *   - name: Bookings
 *     description: Fan session bookings with celebrities
 */

router.use(protect);

/**
 * @openapi
 * /bookings/my:
 *   get:
 *     summary: Get my bookings
 *     description: "**Private — Any authenticated user.** Returns all bookings made by the current user."
 *     tags: [Bookings]
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: query
 *         name: status
 *         schema:
 *           type: string
 *           enum: [PENDING, CONFIRMED, REJECTED, CANCELLED]
 *       - in: query
 *         name: page
 *         schema:
 *           type: integer
 *           default: 1
 *       - in: query
 *         name: limit
 *         schema:
 *           type: integer
 *           default: 10
 *     responses:
 *       200:
 *         description: Paginated list of your bookings
 */
router.get("/my", catchAsync(controller.getMyBookings.bind(controller)));

/**
 * @openapi
 * /bookings:
 *   post:
 *     summary: Create a booking
 *     description: >
 *       **Private — Any authenticated user.**
 *       Books a specific time session with a celebrity. The slot is locked immediately
 *       on creation (status: PENDING). An admin must confirm or reject it.
 *     tags: [Bookings]
 *     security:
 *       - bearerAuth: []
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             $ref: '#/components/schemas/CreateBookingDto'
 *     responses:
 *       201:
 *         description: Booking created (PENDING)
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/BookingObject'
 *       400:
 *         description: Time slot already booked or validation error
 */
router.post(
  "/",
  createBookingValidator,
  validateRequest,
  catchAsync(controller.create.bind(controller)),
);

/**
 * @openapi
 * /bookings/{id}/cancel:
 *   patch:
 *     summary: Cancel a booking
 *     description: "**Private — Booking owner only.** Only PENDING bookings can be cancelled."
 *     tags: [Bookings]
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: string
 *     responses:
 *       200:
 *         description: Booking cancelled — time slot released
 *       403:
 *         description: Not your booking
 *       400:
 *         description: Booking already cancelled or confirmed
 */
router.patch("/:id/cancel", catchAsync(controller.cancel.bind(controller)));

/**
 * @openapi
 * /bookings:
 *   get:
 *     summary: Get all bookings
 *     description: "**Private — Admin only.**"
 *     tags: [Bookings]
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: query
 *         name: status
 *         schema:
 *           type: string
 *           enum: [PENDING, CONFIRMED, REJECTED, CANCELLED]
 *       - in: query
 *         name: page
 *         schema:
 *           type: integer
 *           default: 1
 *       - in: query
 *         name: limit
 *         schema:
 *           type: integer
 *           default: 10
 *     responses:
 *       200:
 *         description: Paginated list of all bookings
 */
router.get(
  "/",
  restrictTo(UserRole.ADMIN),
  catchAsync(controller.getAll.bind(controller)),
);

/**
 * @openapi
 * /bookings/{id}:
 *   get:
 *     summary: Get booking by ID
 *     description: "**Private — Admin only.**"
 *     tags: [Bookings]
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: string
 *     responses:
 *       200:
 *         description: Booking found
 *       404:
 *         description: Booking not found
 */
router.get(
  "/:id",
  restrictTo(UserRole.ADMIN),
  catchAsync(controller.getById.bind(controller)),
);

/**
 * @openapi
 * /bookings/{id}/confirm:
 *   patch:
 *     summary: Confirm a booking
 *     description: >
 *       **Private — Admin only.** Confirms a PENDING booking.
 *       If the booking has a `telegramUsername`, a Chat record is automatically created.
 *     tags: [Bookings]
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: string
 *     responses:
 *       200:
 *         description: Booking confirmed — chat auto-created if telegramUsername present
 *       400:
 *         description: Only pending bookings can be confirmed
 */
router.patch(
  "/:id/confirm",
  restrictTo(UserRole.ADMIN),
  catchAsync(controller.confirm.bind(controller)),
);

/**
 * @openapi
 * /bookings/{id}/reject:
 *   patch:
 *     summary: Reject a booking
 *     description: "**Private — Admin only.** Rejects a PENDING booking and releases the time slot."
 *     tags: [Bookings]
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: string
 *     responses:
 *       200:
 *         description: Booking rejected — time slot released
 *       400:
 *         description: Only pending bookings can be rejected
 */
router.patch(
  "/:id/reject",
  restrictTo(UserRole.ADMIN),
  catchAsync(controller.reject.bind(controller)),
);

export default router;
