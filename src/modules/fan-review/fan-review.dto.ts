/**
 * @openapi
 * components:
 *   schemas:
 *     CreateFanReviewDto:
 *       type: object
 *       required: [celebrityId, rating]
 *       properties:
 *         celebrityId:
 *           type: string
 *           example: "64a1f2b3c4d5e6f7a8b9c0d1"
 *         bookingId:
 *           type: string
 *           description: Optional linked booking
 *         rating:
 *           type: number
 *           minimum: 0
 *           maximum: 5
 *           example: 4.5
 *         comment:
 *           type: string
 *           example: "Amazing session, very engaging and insightful!"
 *
 *     UpdateFanReviewDto:
 *       type: object
 *       properties:
 *         rating:
 *           type: number
 *           minimum: 0
 *           maximum: 5
 *         comment:
 *           type: string
 *
 *     FanReviewObject:
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
 *         rating:
 *           type: number
 *         comment:
 *           type: string
 *         createdAt:
 *           type: string
 *           format: date-time
 *         updatedAt:
 *           type: string
 *           format: date-time
 */

export class CreateFanReviewDto {
  celebrityId!: string;
  bookingId?: string;
  rating!: number;
  comment?: string;
}

export class UpdateFanReviewDto {
  rating?: number;
  comment?: string;
}
