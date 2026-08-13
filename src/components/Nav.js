"use client";

import Link from "next/link";
import Image from "next/image";
import { usePathname } from "next/navigation";
import { useEffect, useState } from "react";
import Icon from "./Icon";
import { clinic, navLinks } from "@/lib/site";

export default function Nav() {
  const pathname = usePathname();
  const [open, setOpen] = useState(false);
  const closeMenu = () => setOpen(false);

  // Sticky nav + scroll-progress bar + gentle hero parallax.
  useEffect(() => {
    const nav = document.getElementById("nav");
    const prog = document.getElementById("prog");
    const reduce = window.matchMedia("(prefers-reduced-motion: reduce)").matches;

    const onScroll = () => {
      const y = window.scrollY || 0;
      nav?.classList.toggle("stuck", y > 24);
      const h = document.documentElement.scrollHeight - window.innerHeight;
      if (prog) prog.style.width = (h > 0 ? (y / h) * 100 : 0) + "%";
      const pc = document.getElementById("pcard");
      if (pc && !reduce && y < 900) pc.style.transform = `translateY(${y * 0.045}px)`;
    };

    window.addEventListener("scroll", onScroll, { passive: true });
    onScroll();
    return () => window.removeEventListener("scroll", onScroll);
  }, [pathname]);

  const isActive = (href) => (href === "/" ? pathname === "/" : pathname.startsWith(href));

  return (
    <>
      <div id="prog" />

      <header id="nav">
        <div className="wrap nav-in">
          <Link href="/" className="brand" aria-label={`${clinic.name} — home`}>
            <Image
              src="/logo.png"
              alt={`${clinic.name} — ${clinic.role}`}
              width={806}
              height={192}
              className="brand-logo"
              priority
            />
          </Link>

          <nav className="nav-links" aria-label="Primary">
            {navLinks.map((l) => (
              <Link key={l.href} href={l.href} className={isActive(l.href) ? "on" : undefined}>
                {l.label}
              </Link>
            ))}
          </nav>

          <div className="nav-cta">
            <Link href="/book" className="btn btn-p">
              Book consultation
              <Icon name="arrow" size={15} className="ar" />
            </Link>
            <button
              className={`burger${open ? " x" : ""}`}
              aria-label="Menu"
              aria-expanded={open}
              onClick={() => setOpen((v) => !v)}
            >
              <span />
              <span />
              <span />
            </button>
          </div>
        </div>
      </header>

      <div id="scrim" className={open ? "on" : undefined} onClick={closeMenu} />

      <nav id="mob" className={open ? "open" : undefined} aria-label="Mobile">
        {navLinks.map((l) => (
          <Link key={l.href} href={l.href} onClick={closeMenu}>
            {l.label}
          </Link>
        ))}
        <Link href="/book" onClick={closeMenu}>
          Book consultation
        </Link>
      </nav>
    </>
  );
}
