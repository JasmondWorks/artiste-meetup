import { MongooseRepository } from "../../utils/crud.util";
import { AppError } from "../../utils/app-error.util";
import Chat, { IChat } from "./chat.model";
import { CreateChatDto, UpdateChatDto } from "./chat.dto";

const populate = [{ path: "fanId" }, { path: "celebrityId" }];

export class ChatService {
  private repo: MongooseRepository<IChat>;

  constructor() {
    this.repo = new MongooseRepository(Chat);
  }

  async getAllChats(queryParams: Record<string, any> = {}) {
    return this.repo.findAll(queryParams, {}, [], populate);
  }

  async getMyChatsByFanId(fanId: string, queryParams: Record<string, any> = {}) {
    return this.repo.findAll(queryParams, { fanId }, [], populate);
  }

  async getChatById(id: string) {
    const chat = await Chat.findById(id).populate(populate).exec();
    if (!chat) throw new AppError("Chat not found", 404);
    return chat;
  }

  async createChat(data: CreateChatDto) {
    return this.repo.create(data as any);
  }

  async updateChat(id: string, data: Partial<UpdateChatDto>) {
    const chat = await this.repo.findById(id);
    if (!chat) throw new AppError("Chat not found", 404);
    return this.repo.update(id, data as any);
  }

  async deleteChat(id: string) {
    const chat = await this.repo.findById(id);
    if (!chat) throw new AppError("Chat not found", 404);
    return this.repo.delete(id);
  }
}
