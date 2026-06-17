import type { ID } from "../../types/common.types.js";
import type { Room } from "../room/room.types.js";

export type MessageType = "private" | "room";

export interface Message {
  _id: ID;
  type: MessageType;

  sender: ID;
  receiver?: ID;
  roomId?: ID;

  isFile?: boolean;
  fileType: string;
  fileName: string;

  content: string;

  createdAt: string;
  updatedAt: string;
}

export type SelectedUser = {
  _id: string;
  firstName: string;
  lastName: string;
  avatar?: string;
};

export type ActiveChat =
  | { type: "user"; user: SelectedUser }
  | { type: "room"; room: Room }
  | null;

export interface SendMessageDTO {
  type: MessageType;
  sender?: string;
  receiver?: string;
  roomId?: string;
  content: string;
}

export interface EditMessageDTO {
  messageId: string;
  content: string;
}

export interface DeleteMessageDTO {
  messageId: string;
}
