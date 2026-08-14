// PII-free persistence for "which slots are already taken", with no database.
//
// SECURITY / PRIVACY MODEL — read this before changing the shape:
//   * The ONLY thing written to the browser is an opaque slot marker,
//     "YYYY-MM-DD|11:00 am". No name, phone, email, age, or medical text ever
//     touches localStorage. All of that lives in React state for the length of
//     the session and is transmitted once, over HTTPS, to the server that mails
//     the doctor. The doctor's inbox + calendar is the real source of truth.
//   * The store is namespaced and versioned ("df.bookedSlots.v1") so a future
//     format change can't be confused with old data.
//   * Every value is re-validated on read (shape + known slot label) and any
//     slot whose date is already in the past is pruned, so a tampered or stale
//     store can only ever hide a valid future slot from THIS browser — it can
//     never inject personal data or reach another visitor.
// We deliberately do NOT pretend to "encrypt" client-side: a key shipped in the
// bundle is not a secret, so encryption here would be theatre. Minimising what
// is stored is the honest, effective control.

import { isValidSlot, parseDateKey } from "@/lib/slots";

const STORAGE_KEY = "df.bookedSlots.v1";
const SEP = "|";
const MAX_MARKERS = 2000; // hard cap so the store can't grow unbounded

export function markerFor(dateKeyStr, time) {
  return `${dateKeyStr}${SEP}${time}`;
}

// Is this marker still worth keeping? It must be well-formed, use a real slot
// label, and fall on today or a future day (local time).
function markerIsLive(marker, todayKey) {
  if (typeof marker !== "string") return false;
  const idx = marker.indexOf(SEP);
  if (idx < 1) return false;
  const dKey = marker.slice(0, idx);
  const time = marker.slice(idx + 1);
  if (!parseDateKey(dKey)) return false;
  if (!isValidSlot(time)) return false;
  return dKey >= todayKey; // string compare is safe for zero-padded YYYY-MM-DD
}

// Read + sanitise the persisted markers, returning a Set. Safe to call in any
// environment: returns an empty Set during SSR or if storage is unavailable.
export function loadMarkers(todayKey) {
  if (typeof window === "undefined") return new Set();
  let raw;
  try {
    raw = window.localStorage.getItem(STORAGE_KEY);
  } catch {
    return new Set(); // storage blocked (private mode, disabled cookies…)
  }
  if (!raw) return new Set();

  let parsed;
  try {
    parsed = JSON.parse(raw);
  } catch {
    return new Set();
  }
  if (!Array.isArray(parsed)) return new Set();

  const clean = new Set();
  for (const m of parsed) {
    if (markerIsLive(m, todayKey)) clean.add(m);
    if (clean.size >= MAX_MARKERS) break;
  }
  return clean;
}

// Persist a Set of markers, best-effort. Never throws.
export function saveMarkers(set) {
  if (typeof window === "undefined") return;
  try {
    window.localStorage.setItem(STORAGE_KEY, JSON.stringify([...set].slice(0, MAX_MARKERS)));
  } catch {
    /* out of quota or blocked — the in-memory context still holds the truth */
  }
}
