import type { ID, Priority, FailureType } from "../../types/common.types.js";

import type { PopulatedMachine } from "../machines/machine.types.js";

export type AlertType =
  | "FAILURE"
  | "ANOMALY"
  | "MAINTENANCE"
  | "MACHINE_FAILURE";

export type AlertStatus = "OPEN" | "IN_PROGRESS" | "RESOLVED" | "CANCELLED";

export interface Alert {
  _id: ID;

  machine: ID | PopulatedMachine;

  type: AlertType;
  message: string;

  priority: Priority;
  status: AlertStatus;

  failureType: FailureType;

  missionId?: ID | null;

  createdAt: string;
  updatedAt: string;
}
