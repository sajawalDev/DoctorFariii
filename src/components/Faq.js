"use client";

import { useEffect, useRef, useState } from "react";

// Single-open accordion. Heights are measured from the DOM so the
// max-height transition stays smooth regardless of answer length.
export default function Faq({ items }) {
  const [open, setOpen] = useState(-1);
  const bodies = useRef([]);

  useEffect(() => {
    bodies.current.forEach((el, i) => {
      if (el) el.style.maxHeight = i === open ? `${el.scrollHeight}px` : "0px";
    });
  }, [open]);

  return (
    <div className="acc rv">
      {items.map((it, i) => (
        <div className={`acc-i${i === open ? " open" : ""}`} key={it.q}>
          <button
            type="button"
            className="acc-q"
            aria-expanded={i === open}
            onClick={() => setOpen((o) => (o === i ? -1 : i))}
          >
            {it.q}
            <span className="acc-ic" aria-hidden="true" />
          </button>
          <div className="acc-a" ref={(el) => (bodies.current[i] = el)}>
            <p>{it.a}</p>
          </div>
        </div>
      ))}
    </div>
  );
}
