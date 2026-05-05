import { Response } from "express";
import { ChatService } from "./chat.service";
import { sendSuccess } from "../../utils/api-response.util";
import { AuthenticatedRequest } from "../../middlewares/auth.middleware";

export class ChatController {
  private service: ChatService;

  constructor() {
    this.service = new ChatService();
  }

  async getAll(req: AuthenticatedRequest, res: Response) {
    const result = await this.service.getAllChats(req.query as Record<string, any>);
    sendSuccess(res, result, "Chats retrieved successfully");
  }

  async getMyChats(req: AuthenticatedRequest, res: Response) {
    const result = await this.service.getMyChatsByFanId(
      req.user!.id,
      req.query as Record<string, any>,
    );
    sendSuccess(res, result, "Your chats retrieved successfully");
  }

  async getById(req: AuthenticatedRequest, res: Response) {
    const chat = await this.service.getChatById(req.params.id);
    sendSuccess(res, chat, "Chat retrieved successfully");
  }

  async create(req: AuthenticatedRequest, res: Response) {
    const chat = await this.service.createChat(req.body);
    sendSuccess(res, chat, "Chat created successfully", 201);
  }

  async update(req: AuthenticatedRequest, res: Response) {
    const chat = await this.service.updateChat(req.params.id, req.body);
    sendSuccess(res, chat, "Chat updated successfully");
  }

  async delete(req: AuthenticatedRequest, res: Response) {
    await this.service.deleteChat(req.params.id);
    sendSuccess(res, null, "Chat deleted successfully");
  }
}
