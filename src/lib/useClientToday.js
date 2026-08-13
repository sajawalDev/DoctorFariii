import { useSyncExternalStore } from "react";

// Returns the visitor's local start-of-day Date on the client, and null during
// SSR / first paint — so anything date-dependent hydrates without mismatch and
// without calling setState inside an effect.
let cached = null;
const getSnapshot = () => {
  if (!cached) {
    const d = new Date();
    cached = new Date(d.getFullYear(), d.getMonth(), d.getDate());
  }
  return cached;
};
const getServerSnapshot = () => null;
const subscribe = () => () => {};

export function useClientToday() {
  return useSyncExternalStore(subscribe, getSnapshot, getServerSnapshot);
}
