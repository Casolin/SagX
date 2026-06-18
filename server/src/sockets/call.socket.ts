import { Server, Socket } from "socket.io";
import { SOCKET_EVENTS } from "./socket.events.js";
import {
  activeCalls,
  ringingUsers,
  userSockets,
  callTimeouts,
  pendingCalls,
} from "./socket.state.js";
import { emitToUser } from "./socket.utils.js";

export const initCallSocket = (io: Server, socket: Socket) => {
  const userId = String(socket.handshake.auth?.userId);

  // CALL OFFER
  socket.on(SOCKET_EVENTS.CALL_OFFER, ({ to, offer, caller }) => {
    const callerId = String(caller._id);
    const receiverId = String(to);

    if (activeCalls.has(callerId) || activeCalls.has(receiverId)) {
      io.to(callerId).emit("CALL_BUSY");
      return;
    }

    ringingUsers.set(callerId, receiverId);

    const callKey = `${callerId}:${receiverId}`;

    const timeout = setTimeout(() => {
      const stillRinging = ringingUsers.get(callerId) === receiverId;
      const stillNotAnswered =
        !activeCalls.has(callerId) && !activeCalls.has(receiverId);

      if (stillRinging && stillNotAnswered) {
        ringingUsers.delete(callerId);
        callTimeouts.delete(callKey);
        pendingCalls.delete(receiverId);

        emitToUser(io, callerId, SOCKET_EVENTS.CALL_END);
        emitToUser(io, receiverId, SOCKET_EVENTS.CALL_END);
      }
    }, 30000);

    callTimeouts.set(callKey, timeout);

    const receiverSockets = userSockets.get(receiverId);

    if (receiverSockets && receiverSockets.size > 0) {
      emitToUser(io, receiverId, SOCKET_EVENTS.CALL_OFFER, {
        offer,
        caller,
      });
    } else {
      pendingCalls.set(receiverId, { offer, caller });
    }
  });

  // ANSWER
  socket.on(SOCKET_EVENTS.CALL_ANSWER, ({ to, answer }) => {
    const callerId = to;

    activeCalls.set(userId, { a: userId, b: callerId });
    activeCalls.set(callerId, { a: userId, b: callerId });

    const callKey = `${to}:${userId}`;
    const timeout = callTimeouts.get(callKey);

    if (timeout) {
      clearTimeout(timeout);
      callTimeouts.delete(callKey);
    }

    ringingUsers.delete(to);
    ringingUsers.delete(userId);
    ringingUsers.delete(callerId);

    pendingCalls.delete(userId);

    emitToUser(io, callerId, SOCKET_EVENTS.CALL_ANSWER, {
      answer,
    });
  });

  // ICE
  socket.on(SOCKET_EVENTS.CALL_ICE_CANDIDATE, ({ to, candidate }) => {
    if (!to || !candidate) return;

    emitToUser(io, String(to), SOCKET_EVENTS.CALL_ICE_CANDIDATE, {
      candidate,
    });
  });

  // REJECT
  socket.on(SOCKET_EVENTS.CALL_REJECT, ({ to }) => {
    const callKey = `${to}:${userId}`;

    const timeout = callTimeouts.get(callKey);
    if (timeout) {
      clearTimeout(timeout);
      callTimeouts.delete(callKey);
    }

    ringingUsers.delete(to);

    emitToUser(io, String(to), SOCKET_EVENTS.CALL_REJECT);
  });

  // END
  socket.on(SOCKET_EVENTS.CALL_END, ({ to }) => {
    const call = activeCalls.get(userId);
    if (!call) return;

    const other = call.a === userId ? call.b : call.a;

    activeCalls.delete(call.a);
    activeCalls.delete(call.b);

    emitToUser(io, other, SOCKET_EVENTS.CALL_END);
  });

  // CANCEL
  socket.on(SOCKET_EVENTS.CALL_CANCEL, ({ to }) => {
    const callKey = `${userId}:${to}`;

    const timeout = callTimeouts.get(callKey);
    if (timeout) {
      clearTimeout(timeout);
      callTimeouts.delete(callKey);
    }

    if (ringingUsers.get(userId) === to) {
      ringingUsers.delete(userId);
      pendingCalls.delete(to);

      emitToUser(io, to, SOCKET_EVENTS.CALL_CANCEL, {
        from: userId,
      });
    }
  });
};
