/**
 * @openapi
 * components:
 *   schemas:
 *     CreateChatDto:
 *       type: object
 *       required: [fanId, celebrityId, telegramUsername]
 *       properties:
 *         fanId:
 *           type: string
 *           example: "64a1f2b3c4d5e6f7a8b9c0d1"
 *         celebrityId:
 *           type: string
 *           example: "64a1f2b3c4d5e6f7a8b9c0d2"
 *         bookingId:
 *           type: string
 *           description: Optional linked booking
 *           example: "64a1f2b3c4d5e6f7a8b9c0d3"
 *         telegramUsername:
 *           type: string
 *           example: "@ada_okafor"
 *
 *     UpdateChatDto:
 *       type: object
 *       properties:
 *         status:
 *           type: string
 *           enum: [ACTIVE, INACTIVE]
 *         telegramUsername:
 *           type: string
 *
 *     ChatObject:
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
 *         bookingId:
 *           type: string
 *         telegramUsername:
 *           type: string
 *         status:
 *           type: string
 *           enum: [ACTIVE, INACTIVE]
 *         createdAt:
 *           type: string
 *           format: date-time
 *         updatedAt:
 *           type: string
 *           format: date-time
 */

import { ChatStatus } from "./chat.entity";

export class CreateChatDto {
  fanId!: string;
  celebrityId!: string;
  bookingId?: string;
  telegramUsername!: string;
}

export class UpdateChatDto {
  status?: ChatStatus;
  telegramUsername?: string;
}
