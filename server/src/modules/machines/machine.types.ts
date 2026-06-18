import type { ID, FailureType } from "../../types/common.types.js";

export type MachineStatus = "OK" | "DOWN" | "MAINTENANCE";

export type MachineCondition = "NORMAL" | "ANOMALY" | "FAILURE";

export interface Machine {
  _id: ID;
  name: string;
  createdBy: ID;
  type: string;

  failureType: FailureType;
  status: MachineStatus;
  condition: MachineCondition;

  location?: string;
  description?: string;

  createdAt: string;
  updatedAt: string;
}

export interface CreateMachineDTO {
  name: string;
  type: string;
  createdBy: string;
  failureType?: FailureType;
  status?: MachineStatus;
  condition?: MachineCondition;
  location?: string;
  description?: string;
}

export interface UpdateMachineDTO {
  name?: string;
  type?: string;
  failureType?: FailureType;
  status?: MachineStatus;
  condition?: MachineCondition;
  location?: string;
  description?: string;
}

export type PopulatedMachine = {
  _id: ID;
  name: string;
};
