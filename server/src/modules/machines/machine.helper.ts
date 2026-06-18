import User from "../../modules/users/user.model.js";
import { emitToUser } from "../../sockets/socket.service.js";
import { SOCKET_EVENTS } from "../../sockets/socket.events.js";

const emitToRoles = async (roles: string[], event: string, data: any) => {
  const users = await User.find({ role: { $in: roles } }).select("_id");

  users.forEach((user) => {
    emitToUser(user._id.toString(), event, data);
  });
};

/* ---------------- MACHINE CREATED ---------------- */
export const broadcastMachineCreated = async (machine: any) => {
  await emitToRoles(
    ["ADMIN", "MANAGER"],
    SOCKET_EVENTS.MACHINE_CREATED,
    machine,
  );
};

/* ---------------- MACHINE UPDATED ---------------- */
export const broadcastMachineUpdated = async (machine: any) => {
  await emitToRoles(
    ["ADMIN", "MANAGER"],
    SOCKET_EVENTS.MACHINE_UPDATED,
    machine,
  );
};

export const broadcastMachineDeleted = async (machine: any) => {
  await emitToRoles(
    ["ADMIN", "MANAGER"],
    SOCKET_EVENTS.MACHINE_DELETED,
    machine,
  );
};
