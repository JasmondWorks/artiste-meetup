import { MongooseRepository } from "../../utils/crud.util";
import { AppError } from "../../utils/app-error.util";
import User, { IUser } from "./user.model";
import { CreateUserDto, UpdateUserDto } from "./user.dto";

export class UserService {
  private repo: MongooseRepository<IUser>;

  constructor() {
    this.repo = new MongooseRepository(User);
  }

  async getAllUsers() {
    return this.repo.findAll();
  }

  async getUserById(id: string) {
    const user = await this.repo.findById(id);
    if (!user) throw new AppError("User not found", 404);
    return user;
  }

  async getUserByEmail(email: string) {
    return User.findOne({ email }).select("+password").exec();
  }

  /**
   * Fetches a user with OTP fields included (needed for email verification).
   * These fields are select:false by default and never returned in normal queries.
   */
  async getUserWithOTPByEmail(email: string) {
    return User.findOne({ email })
      .select("+emailVerificationOTP +emailVerificationOTPExpires")
      .exec();
  }

  /** Saves a hashed OTP and its expiry to the user document. */
  async setEmailVerificationOTP(userId: string, hashedOTP: string, expires: Date) {
    await User.findByIdAndUpdate(userId, {
      emailVerificationOTP: hashedOTP,
      emailVerificationOTPExpires: expires,
    });
  }

  /** Marks the user's email as verified and wipes the OTP fields. */
  async markEmailVerified(userId: string) {
    await User.findByIdAndUpdate(userId, {
      isEmailVerified: true,
      $unset: { emailVerificationOTP: 1, emailVerificationOTPExpires: 1 },
    });
  }

  /**
   * Clears the first-login flag after the user's first successful login.
   * Called once; all subsequent logins will have isFirstLogin = false.
   */
  async clearFirstLogin(userId: string) {
    await User.findByIdAndUpdate(userId, { isFirstLogin: false });
  }

  async createUser(data: Partial<CreateUserDto> & Record<string, unknown>) {
    const existing = await this.repo.findOne({ email: data.email });
    if (existing) throw new AppError("Email already in use", 400);
    return this.repo.create(data);
  }

  async updateUser(id: string, data: Partial<UpdateUserDto>) {
    const user = await this.repo.findById(id);
    if (!user) throw new AppError("User not found", 404);
    return this.repo.update(id, data);
  }

  async deleteUser(id: string) {
    const user = await this.repo.findById(id);
    if (!user) throw new AppError("User not found", 404);
    return this.repo.delete(id);
  }
}
