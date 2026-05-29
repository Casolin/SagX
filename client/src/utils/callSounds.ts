// utils/callSounds.ts
let ringtone: HTMLAudioElement | null = null;
let callingTone: HTMLAudioElement | null = null;

export const startRingtone = () => {
  stopRingtone();

  ringtone = new Audio("/ringtone.mp3");
  ringtone.loop = true;
  ringtone.volume = 0.6;

  ringtone.play().catch(() => {});
};

export const stopRingtone = () => {
  if (!ringtone) return;
  ringtone.pause();
  ringtone.currentTime = 0;
  ringtone = null;
};

export const startCallingTone = () => {
  stopCallingTone();

  callingTone = new Audio("/calling.wav");
  callingTone.loop = true;
  callingTone.volume = 0.6;

  callingTone.play().catch(() => {});
};

export const stopCallingTone = () => {
  if (!callingTone) return;
  callingTone.pause();
  callingTone.currentTime = 0;
  callingTone = null;
};
