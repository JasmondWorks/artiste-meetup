export interface BaseUser {
  id: string;
  name: string;
  email: string;
  createdAt: Date;
  updatedAt: Date;
}

export enum UserRole {
  APPLICANT = "APPLICANT",
  EMPLOYEE = "EMPLOYEE",
  ADMIN = "ADMIN",
  SUPER_ADMIN = "SUPER_ADMIN",
}

export const userRoles = [
  UserRole.SUPER_ADMIN,
  UserRole.ADMIN,
  UserRole.EMPLOYEE,
  UserRole.APPLICANT,
];

export interface Applicant extends BaseUser {
  role: UserRole.APPLICANT;
}

export interface Employee extends BaseUser {
  role: UserRole.EMPLOYEE;
}

export interface Admin extends BaseUser {
  role: UserRole.ADMIN;
}

export type User = Applicant | Employee | Admin;
