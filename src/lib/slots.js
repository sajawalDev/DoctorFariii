// Single source of truth for the consultation booking window.
//
// The clinic runs Monday–Saturday, 11:00 am – 6:00 pm PKT (see `hours` in
// site.js). Appointments are offered on a one-hour grid across that window, so
// the exact same list is used to (a) render the slot buttons on the client and
// (b) re-validate a submitted time on the server. Keeping it in one module means
// the two can never drift apart.

export const TIMEZONE_LABEL = "Pakistan Standard Time (PKT, GMT+5)";
// PKT has no daylight saving, so a fixed +5 offset is always correct.
export const TZ_OFFSET_MINUTES = 5 * 60;

const OPEN_HOUR = 11; // 11:00 am — first slot
const LAST_HOUR = 18; // 6:00 pm  — last slot start (inclusive)
const STEP_HOURS = 1; // one-hour gap between slots

// Clinic is closed on Sundays (getDay() === 0).
export const CLOSED_DOW = 0;

// Turn a 24h hour into the site's label style, e.g. 11 -> "11:00 am",
// 13 -> "1:00 pm", 18 -> "6:00 pm".
export function slotLabel(hour24) {
  const period = hour24 >= 12 ? "pm" : "am";
  let h = hour24 % 12;
  if (h === 0) h = 12;
  return `${h}:00 ${period}`;
}

// The ordered list of every bookable time in a day, e.g.
// ["11:00 am", "12:00 pm", "1:00 pm", ... "6:00 pm"].
export const ALL_SLOTS = (() => {
  const out = [];
  for (let h = OPEN_HOUR; h <= LAST_HOUR; h += STEP_HOURS) out.push(slotLabel(h));
  return out;
})();

// Parse a slot label back into a 24-hour value. Returns null if it isn't one of
// our known labels — used by the server to reject anything hand-crafted.
export function slotToHour24(label) {
  const m = /^(\d{1,2}):00 (am|pm)$/.exec(String(label || "").trim().toLowerCase());
  if (!m) return null;
  let h = Number(m[1]);
  if (h < 1 || h > 12) return null;
  if (m[2] === "pm" && h !== 12) h += 12;
  if (m[2] === "am" && h === 12) h = 0;
  return h;
}

// True only for labels the clinic actually offers.
export function isValidSlot(label) {
  return ALL_SLOTS.includes(label);
}

// A stable, timezone-proof key for a calendar day: "YYYY-MM-DD" built from the
// visitor's local Y/M/D (never from toISOString(), which would shift the day
// across the UTC boundary). This is the key everything else is bucketed under.
export function dateKey(d) {
  const y = d.getFullYear();
  const m = String(d.getMonth() + 1).padStart(2, "0");
  const day = String(d.getDate()).padStart(2, "0");
  return `${y}-${m}-${day}`;
}

// Parse a "YYYY-MM-DD" key back into its numeric parts. Returns null on garbage.
export function parseDateKey(key) {
  const m = /^(\d{4})-(\d{2})-(\d{2})$/.exec(String(key || ""));
  if (!m) return null;
  const [, y, mo, d] = m;
  return { year: +y, month: +mo, day: +d };
}
