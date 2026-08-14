import { clinic } from "@/lib/site";

export default function manifest() {
  return {
    id: "/",
    name: `${clinic.name} — ${clinic.role}`,
    short_name: clinic.name,
    description:
      "Online homeopathic consultations for skin, digestion, hormonal and long-standing complaints across Pakistan.",
    start_url: "/",
    scope: "/",
    display: "standalone",
    lang: "en",
    dir: "ltr",
    categories: ["health", "medical", "lifestyle"],
    background_color: "#FFFFFF",
    theme_color: "#07828C",
    icons: [
      { src: "/leaf.png", sizes: "192x192", type: "image/png", purpose: "any" },
      { src: "/leaf.png", sizes: "192x192", type: "image/png", purpose: "maskable" },
    ],
  };
}
