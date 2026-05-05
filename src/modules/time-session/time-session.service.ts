import { MongooseRepository } from "../../utils/crud.util";
import { AppError } from "../../utils/app-error.util";
import TimeSession, { ITimeSession } from "./time-session.model";
import { CreateTimeSessionDto, UpdateTimeSessionDto } from "./time-session.dto";

export class TimeSessionService {
  private repo: MongooseRepository<ITimeSession>;

  constructor() {
    this.repo = new MongooseRepository(TimeSession);
  }

  async getAllTimeSessions(queryParams: Record<string, any> = {}) {
    return this.repo.findAll(queryParams, {}, [], "celebrityId");
  }

  async getAvailableTimeSessions(celebrityId: string, queryParams: Record<string, any> = {}) {
    return this.repo.findAll(queryParams, { celebrityId, isBooked: false }, [], "celebrityId");
  }

  async getTimeSessionById(id: string) {
    const session = await TimeSession.findById(id).populate("celebrityId").exec();
    if (!session) throw new AppError("Time session not found", 404);
    return session;
  }

  async createTimeSession(data: CreateTimeSessionDto) {
    return this.repo.create(data as any);
  }

  async updateTimeSession(id: string, data: Partial<UpdateTimeSessionDto>) {
    const session = await this.repo.findById(id);
    if (!session) throw new AppError("Time session not found", 404);
    if (session.isBooked) throw new AppError("Cannot edit a booked time session", 400);
    return this.repo.update(id, data);
  }

  async deleteTimeSession(id: string) {
    const session = await this.repo.findById(id);
    if (!session) throw new AppError("Time session not found", 404);
    if (session.isBooked) throw new AppError("Cannot delete a booked time session", 400);
    return this.repo.delete(id);
  }
}
