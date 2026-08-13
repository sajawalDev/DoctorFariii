"use client";

import { usePathname } from "next/navigation";
import { useEffect } from "react";

// Reveal-on-scroll + count-up animation. Class-based (same markup as the
// original design) so pages stay declarative — just add `rv` / `data-count`.
export default function ScrollReveal() {
  const pathname = usePathname();

  useEffect(() => {
    const reduce = window.matchMedia("(prefers-reduced-motion: reduce)").matches;

    // Give hero word-lines a default stagger if none was set inline.
    document.querySelectorAll(".wline").forEach((el, i) => {
      if (!el.style.getPropertyValue("--dl")) {
        el.style.setProperty("--dl", (i % 3) * 0.13 + 0.12 + "s");
      }
    });

    const revealSel = ".rv,.rv-l,.rv-r,.rv-s,.wline,.rule";

    if (reduce || !("IntersectionObserver" in window)) {
      document.querySelectorAll(revealSel).forEach((el) => el.classList.add("in"));
      document.querySelectorAll("[data-count]").forEach((el) => {
        el.textContent = el.getAttribute("data-count") + (el.getAttribute("data-suffix") || "");
      });
      return;
    }

    const io = new IntersectionObserver(
      (entries) => {
        entries.forEach((en) => {
          if (en.isIntersecting) {
            en.target.classList.add("in");
            io.unobserve(en.target);
          }
        });
      },
      { threshold: 0.12, rootMargin: "0px 0px -60px 0px" }
    );
    document.querySelectorAll(revealSel).forEach((el) => {
      if (!el.classList.contains("in")) io.observe(el);
    });

    // Count-up numbers.
    const counters = [];
    document.querySelectorAll("[data-count]").forEach((el) => {
      const obs = new IntersectionObserver(
        (e) => {
          if (!e[0].isIntersecting) return;
          obs.disconnect();
          const target = parseInt(el.getAttribute("data-count"), 10);
          const suf = el.getAttribute("data-suffix") || "";
          let t0 = null;
          const dur = 1400;
          const tick = (ts) => {
            if (!t0) t0 = ts;
            const p = Math.min((ts - t0) / dur, 1);
            const e2 = 1 - Math.pow(1 - p, 3);
            el.textContent = Math.round(target * e2) + suf;
            if (p < 1) requestAnimationFrame(tick);
          };
          requestAnimationFrame(tick);
        },
        { threshold: 0.4 }
      );
      obs.observe(el);
      counters.push(obs);
    });

    return () => {
      io.disconnect();
      counters.forEach((o) => o.disconnect());
    };
  }, [pathname]);

  return null;
}
