import type { ID } from "../../types/common.types.js";
import type { PopulatedUser } from "../users/user.types.js";

export type FriendStatus = "PENDING" | "ACCEPTED" | "REJECTED";

export interface Friend {
  _id: ID;

  requester: ID | PopulatedUser;

  recipient: ID | PopulatedUser;

  status: FriendStatus;

  createdAt: string;
  updatedAt: string;
}
