"use client";

import { hours } from "@/lib/site";
import { useClientToday } from "@/lib/useClientToday";

// Highlights the current weekday. The day comes from a client-only store, so
// server and first client render agree (the visitor's day, not the build day).
export default function ClinicHours() {
  const today = useClientToday();
  const dow = today ? today.getDay() : null;

  return (
    <div className="hours">
      {hours.map((h) => (
        <div className={`hrow${h.closed ? " off" : ""}${dow === h.dow ? " today" : ""}`} key={h.day}>
          <b>{h.day}</b>
          <span>{h.time}</span>
        </div>
      ))}
    </div>
  );
}
