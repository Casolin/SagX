export const activeCalls = new Map<string, { a: string; b: string }>();
export const ringingUsers = new Map<string, string>();
export const userSockets = new Map<string, Set<string>>();
export const callTimeouts = new Map<string, NodeJS.Timeout>();

export const pendingCalls = new Map<string, { offer: any; caller: any }>();
