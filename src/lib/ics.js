// iCalendar (.ics) generation + "Add to calendar" link building.
//
// Both the doctor's copy and the patient's copy of a booking carry the same
// event so either can drop it straight into their calendar and get reminded as
// the appointment nears. PKT has no daylight saving, so we resolve the local
// PKT wall-clock time to a fixed UTC instant (subtract 5h) and emit UTC stamps
// ("...Z") — this needs no VTIMEZONE block and renders correctly everywhere.

import { TZ_OFFSET_MINUTES } from "@/lib/slots";

// Escape a value for a TEXT property per RFC 5545 (backslash, semicolon, comma,
// newline all have meaning inside the format).
function esc(value) {
  return String(value ?? "")
    .replace(/\\/g, "\\\\")
    .replace(/;/g, "\\;")
    .replace(/,/g, "\\,")
    .replace(/\r?\n/g, "\\n");
}

// Format a Date as a UTC iCalendar timestamp: YYYYMMDDTHHMMSSZ.
function stampUTC(date) {
  const p = (n) => String(n).padStart(2, "0");
  return (
    `${date.getUTCFullYear()}${p(date.getUTCMonth() + 1)}${p(date.getUTCDate())}` +
    `T${p(date.getUTCHours())}${p(date.getUTCMinutes())}${p(date.getUTCSeconds())}Z`
  );
}

// Fold lines longer than 75 octets, as required by RFC 5545, so strict parsers
// (and some corporate mail gateways) don't choke on a long DESCRIPTION.
function fold(line) {
  if (line.length <= 75) return line;
  const parts = [];
  let rest = line;
  parts.push(rest.slice(0, 75));
  rest = rest.slice(75);
  while (rest.length > 74) {
    parts.push(" " + rest.slice(0, 74));
    rest = rest.slice(74);
  }
  if (rest.length) parts.push(" " + rest);
  return parts.join("\r\n");
}

// Convert a PKT wall-clock (year/month/day/hour) into the equivalent UTC Date.
export function pktToUtc({ year, month, day, hour, minute = 0 }) {
  // Date.UTC treats args as UTC; subtracting the +5 offset gives the real UTC
  // instant for that PKT wall-clock time.
  return new Date(Date.UTC(year, month - 1, day, hour, minute) - TZ_OFFSET_MINUTES * 60 * 1000);
}

// Build a full VCALENDAR string for one appointment.
//   method: "REQUEST" makes Gmail/Outlook render an interactive invite card
//           ("Yes / Maybe / No" + auto-add); "PUBLISH" is a plain add.
export function buildIcs({
  uid,
  start, // Date (UTC instant)
  durationMinutes,
  summary,
  description,
  location,
  organizerName,
  organizerEmail,
  attendeeName,
  attendeeEmail,
  method = "REQUEST",
}) {
  const end = new Date(start.getTime() + durationMinutes * 60 * 1000);
  const now = new Date();

  const lines = [
    "BEGIN:VCALENDAR",
    "VERSION:2.0",
    "PRODID:-//Dr. Fariha Ashraf//Booking//EN",
    "CALSCALE:GREGORIAN",
    `METHOD:${method}`,
    "BEGIN:VEVENT",
    `UID:${esc(uid)}`,
    `DTSTAMP:${stampUTC(now)}`,
    `DTSTART:${stampUTC(start)}`,
    `DTEND:${stampUTC(end)}`,
    `SUMMARY:${esc(summary)}`,
    `DESCRIPTION:${esc(description)}`,
    `LOCATION:${esc(location)}`,
    `ORGANIZER;CN=${esc(organizerName)}:mailto:${organizerEmail}`,
    `ATTENDEE;CN=${esc(attendeeName)};ROLE=REQ-PARTICIPANT;RSVP=TRUE:mailto:${attendeeEmail}`,
    "STATUS:CONFIRMED",
    "SEQUENCE:0",
    "TRANSP:OPAQUE",
    // Two reminders so the appointment never slips by: a day before and an hour
    // before. These are what make the calendar "remind you when the time nears".
    "BEGIN:VALARM",
    "ACTION:DISPLAY",
    "DESCRIPTION:Consultation reminder",
    "TRIGGER:-P1D",
    "END:VALARM",
    "BEGIN:VALARM",
    "ACTION:DISPLAY",
    "DESCRIPTION:Consultation in 1 hour",
    "TRIGGER:-PT1H",
    "END:VALARM",
    "END:VEVENT",
    "END:VCALENDAR",
  ];

  return lines.map(fold).join("\r\n");
}

// A one-click "Add to Google Calendar" URL — the attractive button in the email.
// Google wants UTC stamps in the form YYYYMMDDTHHMMSSZ/YYYYMMDDTHHMMSSZ.
export function googleCalendarUrl({ start, durationMinutes, summary, description, location }) {
  const end = new Date(start.getTime() + durationMinutes * 60 * 1000);
  const params = new URLSearchParams({
    action: "TEMPLATE",
    text: summary,
    dates: `${stampUTC(start)}/${stampUTC(end)}`,
    details: description,
    location: location,
  });
  return `https://calendar.google.com/calendar/render?${params.toString()}`;
}
