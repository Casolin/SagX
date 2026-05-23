import { useEffect, useRef } from "react";
import { useCallStore } from "../utils/call.store";
import {
  Phone,
  Mic,
  MicOff,
  X,
  Minimize2,
  PhoneOff,
  PhoneCall,
  Maximize2,
} from "lucide-react";
import {
  stopRingtone,
  stopCallingTone,
  startCallingTone,
  startRingtone,
} from "../utils/callSounds";

export const CallPage = () => {
  const incomingCall = useCallStore((s) => s.incomingCall);
  const callAccepted = useCallStore((s) => s.callAccepted);
  const answerCall = useCallStore((s) => s.answerCall);
  const rejectCall = useCallStore((s) => s.rejectCall);
  const endCall = useCallStore((s) => s.endCall);
  const remoteStream = useCallStore((s) => s.remoteStream);

  const isMuted = useCallStore((s) => s.isMuted);
  const toggleMute = useCallStore((s) => s.toggleMute);

  const isMinimized = useCallStore((s) => s.isMinimized);
  const minimizeCall = useCallStore((s) => s.minimizeCall);
  const restoreCall = useCallStore((s) => s.restoreCall);

  const audioRef = useRef<HTMLAudioElement | null>(null);

  const isIncoming = !!incomingCall;
  const isInCall = callAccepted;

  useEffect(() => {
    if (audioRef.current && remoteStream) {
      audioRef.current.srcObject = remoteStream as MediaStream;
      audioRef.current.play().catch(() => {});
    }
  }, [remoteStream]);

  useEffect(() => {
    if (isIncoming && !isInCall) startRingtone();
    else stopRingtone();

    return () => stopRingtone();
  }, [isIncoming, isInCall]);

  useEffect(() => {
    if (!isIncoming && !isInCall) startCallingTone();
    else stopCallingTone();

    return () => stopCallingTone();
  }, [isIncoming, isInCall]);

  if (isMinimized && isInCall) {
    return (
      <div className="fixed bottom-5 right-5 z-50">
        <div className="bg-zinc-900 text-white px-4 py-3 rounded-xl flex items-center gap-3 shadow-lg border border-zinc-800">
          <PhoneCall size={16} className="text-zinc-300" />

          <span className="text-sm text-zinc-300">Call in progress</span>

          <button
            onClick={restoreCall}
            className="p-2 rounded-lg hover:bg-zinc-800 cursor-pointer"
          >
            <Maximize2 size={16} />
          </button>

          <button
            onClick={endCall}
            className="p-2 rounded-lg hover:bg-zinc-800 cursor-pointer text-red-400"
          >
            <PhoneOff size={16} />
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="fixed inset-0 bg-black text-white flex flex-col items-center justify-center z-50">
      <audio ref={audioRef} autoPlay />

      {/* INCOMING */}
      {isIncoming && !isInCall && (
        <div className="flex flex-col items-center gap-6">
          <img
            src={incomingCall.caller.avatar || "/default-avatar.png"}
            className="w-24 h-24 rounded-full"
          />

          <div className="text-center">
            <p className="text-lg font-medium">
              {incomingCall.caller.firstName} {incomingCall.caller.lastName}
            </p>
            <p className="text-sm text-zinc-400 mt-1">Incoming call</p>
          </div>

          <div className="flex gap-10 mt-4">
            <button
              onClick={rejectCall}
              className="p-4 rounded-full bg-zinc-800 hover:bg-zinc-700 transition cursor-pointer"
            >
              <X size={22} />
            </button>

            <button
              onClick={answerCall}
              className="p-4 rounded-full bg-zinc-800 hover:bg-zinc-700 transition cursor-pointer"
            >
              <Phone size={22} />
            </button>
          </div>
        </div>
      )}

      {/* CALLING */}
      {!isIncoming && !isInCall && (
        <div className="flex flex-col items-center gap-6">
          <div className="w-20 h-20 rounded-full bg-zinc-800 flex items-center justify-center">
            <PhoneCall size={22} className="text-zinc-300" />
          </div>

          <p className="text-sm text-zinc-400">Calling...</p>

          <button
            onClick={endCall}
            className="p-3 rounded-full bg-zinc-800 hover:bg-zinc-700 transition cursor-pointer"
          >
            <PhoneOff size={18} />
          </button>
        </div>
      )}

      {/* ACTIVE CALL */}
      {isInCall && (
        <div className="flex flex-col items-center gap-8">
          <div className="text-sm text-zinc-400">In call</div>

          <div className="w-20 h-20 rounded-full bg-zinc-800 flex items-center justify-center">
            <PhoneCall size={22} className="text-zinc-300" />
          </div>

          <div className="flex items-center gap-3">
            <button
              onClick={toggleMute}
              className="p-3 rounded-lg bg-zinc-800 hover:bg-zinc-700 transition cursor-pointer"
            >
              {isMuted ? <MicOff size={18} /> : <Mic size={18} />}
            </button>

            <button
              onClick={minimizeCall}
              className="p-3 rounded-lg bg-zinc-800 hover:bg-zinc-700 transition cursor-pointer"
            >
              <Minimize2 size={18} />
            </button>

            <button
              onClick={endCall}
              className="p-3 rounded-lg bg-zinc-800 hover:bg-red-500/20 transition cursor-pointer text-red-400"
            >
              <PhoneOff size={18} />
            </button>
          </div>
        </div>
      )}
    </div>
  );
};
