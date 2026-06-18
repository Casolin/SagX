export type ID = string;

export type Priority = "LOW" | "MEDIUM" | "HIGH" | "URGENT";

export type FailureType =
  | "NONE"
  | "ELECTRICAL"
  | "MECHANICAL"
  | "HYDRAULIC"
  | "SENSOR"
  | "OVERHEAT"
  | "UNKNOWN";

export type ApiResponse<T> = {
  success: boolean;
  data: T;
};
