import { MongooseRepository } from "../../utils/crud.util";
import { AppError } from "../../utils/app-error.util";
import FanReview, { IFanReview } from "./fan-review.model";
import { CreateFanReviewDto, UpdateFanReviewDto } from "./fan-review.dto";

const populate = [{ path: "fanId" }, { path: "celebrityId" }];

export class FanReviewService {
  private repo: MongooseRepository<IFanReview>;

  constructor() {
    this.repo = new MongooseRepository(FanReview);
  }

  async getReviewsByCelebrity(celebrityId: string, queryParams: Record<string, any> = {}) {
    return this.repo.findAll(queryParams, { celebrityId }, [], populate);
  }

  async getAllReviews(queryParams: Record<string, any> = {}) {
    return this.repo.findAll(queryParams, {}, [], populate);
  }

  async getReviewById(id: string) {
    const review = await FanReview.findById(id).populate(populate).exec();
    if (!review) throw new AppError("Review not found", 404);
    return review;
  }

  async createReview(fanId: string, data: CreateFanReviewDto) {
    const existing = await this.repo.findOne({ fanId, celebrityId: data.celebrityId });
    if (existing) throw new AppError("You have already reviewed this celebrity", 400);
    return this.repo.create({ fanId, ...data } as any);
  }

  async updateReview(id: string, fanId: string, data: Partial<UpdateFanReviewDto>) {
    const review = await this.repo.findById(id);
    if (!review) throw new AppError("Review not found", 404);
    if (review.fanId.toString() !== fanId) {
      throw new AppError("You can only edit your own reviews", 403);
    }
    return this.repo.update(id, data);
  }

  async deleteReview(id: string, fanId: string, isAdmin: boolean) {
    const review = await this.repo.findById(id);
    if (!review) throw new AppError("Review not found", 404);
    if (!isAdmin && review.fanId.toString() !== fanId) {
      throw new AppError("You can only delete your own reviews", 403);
    }
    return this.repo.delete(id);
  }
}
