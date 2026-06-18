import { Server } from "socket.io";
import { userSockets } from "./socket.state.js";

export const emitToUser = (
  io: Server,
  userId: string,
  event: string,
  data?: any,
) => {
  const sockets = userSockets.get(userId);
  if (!sockets) return;

  sockets.forEach((socketId) => {
    io.to(socketId).emit(event, data);
  });
};
