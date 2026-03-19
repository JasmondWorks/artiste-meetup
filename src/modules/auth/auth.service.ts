import bcrypt from "bcrypt";
import jwt from "jsonwebtoken";
import config from "@/config/app.config";
import { AppError } from "@/utils/app-error.util";
import type { UserService } from "@/modules/user/user.service";
import { LoginUserDto, RegisterUserDto } from "./auth.dto";

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

  async login(data: LoginUserDto) {
    const user = await this.userService.getUserByEmail(data.email.toLowerCase());
    if (!user) throw new AppError("Invalid email or password", 401);

    const isValid = await bcrypt.compare(data.password, user.password);
    if (!isValid) throw new AppError("Invalid email or password", 401);

    const tokens = this.generateTokens(user._id.toString());
    return { user, tokens };
  }

  async register(data: RegisterUserDto) {
    const hashed = await bcrypt.hash(data.password, 10);
    const user = await this.userService.createUser({ ...data, password: hashed });
    const tokens = this.generateTokens(user._id.toString());
    return { user, tokens };
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
