import type { ID } from "../../types/common.types.js";

export const UserRole = {
  ADMIN: "ADMIN",
  MANAGER: "MANAGER",
  TECHNICIAN: "TECHNICIAN",
} as const;

export type UserRole = (typeof UserRole)[keyof typeof UserRole];

export const UserStatus = {
  ACTIVE: "ACTIVE",
  INACTIVE: "INACTIVE",
  SUSPENDED: "SUSPENDED",
} as const;

export type UserStatus = (typeof UserStatus)[keyof typeof UserStatus];

export interface User {
  _id: ID;
  firstName: string;
  lastName: string;
  email: string;

  role: UserRole;
  skills: string[];
  availability: boolean;
  status: UserStatus;

  avatar: string;
  experience: number;

  currentTasks: number;
  assignedMissions: ID[];

  maxTasks: number;
  workloadScore: number;
  totalTasksDone: number;

  twoFactorEnabled?: boolean;

  createdAt: string;
  updatedAt: string;
}

export type PopulatedUser = {
  _id: ID;
  email: string;
  firstName: string;
  lastName: string;
  avatar: string;
};
