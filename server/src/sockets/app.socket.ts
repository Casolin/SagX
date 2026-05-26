import { Server, Socket } from "socket.io";
import { SOCKET_EVENTS } from "./socket.events.js";
const activeCalls = new Map<string, { a: string; b: string }>();
const ringingUsers = new Map<string, string>(); // caller → receiver

export const initAppSocket = (io: Server) => {
  io.on("connection", (socket: Socket) => {
    console.log("User connected:", socket.id);

    const userId = socket.handshake.auth?.userId;

    // =========================
    // JOIN PERSONAL ROOM
    // =========================
    if (userId) {
      socket.join(String(userId));

      console.log("User joined room:", String(userId));
    }

    // =========================
    // JOIN CHAT ROOM
    // =========================
    socket.on("join_room", (roomId: string) => {
      if (!roomId) return;

      socket.join(String(roomId));

      console.log(`Socket ${socket.id} joined room ${roomId}`);
    });

    // =========================
    // PRIVATE MESSAGE
    // =========================
    socket.on(SOCKET_EVENTS.MESSAGE_PRIVATE, (message) => {
      try {
        if (!message?.receiver) return;

        const receiverId =
          typeof message.receiver === "object"
            ? message.receiver._id
            : message.receiver;

        const senderId =
          typeof message.sender === "object"
            ? message.sender._id
            : message.sender;

        io.to(String(receiverId))
          .to(String(senderId))
          .emit(SOCKET_EVENTS.MESSAGE_PRIVATE, message);
      } catch (err) {
        console.error("MESSAGE_PRIVATE ERROR:", err);
      }
    });

    // =========================
    // ROOM MESSAGE
    // =========================
    socket.on(SOCKET_EVENTS.MESSAGE_ROOM, (message) => {
      try {
        if (!message?.roomId) return;

        io.to(String(message.roomId)).emit(SOCKET_EVENTS.MESSAGE_ROOM, message);
      } catch (err) {
        console.error("MESSAGE_ROOM ERROR:", err);
      }
    });

    // =========================
    // PRIVATE UPDATE
    // =========================
    socket.on(SOCKET_EVENTS.MESSAGE_PRIVATE_UPDATED, (updatedMessage) => {
      try {
        if (!updatedMessage?.receiver) return;

        const receiverId =
          typeof updatedMessage.receiver === "object"
            ? updatedMessage.receiver._id
            : updatedMessage.receiver;

        const senderId =
          typeof updatedMessage.sender === "object"
            ? updatedMessage.sender._id
            : updatedMessage.sender;

        io.to(String(receiverId))
          .to(String(senderId))
          .emit(SOCKET_EVENTS.MESSAGE_PRIVATE_UPDATED, updatedMessage);
      } catch (err) {
        console.error("MESSAGE_PRIVATE_UPDATED ERROR:", err);
      }
    });

    // =========================
    // ROOM UPDATE
    // =========================
    socket.on(SOCKET_EVENTS.MESSAGE_ROOM_UPDATED, (updatedMessage) => {
      try {
        if (!updatedMessage?.roomId) return;

        io.to(String(updatedMessage.roomId)).emit(
          SOCKET_EVENTS.MESSAGE_ROOM_UPDATED,
          updatedMessage,
        );
      } catch (err) {
        console.error("MESSAGE_ROOM_UPDATED ERROR:", err);
      }
    });

    // =========================
    // PRIVATE DELETE
    // =========================
    socket.on(
      SOCKET_EVENTS.MESSAGE_PRIVATE_DELETED,
      ({ messageId, receiverId, senderId }) => {
        try {
          io.to(String(receiverId))
            .to(String(senderId))
            .emit(SOCKET_EVENTS.MESSAGE_PRIVATE_DELETED, messageId);
        } catch (err) {
          console.error("MESSAGE_PRIVATE_DELETED ERROR:", err);
        }
      },
    );

    // =========================
    // ROOM DELETE
    // =========================
    socket.on(SOCKET_EVENTS.MESSAGE_ROOM_DELETED, ({ roomId, messageId }) => {
      try {
        io.to(String(roomId)).emit(
          SOCKET_EVENTS.MESSAGE_ROOM_DELETED,
          messageId,
        );
      } catch (err) {
        console.error("MESSAGE_ROOM_DELETED ERROR:", err);
      }
    });

    // =========================
    // CALL OFFER
    // =========================
    socket.on(SOCKET_EVENTS.CALL_OFFER, ({ to, offer, caller }) => {
      const callerId = String(caller._id);
      const receiverId = String(to);

      if (activeCalls.has(callerId) || activeCalls.has(receiverId)) {
        io.to(callerId).emit("CALL_BUSY");
        return;
      }

      ringingUsers.set(callerId, receiverId);

      io.to(receiverId).emit(SOCKET_EVENTS.CALL_OFFER, {
        offer,
        caller,
      });
    });

    // =========================
    // CALL ANSWER
    // =========================
    socket.on(SOCKET_EVENTS.CALL_ANSWER, ({ to, answer }) => {
      const userId = String(socket.handshake.auth?.userId);

      const callerId = to;

      activeCalls.set(userId, { a: userId, b: callerId });
      activeCalls.set(callerId, { a: userId, b: callerId });

      ringingUsers.delete(userId);
      ringingUsers.delete(callerId);

      io.to(callerId).emit(SOCKET_EVENTS.CALL_ANSWER, { answer });
    });

    // =========================
    // ICE CANDIDATE
    // =========================
    socket.on(SOCKET_EVENTS.CALL_ICE_CANDIDATE, (data) => {
      try {
        const { to, candidate } = data;

        if (!to || !candidate) return;

        io.to(String(to)).emit(SOCKET_EVENTS.CALL_ICE_CANDIDATE, {
          candidate,
        });
      } catch (err) {
        console.error("CALL_ICE_CANDIDATE ERROR:", err);
      }
    });

    // =========================
    // CALL REJECT
    // =========================
    socket.on(SOCKET_EVENTS.CALL_REJECT, ({ to }) => {
      try {
        if (!to) return;

        io.to(String(to)).emit(SOCKET_EVENTS.CALL_REJECT);
      } catch (err) {
        console.error("CALL_REJECT ERROR:", err);
      }
    });

    // =========================
    // CALL END
    // =========================
    socket.on(SOCKET_EVENTS.CALL_END, ({ to }) => {
      const from = String(socket.handshake.auth?.userId);

      const call = activeCalls.get(from);

      if (!call) return;

      const other = call.a === from ? call.b : call.a;

      activeCalls.delete(call.a);
      activeCalls.delete(call.b);

      io.to(other).emit(SOCKET_EVENTS.CALL_END);
    });

    // =========================
    // CANCEL OUTGOING CALL
    // =========================
    socket.on(SOCKET_EVENTS.CALL_CANCEL, ({ to }) => {
      const from = String(socket.handshake.auth?.userId);

      // only cancel ringing
      if (ringingUsers.get(from) === to) {
        ringingUsers.delete(from);

        io.to(to).emit(SOCKET_EVENTS.CALL_CANCEL, { from });
      }
    });

    // =========================
    // DISCONNECT
    // =========================
    socket.on("disconnect", () => {
      console.log("User disconnected:", socket.id);
    });
  });
};
