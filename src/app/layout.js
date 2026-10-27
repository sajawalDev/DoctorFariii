import { Fraunces, Plus_Jakarta_Sans } from "next/font/google";
import "./globals.css";
import Nav from "@/components/Nav";
import Footer from "@/components/Footer";
import ScrollReveal from "@/components/ScrollReveal";
import HashScroll from "@/components/HashScroll";
import JsonLd from "@/components/JsonLd";
import { SITE_URL, clinic } from "@/lib/site";
import { siteJsonLd } from "@/lib/seo";

const fraunces = Fraunces({
  subsets: ["latin"],
  style: ["normal", "italic"],
  variable: "--font-fraunces",
  display: "swap",
});
const jakarta = Plus_Jakarta_Sans({
  subsets: ["latin"],
  variable: "--font-jakarta",
  display: "swap",
});

export const metadata = {
  metadataBase: new URL(SITE_URL),
  title: {
    default: "Dr. Fariha Ashraf — Homeopathic Physician, Lahore",
    template: "%s · Dr. Fariha Ashraf",
  },
  description:
    "Dr. Fariha Ashraf, DHMS — homeopathic physician in Lahore. Online consultations for skin, digestion, hormonal health and long-standing complaints, with remedies couriered across Pakistan.",
  applicationName: clinic.name,
  authors: [{ name: clinic.name }],
  creator: clinic.name,
  keywords: [
    "homeopathic physician Lahore",
    "homeopathy Pakistan",
    "online homeopathy consultation",
    "Dr. Fariha Ashraf",
    "DHMS Lahore",
    "homeopathic dermatology",
    "homeopathic skin treatment",
    "homeopathy for acne and eczema",
    "homeopathic doctor near me",
    "online homeopathic doctor Pakistan",
    "diet and nutrition Lahore",
    "homeopathic treatment for PCOS",
    "best homeopathic doctor Lahore",
  ],
  alternates: { canonical: "/" },
  openGraph: {
    type: "website",
    siteName: clinic.name,
    locale: "en_PK",
    url: "/",
    title: "Dr. Fariha Ashraf — Homeopathic Physician, Lahore",
    description:
      "Online homeopathic consultations for skin, digestion, hormonal and long-standing complaints. Remedies couriered across Pakistan.",
  },
  twitter: {
    card: "summary_large_image",
    title: "Dr. Fariha Ashraf — Homeopathic Physician, Lahore",
    description:
      "Online homeopathic consultations for skin, digestion, hormonal and long-standing complaints across Pakistan.",
  },
  robots: {
    index: true,
    follow: true,
    googleBot: { index: true, follow: true, "max-image-preview": "large" },
  },
  verification: {
    google: "eW3tTKYAspJt-evniHSBAvKOBQ-Nwg5sbupVTRcZXlk",
  },
  category: "health",
};

export const viewport = {
  themeColor: "#07828C",
  colorScheme: "light",
};

export default function RootLayout({ children }) {
  return (
    <html lang="en">
      <body className={`${fraunces.variable} ${jakarta.variable}`}>
        <JsonLd data={siteJsonLd()} />
        <Nav />
        <main>{children}</main>
        <Footer />
        <ScrollReveal />
        <HashScroll />
      </body>
    </html>
  );
}
