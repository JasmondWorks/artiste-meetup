import { Request, Response } from "express";
import { UserService } from "./user.service";
import { sendSuccess } from "../../utils/api-response.util";

export class UserController {
  private userService: UserService;

  constructor() {
    this.userService = new UserService();
  }

  async getAllUsers(req: Request, res: Response) {
    const result = await this.userService.getAllUsers(req.query as Record<string, any>);
    sendSuccess(res, result, "Users retrieved successfully");
  }

  async getUserById(req: Request, res: Response) {
    const user = await this.userService.getUserById(req.params.id);
    sendSuccess(res, user, "User retrieved successfully");
  }

  async updateUser(req: Request, res: Response) {
    const user = await this.userService.updateUser(req.params.id, req.body);
    sendSuccess(res, user, "User updated successfully");
  }

  async deleteUser(req: Request, res: Response) {
    await this.userService.deleteUser(req.params.id);
    sendSuccess(res, null, "User deleted successfully");
  }
}
