import { clinic } from "@/lib/site";

export default function manifest() {
  return {
    name: `${clinic.name} — ${clinic.role}`,
    short_name: clinic.name,
    description:
      "Online homeopathic consultations for skin, digestion, hormonal and long-standing complaints across Pakistan.",
    start_url: "/",
    display: "standalone",
    background_color: "#FFFFFF",
    theme_color: "#0B1F35",
    icons: [{ src: "/icon.svg", sizes: "any", type: "image/svg+xml" }],
  };
}
