"use client";

import { useEffect, useRef } from "react";

// Floating "sugar globule" motes behind the hero. Random + decorative,
// so it's generated on the client after mount (no hydration mismatch).
export default function HeroGlobules() {
  const host = useRef(null);

  useEffect(() => {
    const el = host.current;
    if (!el || window.matchMedia("(prefers-reduced-motion: reduce)").matches) return;

    for (let i = 0; i < 14; i++) {
      const d = document.createElement("div");
      d.className = "glob";
      const s = 5 + Math.random() * 16;
      d.style.width = d.style.height = s + "px";
      d.style.left = Math.random() * 96 + "%";
      d.style.top = Math.random() * 92 + "%";
      d.style.opacity = (0.22 + Math.random() * 0.5).toFixed(2);
      d.style.setProperty("--mx", (Math.random() * 40 - 20).toFixed(0) + "px");
      d.style.setProperty("--my", (-14 - Math.random() * 30).toFixed(0) + "px");
      d.style.animationDuration = (10 + Math.random() * 14).toFixed(1) + "s";
      d.style.animationDelay = (-Math.random() * 12).toFixed(1) + "s";
      el.appendChild(d);
    }
    return () => {
      el.innerHTML = "";
    };
  }, []);

  return <div className="globs" ref={host} aria-hidden="true" />;
}
