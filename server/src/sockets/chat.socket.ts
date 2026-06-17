import { Server, Socket } from "socket.io";
import { SOCKET_EVENTS } from "./socket.events.js";

export const initChatSocket = (io: Server, socket: Socket) => {
  socket.on("join_room", (roomId: string) => {
    if (!roomId) return;
    socket.join(String(roomId));
  });

  socket.on(SOCKET_EVENTS.MESSAGE_PRIVATE, (message) => {
    if (!message?.receiver) return;

    const receiverId =
      typeof message.receiver === "object"
        ? message.receiver._id
        : message.receiver;

    const senderId =
      typeof message.sender === "object" ? message.sender._id : message.sender;

    io.to(String(receiverId))
      .to(String(senderId))
      .emit(SOCKET_EVENTS.MESSAGE_PRIVATE, message);
  });

  socket.on(SOCKET_EVENTS.MESSAGE_ROOM, (message) => {
    if (!message?.roomId) return;

    io.to(String(message.roomId)).emit(SOCKET_EVENTS.MESSAGE_ROOM, message);
  });

  socket.on(SOCKET_EVENTS.MESSAGE_PRIVATE_UPDATED, (msg) => {
    if (!msg?.receiver) return;

    const receiverId =
      typeof msg.receiver === "object" ? msg.receiver._id : msg.receiver;

    const senderId =
      typeof msg.sender === "object" ? msg.sender._id : msg.sender;

    io.to(String(receiverId))
      .to(String(senderId))
      .emit(SOCKET_EVENTS.MESSAGE_PRIVATE_UPDATED, msg);
  });

  socket.on(SOCKET_EVENTS.MESSAGE_ROOM_UPDATED, (msg) => {
    if (!msg?.roomId) return;

    io.to(String(msg.roomId)).emit(SOCKET_EVENTS.MESSAGE_ROOM_UPDATED, msg);
  });

  socket.on(
    SOCKET_EVENTS.MESSAGE_PRIVATE_DELETED,
    ({ messageId, receiverId, senderId }) => {
      io.to(String(receiverId))
        .to(String(senderId))
        .emit(SOCKET_EVENTS.MESSAGE_PRIVATE_DELETED, messageId);
    },
  );

  socket.on(SOCKET_EVENTS.MESSAGE_ROOM_DELETED, ({ roomId, messageId }) => {
    io.to(String(roomId)).emit(SOCKET_EVENTS.MESSAGE_ROOM_DELETED, messageId);
  });
};
