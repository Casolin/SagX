import { Server, Socket } from "socket.io";
import { SOCKET_EVENTS } from "./socket.events.js";
import { userSockets, pendingCalls } from "./socket.state.js";
import { initChatSocket } from "./chat.socket.js";
import { initCallSocket } from "./call.socket.js";

export const initAppSocket = (io: Server) => {
  io.on("connection", (socket: Socket) => {
    const userId = socket.handshake.auth?.userId;

    if (userId) {
      socket.join(String(userId));

      if (!userSockets.has(userId)) {
        userSockets.set(userId, new Set());
      }

      userSockets.get(userId)!.add(socket.id);

      const pendingCall = pendingCalls.get(userId);

      if (pendingCall) {
        socket.emit(SOCKET_EVENTS.CALL_OFFER, pendingCall);
        pendingCalls.delete(userId);
      }
    }

    initChatSocket(io, socket);
    initCallSocket(io, socket);

    socket.on("disconnect", () => {
      if (!userId) return;

      const sockets = userSockets.get(userId);

      if (sockets) {
        sockets.delete(socket.id);
        if (sockets.size === 0) userSockets.delete(userId);
      }
    });
  });
};
