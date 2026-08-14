import { renderOgImage, ogAlt, ogSize, ogContentType } from "@/lib/ogImage";

export const alt = ogAlt;
export const size = ogSize;
export const contentType = ogContentType;

export default function TwitterImage() {
  return renderOgImage();
}
