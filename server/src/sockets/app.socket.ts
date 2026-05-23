import { Server, Socket } from "socket.io";
import { SOCKET_EVENTS } from "./socket.events.js";

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
    socket.on(SOCKET_EVENTS.CALL_OFFER, (data) => {
      try {
        const { to, offer, caller } = data;

        if (!to || !offer) return;

        io.to(String(to)).emit(SOCKET_EVENTS.CALL_OFFER, {
          offer,
          caller,
        });
      } catch (err) {
        console.error("CALL_OFFER ERROR:", err);
      }
    });

    // =========================
    // CALL ANSWER
    // =========================
    socket.on(SOCKET_EVENTS.CALL_ANSWER, (data) => {
      try {
        const { to, answer } = data;

        if (!to || !answer) return;

        io.to(String(to)).emit(SOCKET_EVENTS.CALL_ANSWER, {
          answer,
        });
      } catch (err) {
        console.error("CALL_ANSWER ERROR:", err);
      }
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
      try {
        if (!to) return;

        io.to(String(to)).emit(SOCKET_EVENTS.CALL_END);
      } catch (err) {
        console.error("CALL_END ERROR:", err);
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
