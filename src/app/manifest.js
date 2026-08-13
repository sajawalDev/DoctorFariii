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
    theme_color: "#07828C",
    icons: [
      { src: "/leaf.png", sizes: "192x192", type: "image/png", purpose: "any" },
    ],
  };
}
