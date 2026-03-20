import bcrypt from "bcrypt";
import jwt from "jsonwebtoken";
import config from "../../config/env.config";
import { AppError } from "../../utils/app-error.util";
import { generateOTP, hashOTP } from "../../utils/otp.util";
import { sendVerificationEmail } from "../../utils/email.util";
import type { UserService } from "../user/user.service";
import { LoginUserDto, RegisterUserDto, VerifyEmailDto } from "./auth.dto";

export class AuthService {
  constructor(private userService: UserService) {}

  generateTokens(userId: string) {
    const accessToken = jwt.sign({ id: userId }, config.jwt.accessSecret, {
      expiresIn: config.jwt.accessTokenExpiresIn as string,
    });

    const refreshToken = jwt.sign({ id: userId }, config.jwt.refreshSecret, {
      expiresIn: config.jwt.refreshTokenExpiresIn as string,
    });

    return { accessToken, refreshToken };
  }

  // Internal helper
  /** Generates a fresh OTP, persists the hash, and emails it to the user. */
  private async issueVerificationOTP(userId: string, email: string, name: string) {
    const otp = generateOTP();
    const expires = new Date(Date.now() + 10 * 60 * 1000); // 10 minutes
    await this.userService.setEmailVerificationOTP(userId, hashOTP(otp), expires);
    await sendVerificationEmail(email, name, otp);
  }

  // Auth flows

  async register(data: RegisterUserDto) {
    const hashed = await bcrypt.hash(data.password, 10);
    const user = await this.userService.createUser({ ...data, password: hashed });

    await this.issueVerificationOTP(user._id.toString(), user.email, user.name);

    // No tokens yet - user must verify email first
    return { user };
  }

  async login(data: LoginUserDto) {
    const user = await this.userService.getUserByEmail(data.email.toLowerCase());
    if (!user) throw new AppError("User with this email not found", 404);

    const isValid = await bcrypt.compare(data.password, user.password);
    if (!isValid) throw new AppError("Invalid email or password", 401);

    if (!user.isEmailVerified) {
      // Auto-resend a fresh OTP so the user can complete verification
      await this.issueVerificationOTP(user._id.toString(), user.email, user.name);
      throw new AppError(
        "Email not verified. A new OTP has been sent to your email.",
        403,
      );
    }

    // Capture before flipping so the response reflects the true first-login state
    const isFirstLogin = user.isFirstLogin;
    if (isFirstLogin) {
      await this.userService.clearFirstLogin(user._id.toString());
    }

    const tokens = this.generateTokens(user._id.toString());
    return { user, tokens, isFirstLogin };
  }

  async verifyEmail(data: VerifyEmailDto) {
    const user = await this.userService.getUserWithOTPByEmail(data.email.toLowerCase());
    if (!user) throw new AppError("User not found", 404);

    if (user.isEmailVerified) throw new AppError("Email is already verified", 400);

    if (!user.emailVerificationOTP || !user.emailVerificationOTPExpires) {
      throw new AppError("No pending OTP found. Please request a new one.", 400);
    }

    if (user.emailVerificationOTPExpires < new Date()) {
      throw new AppError("OTP has expired. Please request a new one.", 400);
    }

    if (hashOTP(data.otp) !== user.emailVerificationOTP) {
      throw new AppError("Invalid OTP", 400);
    }

    // Verification passed - mark verified and wipe OTP fields
    await this.userService.markEmailVerified(user._id.toString());

    const tokens = this.generateTokens(user._id.toString());
    // isFirstLogin is still true here — it only flips on the first login() call
    return { user, tokens, isFirstLogin: user.isFirstLogin };
  }

  async resendVerificationOTP(email: string) {
    const user = await this.userService.getUserByEmail(email.toLowerCase());
    if (!user) throw new AppError("User with this email not found", 404);

    if (user.isEmailVerified) throw new AppError("Email is already verified", 400);

    await this.issueVerificationOTP(user._id.toString(), user.email, user.name);
  }

  async refreshTokens(refreshToken: string) {
    try {
      const decoded = jwt.verify(
        refreshToken,
        config.jwt.refreshSecret,
      ) as { id: string };

      const user = await this.userService.getUserById(decoded.id);
      const tokens = this.generateTokens(user._id.toString());
      return { user, tokens };
    } catch {
      throw new AppError("Invalid or expired refresh token", 401);
    }
  }
}
