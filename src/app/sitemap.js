import { SITE_URL } from "@/lib/site";

export default function sitemap() {
  const now = new Date();
  const routes = [
    { path: "/", priority: 1.0, changeFrequency: "monthly", image: "/homepagehero.jpg" },
    { path: "/about", priority: 0.8, changeFrequency: "yearly", image: "/aboutpageherstory.jpg" },
    { path: "/services", priority: 0.9, changeFrequency: "monthly" },
    { path: "/contact", priority: 0.7, changeFrequency: "yearly" },
    { path: "/book", priority: 0.9, changeFrequency: "monthly" },
  ];
  return routes.map((r) => ({
    url: `${SITE_URL}${r.path === "/" ? "" : r.path}`,
    lastModified: now,
    changeFrequency: r.changeFrequency,
    priority: r.priority,
    ...(r.image ? { images: [`${SITE_URL}${r.image}`] } : {}),
  }));
}
