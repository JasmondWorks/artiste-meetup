export interface User {
  id: string;
  name: string;
  email: string;
  role: UserRole;
  isEmailVerified: boolean;
  isFirstLogin: boolean;
  createdAt: Date;
  updatedAt: Date;
}

export enum UserRole {
  CUSTOMER = "CUSTOMER",
  ARTISTE = "ARTISTE",
  ADMIN = "ADMIN",
  SUPER_ADMIN = "SUPER_ADMIN",
}

export const userRoles = [
  UserRole.SUPER_ADMIN,
  UserRole.ADMIN,
  UserRole.ARTISTE,
  UserRole.CUSTOMER,
];
