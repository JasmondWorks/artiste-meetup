/**
 * @openapi
 * components:
 *   schemas:
 *     CreateTimeSessionDto:
 *       type: object
 *       required: [celebrityId, date, startTime, endTime]
 *       properties:
 *         celebrityId:
 *           type: string
 *           description: Celebrity MongoDB ObjectId
 *           example: "64a1f2b3c4d5e6f7a8b9c0d1"
 *         date:
 *           type: string
 *           format: date
 *           example: "2026-06-15"
 *         startTime:
 *           type: string
 *           example: "10:00"
 *         endTime:
 *           type: string
 *           example: "11:00"
 *
 *     UpdateTimeSessionDto:
 *       type: object
 *       properties:
 *         date:
 *           type: string
 *           format: date
 *         startTime:
 *           type: string
 *         endTime:
 *           type: string
 *
 *     TimeSessionObject:
 *       type: object
 *       properties:
 *         _id:
 *           type: string
 *         celebrityId:
 *           type: object
 *           description: Populated Celebrity
 *         date:
 *           type: string
 *           format: date-time
 *         startTime:
 *           type: string
 *         endTime:
 *           type: string
 *         isBooked:
 *           type: boolean
 *         createdAt:
 *           type: string
 *           format: date-time
 *         updatedAt:
 *           type: string
 *           format: date-time
 */

export class CreateTimeSessionDto {
  celebrityId!: string;
  date!: Date;
  startTime!: string;
  endTime!: string;
}

export class UpdateTimeSessionDto {
  date?: Date;
  startTime?: string;
  endTime?: string;
}
