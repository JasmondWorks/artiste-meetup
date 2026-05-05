export interface User {
  id: string;
  name: string;
  email: string;
  roles: UserRole[];
  phoneNumber?: string;
  country?: string;
  bio?: string;
  profilePicture?: string;
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
