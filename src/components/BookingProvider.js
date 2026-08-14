"use client";

// The in-memory "cache" of taken slots, shared through React context.
//
// Flow of truth:
//   localStorage (PII-free markers)  ->  this context (fast lookups)  ->  UI
//   a completed booking             ->  commit()  ->  context + localStorage
//
// The context starts EMPTY on both the server render and the first client render
// (so hydration never mismatches), then hydrates from localStorage in an effect
// after mount. Everything the UI needs — "is this slot taken?", "how many slots
// are open on this day?", "mark this slot booked" — is derived here.

import { createContext, useCallback, useContext, useEffect, useMemo, useState } from "react";
import { ALL_SLOTS, dateKey } from "@/lib/slots";
import { loadMarkers, markerFor, saveMarkers } from "@/lib/bookingStore";

const BookingsContext = createContext(null);

export default function BookingProvider({ children }) {
  // Set of "YYYY-MM-DD|time" markers. Empty until hydrated post-mount.
  const [taken, setTaken] = useState(() => new Set());

  useEffect(() => {
    // Hydrate + prune once, using today's local key so past slots drop off.
    const todayKey = dateKey(new Date());
    setTaken(loadMarkers(todayKey));
  }, []);

  // Is a specific slot on a specific day already taken?
  const isTaken = useCallback((dKey, time) => taken.has(markerFor(dKey, time)), [taken]);

  // How many of the day's slots are still open (used to grey out full days).
  const openCount = useCallback(
    (dKey) => ALL_SLOTS.reduce((n, t) => (taken.has(markerFor(dKey, t)) ? n : n + 1), 0),
    [taken]
  );

  // Record a freshly confirmed booking: update the cache and persist the marker.
  const commit = useCallback((dKey, time) => {
    setTaken((prev) => {
      const next = new Set(prev);
      next.add(markerFor(dKey, time));
      saveMarkers(next);
      return next;
    });
  }, []);

  const value = useMemo(() => ({ isTaken, openCount, commit }), [isTaken, openCount, commit]);

  return <BookingsContext.Provider value={value}>{children}</BookingsContext.Provider>;
}

export function useBookings() {
  const ctx = useContext(BookingsContext);
  if (!ctx) throw new Error("useBookings must be used inside <BookingProvider>");
  return ctx;
}
