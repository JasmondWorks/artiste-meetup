import { MongooseRepository } from "@/utils/crud.util";
import { AppError } from "@/utils/app-error.util";
import User, { IUser } from "./models/user.model";
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
