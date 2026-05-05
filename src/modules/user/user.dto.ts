import { UserRole } from "./user.entity";

/**
 * @openapi
 * components:
 *   schemas:
 *     UpdateMyProfileDto:
 *       type: object
 *       properties:
 *         name:
 *           type: string
 *           example: "Ada Okafor"
 *         phoneNumber:
 *           type: string
 *           example: "+2348012345678"
 *         country:
 *           type: string
 *           example: "Nigeria"
 *         bio:
 *           type: string
 *           example: "Software engineer and music lover."
 *         profilePicture:
 *           type: string
 *           format: uri
 *           example: "https://cdn.example.com/avatars/ada.jpg"
 *
 *     UserProfileResponse:
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
 *             _id:
 *               type: string
 *             name:
 *               type: string
 *             email:
 *               type: string
 *             roles:
 *               type: array
 *               items:
 *                 type: string
 *                 enum: [FAN, CELEBRITY, ADMIN]
 *             phoneNumber:
 *               type: string
 *             country:
 *               type: string
 *             bio:
 *               type: string
 *             profilePicture:
 *               type: string
 *             isEmailVerified:
 *               type: boolean
 *             isFirstLogin:
 *               type: boolean
 *             createdAt:
 *               type: string
 *               format: date-time
 *             updatedAt:
 *               type: string
 *               format: date-time
 */

export class CreateUserDto {
  name!: string;
  email!: string;
  password!: string;
  roles!: UserRole[];
}

export class UpdateUserDto {
  name?: string;
  email?: string;
  password?: string;
  roles?: UserRole[];
  phoneNumber?: string;
  country?: string;
  bio?: string;
  profilePicture?: string;
}

export class UpdateMyProfileDto {
  name?: string;
  phoneNumber?: string;
  country?: string;
  bio?: string;
  profilePicture?: string;
}
