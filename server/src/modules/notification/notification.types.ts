import type { ID } from "../../types/common.types.js";

export type NotificationType =
  | "FRIEND"
  | "MISSION"
  | "MATERIAL"
  | "SYSTEM"
  | "CHAT"
  | "ROOM";

export interface Notification {
  _id: ID;

  userId: ID;

  title: string;
  message: string;

  type: NotificationType;

  isRead: boolean;

  relatedId?: ID;

  createdAt: string;
  updatedAt: string;
}
