import { UserRole } from "../user/user.entity";
import type { CreateUserDto as User } from "../user/user.dto";

export class LoginUserDto {
  email!: string;
  password!: string;
}

export class RegisterUserDto {
  name!: string;
  email!: string;
  password!: string;
  roles!: UserRole[];
}

export class LoginResponseDto {
  accessToken!: string;
  user!: User;
}

export class VerifyEmailDto {
  email!: string;
  otp!: string;
}

export class ResendOTPDto {
  email!: string;
}

/**
 * @openapi
 * components:
 *   schemas:
 *     RegisterDto:
 *       type: object
 *       required: [name, email, password]
 *       properties:
 *         name:
 *           type: string
 *           example: "Ada Okafor"
 *         email:
 *           type: string
 *           format: email
 *           example: "ada@example.com"
 *         password:
 *           type: string
 *           minLength: 6
 *           example: "mypassword123"
 *
 *     RegisterResponse:
 *       type: object
 *       properties:
 *         success:
 *           type: boolean
 *           example: true
 *         statusCode:
 *           type: integer
 *           example: 201
 *         message:
 *           type: string
 *           example: "Registration successful. Check your email for a 6-digit OTP."
 *         data:
 *           type: object
 *           properties:
 *             user:
 *               $ref: '#/components/schemas/UserObject'
 *
 *     LoginDto:
 *       type: object
 *       required: [email, password]
 *       properties:
 *         email:
 *           type: string
 *           format: email
 *           example: "ada@example.com"
 *         password:
 *           type: string
 *           example: "mypassword123"
 *
 *     LoginResponse:
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
 *           example: "Login successful"
 *         data:
 *           type: object
 *           properties:
 *             accessToken:
 *               type: string
 *               description: JWT bearer token — include as Authorization header
 *             isFirstLogin:
 *               type: boolean
 *             user:
 *               $ref: '#/components/schemas/UserObject'
 *
 *     VerifyEmailDto:
 *       type: object
 *       required: [email, otp]
 *       properties:
 *         email:
 *           type: string
 *           format: email
 *         otp:
 *           type: string
 *           minLength: 6
 *           maxLength: 6
 *           example: "482916"
 *
 *     ResendOTPDto:
 *       type: object
 *       required: [email]
 *       properties:
 *         email:
 *           type: string
 *           format: email
 *
 *     UserObject:
 *       type: object
 *       properties:
 *         _id:
 *           type: string
 *         name:
 *           type: string
 *         email:
 *           type: string
 *         roles:
 *           type: array
 *           items:
 *             type: string
 *             enum: [FAN, CELEBRITY, ADMIN]
 *         isEmailVerified:
 *           type: boolean
 *         isFirstLogin:
 *           type: boolean
 *         createdAt:
 *           type: string
 *           format: date-time
 *         updatedAt:
 *           type: string
 *           format: date-time
 */
