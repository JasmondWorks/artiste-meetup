/**
 * @openapi
 * components:
 *   schemas:
 *     CreateFanDto:
 *       type: object
 *       properties:
 *         bio:
 *           type: string
 *           example: "Huge fan of Afrobeats and basketball."
 *         interests:
 *           type: array
 *           items:
 *             type: string
 *           example: ["Afrobeats", "NBA", "Tech"]
 *
 *     UpdateFanDto:
 *       type: object
 *       properties:
 *         bio:
 *           type: string
 *         interests:
 *           type: array
 *           items:
 *             type: string
 *
 *     FanResponse:
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
 *           example: "Fan profile retrieved successfully"
 *         data:
 *           type: object
 *           properties:
 *             _id:
 *               type: string
 *             userId:
 *               type: object
 *               description: Populated user object
 *               properties:
 *                 _id:
 *                   type: string
 *                 name:
 *                   type: string
 *                 email:
 *                   type: string
 *                 roles:
 *                   type: array
 *                   items:
 *                     type: string
 *                     enum: [FAN, CELEBRITY, ADMIN]
 *             bio:
 *               type: string
 *             interests:
 *               type: array
 *               items:
 *                 type: string
 *             createdAt:
 *               type: string
 *               format: date-time
 *             updatedAt:
 *               type: string
 *               format: date-time
 *
 *     PaginatedFanResponse:
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
 *                 $ref: '#/components/schemas/FanResponse/properties/data'
 *             page:
 *               type: integer
 *               example: 1
 *             limit:
 *               type: integer
 *               example: 10
 *             total:
 *               type: integer
 *               example: 100
 *             totalPages:
 *               type: integer
 *               example: 10
 */

export class CreateFanDto {
  bio?: string;
  interests?: string[];
}

export class UpdateFanDto {
  bio?: string;
  interests?: string[];
}
