import type { ID } from "../../types/common.types.js";

export interface Room {
  _id: ID;
  name: string;
  members: ID[];
  isPrivate: boolean;
  roomOwner: ID;

  createdAt: string;
  updatedAt: string;
}

export interface CreateRoomDTO {
  name: string;
  roomOwner?: string;
  members?: string[];
  isPrivate?: boolean;
}
