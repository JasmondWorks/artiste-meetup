import { CelebrityCategory, CelebrityStatus } from "./celebrity.entity";

/**
 * @openapi
 * components:
 *   schemas:
 *     ApplyCelebrityDto:
 *       type: object
 *       required:
 *         - name
 *         - profession
 *         - category
 *         - bookingPrice
 *       properties:
 *         name:
 *           type: string
 *           example: "Burna Boy"
 *         profession:
 *           type: string
 *           example: "Singer & Songwriter"
 *         category:
 *           type: string
 *           enum: [MUSIC_ARTISTE, FILM_ACTOR, PROFESSIONAL_ATHLETE, TECH_ENTREPRENEUR]
 *           example: MUSIC_ARTISTE
 *         bio:
 *           type: string
 *           example: "Grammy-winning Afrobeats artist from Nigeria."
 *         bookingPrice:
 *           type: number
 *           minimum: 0
 *           example: 5000
 *         interests:
 *           type: array
 *           items:
 *             type: string
 *           example: ["Afrobeats", "Reggae", "Fashion"]
 *
 *     CreateCelebrityDto:
 *       type: object
 *       required:
 *         - name
 *         - profession
 *         - category
 *         - bookingPrice
 *       properties:
 *         name:
 *           type: string
 *           example: "Burna Boy"
 *         profession:
 *           type: string
 *           example: "Singer & Songwriter"
 *         category:
 *           type: string
 *           enum: [MUSIC_ARTISTE, FILM_ACTOR, PROFESSIONAL_ATHLETE, TECH_ENTREPRENEUR]
 *           example: MUSIC_ARTISTE
 *         userId:
 *           type: string
 *           nullable: true
 *           description: MongoDB ObjectId of the linked user account (optional)
 *           example: "64a1f2b3c4d5e6f7a8b9c0d1"
 *         status:
 *           type: string
 *           enum: [AVAILABLE, LIMITED, UNAVAILABLE]
 *           default: AVAILABLE
 *         bio:
 *           type: string
 *           example: "Grammy-winning Afrobeats artist from Nigeria."
 *         bookingPrice:
 *           type: number
 *           minimum: 0
 *           example: 5000
 *         interests:
 *           type: array
 *           items:
 *             type: string
 *           example: ["Afrobeats", "Reggae", "Fashion"]
 *
 *     UpdateCelebrityDto:
 *       type: object
 *       properties:
 *         name:
 *           type: string
 *         profession:
 *           type: string
 *         category:
 *           type: string
 *           enum: [MUSIC_ARTISTE, FILM_ACTOR, PROFESSIONAL_ATHLETE, TECH_ENTREPRENEUR]
 *         userId:
 *           type: string
 *           nullable: true
 *         status:
 *           type: string
 *           enum: [AVAILABLE, LIMITED, UNAVAILABLE]
 *         bio:
 *           type: string
 *         bookingPrice:
 *           type: number
 *           minimum: 0
 *         interests:
 *           type: array
 *           items:
 *             type: string
 *
 *     RejectCelebrityDto:
 *       type: object
 *       properties:
 *         reason:
 *           type: string
 *           example: "Insufficient profile information provided."
 *
 *     CelebrityObject:
 *       type: object
 *       properties:
 *         _id:
 *           type: string
 *         name:
 *           type: string
 *         profession:
 *           type: string
 *         category:
 *           type: string
 *           enum: [MUSIC_ARTISTE, FILM_ACTOR, PROFESSIONAL_ATHLETE, TECH_ENTREPRENEUR]
 *         userId:
 *           type: object
 *           nullable: true
 *           description: Populated User object if linked; null otherwise
 *         status:
 *           type: string
 *           enum: [AVAILABLE, LIMITED, UNAVAILABLE]
 *         approvalStatus:
 *           type: string
 *           enum: [APPROVED, PENDING, REJECTED]
 *         rejectionReason:
 *           type: string
 *           nullable: true
 *         bio:
 *           type: string
 *         bookingPrice:
 *           type: number
 *         interests:
 *           type: array
 *           items:
 *             type: string
 *         createdAt:
 *           type: string
 *           format: date-time
 *         updatedAt:
 *           type: string
 *           format: date-time
 *
 *     CelebrityResponse:
 *       type: object
 *       properties:
 *         success:
 *           type: boolean
 *           example: true
 *         statusCode:
 *           type: integer
 *           example: 200
 *         message:
 *           type: string
 *         data:
 *           $ref: '#/components/schemas/CelebrityObject'
 *
 *     PaginatedCelebrityResponse:
 *       type: object
 *       properties:
 *         success:
 *           type: boolean
 *           example: true
 *         statusCode:
 *           type: integer
 *           example: 200
 *         message:
 *           type: string
 *         data:
 *           type: object
 *           properties:
 *             data:
 *               type: array
 *               items:
 *                 $ref: '#/components/schemas/CelebrityObject'
 *             page:
 *               type: integer
 *               example: 1
 *             limit:
 *               type: integer
 *               example: 10
 *             total:
 *               type: integer
 *               example: 42
 *             totalPages:
 *               type: integer
 *               example: 5
 */

export class ApplyCelebrityDto {
  name!: string;
  profession!: string;
  category!: CelebrityCategory;
  bio?: string;
  bookingPrice!: number;
  interests?: string[];
}

export class CreateCelebrityDto {
  name!: string;
  profession!: string;
  category!: CelebrityCategory;
  userId?: string | null;
  status?: CelebrityStatus;
  bio?: string;
  bookingPrice!: number;
  interests?: string[];
}

export class UpdateCelebrityDto {
  name?: string;
  profession?: string;
  category?: CelebrityCategory;
  userId?: string | null;
  status?: CelebrityStatus;
  bio?: string;
  bookingPrice?: number;
  interests?: string[];
}
