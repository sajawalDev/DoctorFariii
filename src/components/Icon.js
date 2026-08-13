// Single source for every line/solid icon used across the site.
// Colour is driven by CSS (stroke: currentColor / .ic svg { stroke: ... }),
// so pages never hardcode hex values.

const PATHS = {
  arrow: "M5 12h14M13 6l6 6-6 6",
  arrowLeft: "M19 12H5M11 6l-6 6 6 6",
  check: "m5 13 4 4L19 7",
  chevronLeft: "m15 18-6-6 6-6",
  chevronRight: "m9 6 6 6-6 6",
};

// Multi-path icons kept as small render fragments.
const SHAPES = {
  shield: (
    <>
      <path d="M12 2 4 6v6c0 5 3.4 9.3 8 10 4.6-.7 8-5 8-10V6l-8-4z" />
      <path d="m9 12 2 2 4-4" />
    </>
  ),
  flask: (
    <>
      <path d="M15.5 2h-7v5.2L4 17a3 3 0 0 0 2.7 4.3h10.6A3 3 0 0 0 20 17l-4.5-9.8V2z" />
      <path d="M8.5 7.2h7" />
    </>
  ),
  face: (
    <>
      <circle cx="12" cy="12" r="9" />
      <path d="M8.5 9.5h.01M15.5 9.5h.01M9 15c.9.8 2 1.2 3 1.2s2.1-.4 3-1.2" />
    </>
  ),
  stomach: (
    <>
      <path d="M12 3v4M8 7h8l1.5 7a5.5 5.5 0 0 1-11 0L8 7z" />
      <path d="M9.5 14h5" />
    </>
  ),
  female: (
    <>
      <circle cx="12" cy="9" r="5.5" />
      <path d="M12 14.5V22M9 19h6" />
    </>
  ),
  immunity: (
    <>
      <path d="M6 12a6 6 0 0 1 12 0v3a3 3 0 0 1-3 3H9a3 3 0 0 1-3-3v-3z" />
      <path d="M9 21h6M12 3v3" />
    </>
  ),
  heart: <path d="M20.8 5.6a5 5 0 0 0-7.1 0L12 7.3l-1.7-1.7a5 5 0 1 0-7.1 7.1L12 21.4l8.8-8.7a5 5 0 0 0 0-7.1z" />,
  pulse: <path d="M3 12h4l2.5 6 4-13L16 12h5" />,
  video: (
    <>
      <rect x="2" y="5" width="14" height="14" rx="2.5" />
      <path d="m22 8-6 4 6 4V8z" />
    </>
  ),
  phone: (
    <path d="M22 16.9v3a2 2 0 0 1-2.2 2 19.8 19.8 0 0 1-8.6-3.1 19.5 19.5 0 0 1-6-6A19.8 19.8 0 0 1 2 4.2 2 2 0 0 1 4 2h3a2 2 0 0 1 2 1.7c.1 1 .4 1.9.7 2.8a2 2 0 0 1-.4 2.1L8 9.9a16 16 0 0 0 6 6l1.3-1.3a2 2 0 0 1 2.1-.4c.9.3 1.8.6 2.8.7a2 2 0 0 1 1.8 2z" />
  ),
  mail: (
    <>
      <rect x="2" y="4" width="20" height="16" rx="2.5" />
      <path d="m2.5 6.5 9.5 6.5 9.5-6.5" />
    </>
  ),
  pin: (
    <>
      <path d="M20 10.5c0 5.5-8 11.5-8 11.5s-8-6-8-11.5a8 8 0 0 1 16 0z" />
      <circle cx="12" cy="10.2" r="2.8" />
    </>
  ),
  calendar: (
    <>
      <rect x="3" y="5" width="18" height="16" rx="2.5" />
      <path d="M3 10h18M8 3v4M16 3v4" />
    </>
  ),
  clock: (
    <>
      <circle cx="12" cy="12" r="9" />
      <path d="M12 7v5l3 2" />
    </>
  ),
  money: (
    <path d="M12 2v20M17 6.5c0-2-2.2-3.5-5-3.5s-5 1.3-5 3.3S9 10 12 10.5s5 1.7 5 3.7-2.2 3.3-5 3.3-5-1.5-5-3.5" />
  ),
  refresh: (
    <>
      <path d="M3 12a9 9 0 1 0 3-6.7" />
      <path d="M3 4v5h5" />
    </>
  ),
  cutlery: (
    <>
      <path d="M6 3v8a3 3 0 0 0 6 0V3M9 11v10" />
      <path d="M17.5 3c-1.4 1.6-2 3.7-2 6s.6 3 2 3 2-.7 2-3-.6-4.4-2-6zM17.5 12v9" />
    </>
  ),
  case: (
    <>
      <path d="M12 3 3 8v11h18V8l-9-5z" />
      <path d="M12 10v6M9 13h6" />
    </>
  ),
  monitor: (
    <>
      <rect x="2" y="4" width="20" height="14" rx="2" />
      <path d="M8 21h8M12 18v3" />
    </>
  ),
};

export default function Icon({ name, size = 24, strokeWidth = 2, className }) {
  if (name === "star") {
    return (
      <svg width={size} height={size} viewBox="0 0 24 24" fill="currentColor" className={className} aria-hidden="true">
        <path d="m12 2 3 6.5 7 .9-5 4.9 1.2 7L12 18l-6.2 3.3L7 14.3l-5-4.9 7-.9L12 2z" />
      </svg>
    );
  }
  return (
    <svg
      width={size}
      height={size}
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth={strokeWidth}
      strokeLinecap="round"
      strokeLinejoin="round"
      className={className}
      aria-hidden="true"
    >
      {name in PATHS ? <path d={PATHS[name]} /> : SHAPES[name]}
    </svg>
  );
}
