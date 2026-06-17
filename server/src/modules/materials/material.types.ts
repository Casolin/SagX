import type { ID, FailureType } from "../../types/common.types.js";

export interface Material {
  _id: ID;
  name: string;
  quantity: number;
  unit: string;

  description?: string;
  failureTypes: FailureType[];
  machineTypes: string[];

  createdAt: string;
  updatedAt: string;
}

export interface CreateMaterialDTO {
  name: string;
  quantity?: number;
  unit?: string;
  description?: string;
  failureTypes?: string[];
  machineTypes?: string[];
}
