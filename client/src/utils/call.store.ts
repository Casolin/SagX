import { create } from "zustand";
import Peer from "simple-peer";
import { Socket } from "socket.io-client";
import { SOCKET_EVENTS } from "../services/socket.events";

type CallUser = {
  _id: string;
  firstName: string;
  lastName: string;
  avatar?: string;
};

type IncomingCall = {
  offer: Peer.SignalData;
  caller: CallUser;
};

type CallState = {
  socket: Socket | null;

  incomingCall: IncomingCall | null;
  callAccepted: boolean;
  isCalling: boolean;

  isMinimized: boolean;

  peer: Peer.Instance | null;
  stream: MediaStream | null;
  remoteStream: MediaStream | null;

  activeCallUserId: string | null;

  isMuted: boolean;

  bindSocket: (socket: Socket) => void;
  startCall: (receiverId: string, currentUser: CallUser) => Promise<void>;
  answerCall: () => Promise<void>;
  rejectCall: () => void;
  endCall: () => void;
  toggleMute: () => void;

  minimizeCall: () => void;
  restoreCall: () => void;

  cleanup: () => void;
};

export const useCallStore = create<CallState>((set, get) => ({
  socket: null,

  incomingCall: null,
  callAccepted: false,
  isCalling: false,

  isMinimized: false,

  peer: null,
  stream: null,
  remoteStream: null,

  activeCallUserId: null,
  isMuted: false,

  bindSocket: (socket) => {
    set({ socket });

    socket.on(SOCKET_EVENTS.CALL_OFFER, (data) => {
      set({
        incomingCall: data,
        isCalling: false,
        callAccepted: false,
        isMinimized: false,
      });
    });

    socket.on(SOCKET_EVENTS.CALL_ANSWER, ({ answer }) => {
      const peer = get().peer;
      if (!peer) return;

      peer.signal(answer);

      set({
        callAccepted: true,
        isCalling: false,
        isMinimized: false,
      });
    });

    socket.on(SOCKET_EVENTS.CALL_REJECT, () => {
      get().cleanup();
    });

    socket.on(SOCKET_EVENTS.CALL_END, () => {
      get().cleanup();
    });
  },

  startCall: async (receiverId, currentUser) => {
    const socket = get().socket;
    if (!socket) return;

    const stream = await navigator.mediaDevices.getUserMedia({
      audio: true,
      video: false,
    });

    const peer = new Peer({
      initiator: true,
      trickle: false,
      stream,
    });

    peer.on("signal", (offer) => {
      socket.emit(SOCKET_EVENTS.CALL_OFFER, {
        to: receiverId,
        offer,
        caller: currentUser,
      });
    });

    peer.on("stream", (remoteStream) => {
      set({ remoteStream });
    });

    set({
      peer,
      stream,
      isCalling: true,
      activeCallUserId: receiverId,
      isMuted: false,
      isMinimized: false,
    });
  },

  answerCall: async () => {
    const { incomingCall, socket } = get();
    if (!incomingCall || !socket) return;

    const stream = await navigator.mediaDevices.getUserMedia({
      audio: true,
      video: false,
    });

    const peer = new Peer({
      initiator: false,
      trickle: false,
      stream,
    });

    peer.signal(incomingCall.offer);

    peer.on("signal", (answer) => {
      socket.emit(SOCKET_EVENTS.CALL_ANSWER, {
        to: incomingCall.caller._id,
        answer,
      });
    });

    peer.on("stream", (remoteStream) => {
      set({ remoteStream });
    });

    set({
      peer,
      stream,
      incomingCall: null,
      callAccepted: true,
      isCalling: false,
      activeCallUserId: incomingCall.caller._id,
      isMuted: false,
      isMinimized: false,
    });
  },

  toggleMute: () => {
    const { stream, isMuted } = get();
    if (!stream) return;

    const audioTrack = stream.getAudioTracks()[0];
    if (!audioTrack) return;

    audioTrack.enabled = isMuted;

    set({ isMuted: !isMuted });
  },

  minimizeCall: () => {
    set({ isMinimized: true });
  },

  restoreCall: () => {
    set({ isMinimized: false });
  },

  rejectCall: () => {
    const { socket, incomingCall } = get();
    if (!socket || !incomingCall) return;

    socket.emit(SOCKET_EVENTS.CALL_REJECT, {
      to: incomingCall.caller._id,
    });

    get().cleanup();
  },

  endCall: () => {
    const { socket, activeCallUserId } = get();

    if (socket && activeCallUserId) {
      socket.emit(SOCKET_EVENTS.CALL_END, {
        to: activeCallUserId,
      });
    }

    get().cleanup();
  },

  cleanup: () => {
    const { peer, stream } = get();

    peer?.destroy();
    stream?.getTracks().forEach((t) => t.stop());

    set({
      peer: null,
      stream: null,
      remoteStream: null,
      incomingCall: null,
      callAccepted: false,
      isCalling: false,
      activeCallUserId: null,
      isMuted: false,
      isMinimized: false,
    });
  },
}));
