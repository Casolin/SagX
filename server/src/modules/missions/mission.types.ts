import type {
  ID,
  Priority,
  FailureType,
  ApiResponse,
} from "../../types/common.types.js";

import type { MachineCondition } from "../machines/machine.types.js";

import type { PopulatedUser } from "../users/user.types.js";

/* ================= TASK ================= */

export type TaskStatus = "PENDING" | "IN_PROGRESS" | "COMPLETED" | "BLOCKED";

export type TaskPriority = Priority;

export type TaskSource = "AUTO" | "MANUAL";

export interface Task {
  _id: ID;

  title: string;
  description?: string;

  source: TaskSource;

  machine?: ID | null;

  status: TaskStatus;
  priority: TaskPriority;

  dueDate?: string | null;

  estimatedTime: number;
  progress: number;

  createdAt?: string;
  updatedAt?: string;
}

export interface UpdateTaskStatusDTO {
  status: TaskStatus;
}

/* ================= MISSION ================= */

export type MissionStatus =
  | "PENDING"
  | "ASSIGNED"
  | "IN_PROGRESS"
  | "COMPLETED"
  | "CANCELLED";

export type MissionPriority = "LOW" | "MEDIUM" | "HIGH" | "URGENT";

export interface MissionMaterial {
  materialId: ID;
  quantity: number;
}

export interface MissionSchedule {
  scheduledAt: string;
  dueDate: string;
}

export interface Mission {
  _id: ID;

  title: string;
  description: string;

  alertId?: ID | null;
  machine?: ID | null;

  machineType?: string;

  failureType?: FailureType;
  condition?: MachineCondition;

  status: MissionStatus;

  cancellationReason?: string | null;

  priority: Priority;

  createdBy: ID | PopulatedUser;

  assignedTo?: ID | PopulatedUser | null;

  missionSchedule: MissionSchedule;

  location?: string;

  requiredSkills: string[];

  materials: MissionMaterial[];

  tasks: Task[];

  progress: number;

  notes?: string;

  createdAt: string;
  updatedAt: string;
}

/* ================= DTOs ================= */

export interface CreateMissionDTO {
  title: string;
  description: string;

  createdBy?: string;

  alertId?: string;
  machine?: string;

  machineType?: string;

  failureType?: string;
  condition?: string;

  priority?: MissionPriority;

  assignedTo?: string;

  missionSchedule?: {
    scheduledAt?: string;
    dueDate?: string;
  };

  location?: string;

  requiredSkills?: string[];

  materials?: MissionMaterial[];

  tasks?: Omit<Task, "_id" | "createdAt" | "updatedAt">[];

  notes?: string;
  source?: string;
}

export type UpdateMissionDTO = Partial<CreateMissionDTO> & {
  status?: MissionStatus;
  cancellationReason?: string;
};

/* ================= RESPONSES ================= */

export type MissionsResponse = ApiResponse<Mission[]>;
