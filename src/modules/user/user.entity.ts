export interface User {
  id: string;
  name: string;
  email: string;
  roles: UserRole[];
  isEmailVerified: boolean;
  isFirstLogin: boolean;
  createdAt: Date;
  updatedAt: Date;
}

export enum UserRole {
  FAN = "FAN",
  CELEBRITY = "CELEBRITY",
  ADMIN = "ADMIN",
}

export const userRoles = [UserRole.ADMIN, UserRole.CELEBRITY, UserRole.FAN];
