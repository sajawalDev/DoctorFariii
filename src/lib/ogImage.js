// Branded 1200×630 social-share card, generated at build/request time.
// Used for both Open Graph (opengraph-image) and Twitter (twitter-image).
// Drawn entirely with layout primitives so it has no external asset or font
// dependency (Satori/`next/og` renders it with a built-in font).

import { ImageResponse } from "next/og";
import { clinic } from "@/lib/site";

export const ogAlt = `${clinic.name} — ${clinic.role} in ${clinic.city}, online consultations across ${clinic.country}`;
export const ogSize = { width: 1200, height: 630 };
export const ogContentType = "image/png";

const TEAL = "#07828C";
const CREAM = "#F5EFE6";
const BRASS = "#C7A46A";

export function renderOgImage() {
  return new ImageResponse(
    (
      <div
        style={{
          width: "100%",
          height: "100%",
          display: "flex",
          flexDirection: "column",
          justifyContent: "space-between",
          padding: "72px 80px",
          background:
            "linear-gradient(135deg, #063B41 0%, #0A5158 52%, #07828C 100%)",
          color: CREAM,
          fontFamily: "sans-serif",
        }}
      >
        {/* Top row: monogram + domain */}
        <div
          style={{
            display: "flex",
            alignItems: "center",
            justifyContent: "space-between",
          }}
        >
          <div style={{ display: "flex", alignItems: "center" }}>
            <div
              style={{
                display: "flex",
                alignItems: "center",
                justifyContent: "center",
                width: 96,
                height: 96,
                borderRadius: 24,
                background: CREAM,
                color: TEAL,
                fontSize: 46,
                fontWeight: 700,
                letterSpacing: 1,
              }}
            >
              {clinic.monogram}
            </div>
            <div
              style={{
                display: "flex",
                flexDirection: "column",
                marginLeft: 26,
              }}
            >
              <div style={{ fontSize: 26, fontWeight: 700, color: CREAM }}>
                {clinic.name}
              </div>
              <div
                style={{ display: "flex", fontSize: 20, color: BRASS, marginTop: 4 }}
              >
                {`${clinic.role} · ${clinic.qualification}`}
              </div>
            </div>
          </div>
          <div
            style={{
              display: "flex",
              fontSize: 22,
              color: "rgba(245,239,230,0.7)",
            }}
          >
            doctorfariha.online
          </div>
        </div>

        {/* Headline */}
        <div style={{ display: "flex", flexDirection: "column" }}>
          <div
            style={{
              display: "flex",
              fontSize: 66,
              lineHeight: 1.1,
              fontWeight: 700,
              maxWidth: 940,
              color: "#FFFFFF",
            }}
          >
            Homeopathic care that treats the whole patient.
          </div>
          <div
            style={{
              display: "flex",
              fontSize: 30,
              lineHeight: 1.35,
              marginTop: 28,
              maxWidth: 900,
              color: "rgba(245,239,230,0.85)",
            }}
          >
            Online consultations for skin, digestion, hormonal & long-standing
            complaints — remedies couriered across Pakistan.
          </div>
        </div>

        {/* Bottom row: focus tags */}
        <div style={{ display: "flex", alignItems: "center" }}>
          {["Skin & Hair", "Diet & Nutrition", "Women's & Children's", "Online"].map(
            (t) => (
              <div
                key={t}
                style={{
                  display: "flex",
                  marginRight: 16,
                  padding: "12px 22px",
                  borderRadius: 999,
                  fontSize: 22,
                  color: CREAM,
                  background: "rgba(245,239,230,0.10)",
                  border: "1px solid rgba(245,239,230,0.25)",
                }}
              >
                {t}
              </div>
            )
          )}
        </div>
      </div>
    ),
    { ...ogSize }
  );
}
