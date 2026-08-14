// Consultation types and meeting formats — shared by the booking UI (to render
// the choices) and the /api/book route (to re-validate them and to know each
// service's real duration in minutes for the calendar event).

export const SERVICES = [
  {
    svc: "First consultation",
    fee: "PKR 2,000",
    dur: "40 min",
    minutes: 40,
    icon: "case",
    desc: "Full case taking, written plan and remedy. For new patients.",
  },
  {
    svc: "Follow-up review",
    fee: "PKR 1,000",
    dur: "20 min",
    minutes: 20,
    icon: "refresh",
    desc: "For existing patients continuing an ongoing case.",
  },
  {
    svc: "Case + diet plan",
    fee: "PKR 3,500",
    dur: "60 min",
    minutes: 60,
    icon: "cutlery",
    desc: "Consultation with a four-week written nutrition plan alongside.",
  },
];

export const MODES = [
  { mode: "Video call", icon: "video", desc: "WhatsApp, Zoom or Google Meet — your choice.", online: true },
  { mode: "Audio call", icon: "phone", desc: "Voice only, if your connection is slow.", online: true },
];

export const findService = (name) => SERVICES.find((s) => s.svc === name) || null;
export const findMode = (name) => MODES.find((m) => m.mode === name) || null;
