import { MongooseRepository } from "../../utils/crud.util";
import { AppError } from "../../utils/app-error.util";
import Celebrity, { ICelebrity } from "./celebrity.model";
import { ApplyCelebrityDto, CreateCelebrityDto, UpdateCelebrityDto } from "./celebrity.dto";
import { CelebrityApprovalStatus } from "./celebrity.entity";

export class CelebrityService {
  private repo: MongooseRepository<ICelebrity>;

  constructor() {
    this.repo = new MongooseRepository(Celebrity);
  }

  async getAllCelebrities(queryParams: Record<string, any> = {}, isAdmin = false) {
    const { name, interest, ...rest } = queryParams;
    const filter: Record<string, any> = {};

    // Public listings only show approved profiles
    if (!isAdmin) filter.approvalStatus = CelebrityApprovalStatus.APPROVED;

    if (name) filter.name = new RegExp(name as string, "i");
    if (interest) filter.interests = new RegExp(interest as string, "i");

    return this.repo.findAll(rest, filter, [], "userId");
  }

  async getCelebrityById(id: string, isAdmin: boolean, requesterId?: string) {
    const celebrity = await Celebrity.findById(id).populate("userId").exec();
    if (!celebrity) throw new AppError("Celebrity not found", 404);

    const isOwner = requesterId && celebrity.userId?.toString() === requesterId;
    if (
      !isAdmin &&
      !isOwner &&
      celebrity.approvalStatus !== CelebrityApprovalStatus.APPROVED
    ) {
      throw new AppError("Celebrity not found", 404);
    }

    return celebrity;
  }

  async createCelebrity(data: CreateCelebrityDto) {
    // Admin-created profiles are approved by default (model default handles this)
    return this.repo.create(data as any);
  }

  async applyAsCelebrity(userId: string, data: ApplyCelebrityDto) {
    const existing = await this.repo.findOne({ userId });
    if (existing) throw new AppError("You already have a celebrity profile", 400);

    return this.repo.create({
      ...data,
      userId,
      approvalStatus: CelebrityApprovalStatus.PENDING,
    } as any);
  }

  async approveCelebrity(id: string) {
    const celebrity = await this.repo.findById(id);
    if (!celebrity) throw new AppError("Celebrity not found", 404);
    if (celebrity.approvalStatus === CelebrityApprovalStatus.APPROVED) {
      throw new AppError("Celebrity profile is already approved", 400);
    }
    return this.repo.update(id, {
      approvalStatus: CelebrityApprovalStatus.APPROVED,
      rejectionReason: null,
    } as any);
  }

  async rejectCelebrity(id: string, reason?: string) {
    const celebrity = await this.repo.findById(id);
    if (!celebrity) throw new AppError("Celebrity not found", 404);
    if (celebrity.approvalStatus !== CelebrityApprovalStatus.PENDING) {
      throw new AppError("Only pending profiles can be rejected", 400);
    }
    return this.repo.update(id, {
      approvalStatus: CelebrityApprovalStatus.REJECTED,
      rejectionReason: reason ?? "Application rejected",
    } as any);
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
