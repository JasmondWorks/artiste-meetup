import { NextFunction, Request, Response } from "express";
import { UserService } from "./user.service";
import { sendSuccess } from "../../utils/api-response.util";

export class UserController {
  private userService: UserService;

  constructor() {
    this.userService = new UserService();
  }

  public async getAllUsers(req: Request, res: Response, next: NextFunction) {
    try {
      const users = await this.userService.getAllUsers();
      sendSuccess(res, users, "Users retrieved successfully");
    } catch (error) {
      next(error);
    }
  }

  public async getUserById(req: Request, res: Response, next: NextFunction) {
    try {
      const user = await this.userService.getUserById(req.params.id);
      sendSuccess(res, user, "User retrieved successfully");
    } catch (error) {
      next(error);
    }
  }

  public async updateUser(req: Request, res: Response, next: NextFunction) {
    try {
      const user = await this.userService.updateUser(req.params.id, req.body);
      sendSuccess(res, user, "User updated successfully");
    } catch (error) {
      next(error);
    }
  }

  public async deleteUser(req: Request, res: Response, next: NextFunction) {
    try {
      await this.userService.deleteUser(req.params.id);
      sendSuccess(res, null, "User deleted successfully");
    } catch (error) {
      next(error);
    }
  }
}
