/**
 * @openapi
 * components:
 *   schemas:
 *     CreateBookingDto:
 *       type: object
 *       required: [celebrityId, timeSessionId]
 *       properties:
 *         celebrityId:
 *           type: string
 *           example: "64a1f2b3c4d5e6f7a8b9c0d1"
 *         timeSessionId:
 *           type: string
 *           example: "64a1f2b3c4d5e6f7a8b9c0d2"
 *         message:
 *           type: string
 *           description: Why you're a fan and what you'd like to discuss
 *           example: "I've followed your career since 2018 and would love to discuss your creative process."
 *         telegramUsername:
 *           type: string
 *           description: Optional Telegram handle for seamless chat integration
 *           example: "@ada_okafor"
 *
 *     BookingObject:
 *       type: object
 *       properties:
 *         _id:
 *           type: string
 *         fanId:
 *           type: object
 *           description: Populated Fan
 *         celebrityId:
 *           type: object
 *           description: Populated Celebrity
 *         timeSessionId:
 *           type: object
 *           description: Populated TimeSession
 *         message:
 *           type: string
 *         telegramUsername:
 *           type: string
 *         status:
 *           type: string
 *           enum: [PENDING, CONFIRMED, REJECTED, CANCELLED]
 *         createdAt:
 *           type: string
 *           format: date-time
 *         updatedAt:
 *           type: string
 *           format: date-time
 */

export class CreateBookingDto {
  celebrityId!: string;
  timeSessionId!: string;
  message?: string;
  telegramUsername?: string;
}
