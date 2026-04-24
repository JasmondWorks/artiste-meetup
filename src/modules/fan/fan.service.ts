import { MongooseRepository } from "../../utils/crud.util";
import { AppError } from "../../utils/app-error.util";
import Fan, { IFan } from "./fan.model";
import { UpdateFanDto } from "./fan.dto";

export class FanService {
  private repo: MongooseRepository<IFan>;

  constructor() {
    this.repo = new MongooseRepository(Fan);
  }

  async getAllFans(queryParams: Record<string, any> = {}) {
    return this.repo.findAll(queryParams, {}, [], "userId");
  }

  async getFanById(id: string) {
    const fan = await Fan.findById(id).populate("userId").exec();
    if (!fan) throw new AppError("Fan not found", 404);
    return fan;
  }

  async getFanByUserId(userId: string) {
    const fan = await Fan.findOne({ userId }).populate("userId").exec();
    if (!fan) throw new AppError("Fan profile not found", 404);
    return fan;
  }

  async createFan(userId: string, data: Partial<UpdateFanDto>) {
    const existing = await this.repo.findOne({ userId });
    if (existing) throw new AppError("Fan profile already exists for this user", 400);
    return this.repo.create({ userId, ...data } as any);
  }

  async updateFan(id: string, data: Partial<UpdateFanDto>) {
    const fan = await this.repo.findById(id);
    if (!fan) throw new AppError("Fan not found", 404);
    return this.repo.update(id, data);
  }

  async updateFanByUserId(userId: string, data: Partial<UpdateFanDto>) {
    const fan = await this.repo.findOne({ userId });
    if (!fan) throw new AppError("Fan profile not found", 404);
    return this.repo.update((fan as any)._id.toString(), data);
  }

  async deleteFan(id: string) {
    const fan = await this.repo.findById(id);
    if (!fan) throw new AppError("Fan not found", 404);
    return this.repo.delete(id);
  }
}
