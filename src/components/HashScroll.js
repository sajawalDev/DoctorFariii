"use client";

import { usePathname } from "next/navigation";
import { useEffect } from "react";

// Reliable anchor scrolling for footer/deep links like /services#beauty.
// Next's App Router hash scroll is unreliable alongside our reveal animations
// and smooth scrolling, so we handle it explicitly for three cases:
//   1. Landing on a URL that already has a hash (direct link / new tab).
//   2. Navigating to a hashed link from another page.
//   3. Clicking a hashed link while already on the target page.
export default function HashScroll() {
  const pathname = usePathname();

  useEffect(() => {
    const scrollToHash = () => {
      const hash = window.location.hash;
      if (!hash || hash.length < 2) return;
      const id = decodeURIComponent(hash.slice(1));
      let tries = 0;
      const attempt = () => {
        const el = document.getElementById(id);
        if (el) el.scrollIntoView({ behavior: "smooth", block: "start" });
        else if (tries++ < 15) setTimeout(attempt, 60);
      };
      attempt();
    };

    // Cases 1 & 2 — honour the hash once the new route has painted.
    const t = setTimeout(scrollToHash, 120);
    window.addEventListener("hashchange", scrollToHash);

    // Case 3 — same-page hash link (pathname doesn't change, so intercept it).
    const onClick = (e) => {
      if (e.defaultPrevented || e.button !== 0 || e.metaKey || e.ctrlKey) return;
      const a = e.target.closest && e.target.closest('a[href*="#"]');
      if (!a) return;
      const url = new URL(a.href, window.location.href);
      if (url.pathname === window.location.pathname && url.hash) {
        const el = document.getElementById(decodeURIComponent(url.hash.slice(1)));
        if (el) {
          e.preventDefault();
          history.pushState(null, "", url.hash);
          el.scrollIntoView({ behavior: "smooth", block: "start" });
        }
      }
    };
    document.addEventListener("click", onClick);

    return () => {
      clearTimeout(t);
      window.removeEventListener("hashchange", scrollToHash);
      document.removeEventListener("click", onClick);
    };
  }, [pathname]);

  return null;
}
