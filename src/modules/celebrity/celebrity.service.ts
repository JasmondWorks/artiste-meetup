import { MongooseRepository } from "../../utils/crud.util";
import { AppError } from "../../utils/app-error.util";
import Celebrity, { ICelebrity } from "./celebrity.model";
import { CreateCelebrityDto, UpdateCelebrityDto } from "./celebrity.dto";

export class CelebrityService {
  private repo: MongooseRepository<ICelebrity>;

  constructor() {
    this.repo = new MongooseRepository(Celebrity);
  }

  async getAllCelebrities(queryParams: Record<string, any> = {}) {
    const { name, interest, ...rest } = queryParams;
    const filter: Record<string, any> = {};

    if (name) filter.name = new RegExp(name as string, "i");
    if (interest) filter.interests = new RegExp(interest as string, "i");

    return this.repo.findAll(rest, filter, [], "userId");
  }

  async getCelebrityById(id: string) {
    const celebrity = await Celebrity.findById(id).populate("userId").exec();
    if (!celebrity) throw new AppError("Celebrity not found", 404);
    return celebrity;
  }

  async createCelebrity(data: CreateCelebrityDto) {
    return this.repo.create(data as any);
  }

  async updateCelebrity(id: string, data: Partial<UpdateCelebrityDto>) {
    const celebrity = await this.repo.findById(id);
    if (!celebrity) throw new AppError("Celebrity not found", 404);
    return this.repo.update(id, data);
  }

  async deleteCelebrity(id: string) {
    const celebrity = await this.repo.findById(id);
    if (!celebrity) throw new AppError("Celebrity not found", 404);
    return this.repo.delete(id);
  }
}
