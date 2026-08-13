import { Fraunces, Plus_Jakarta_Sans, Noto_Nastaliq_Urdu } from "next/font/google";
import "./globals.css";
import Nav from "@/components/Nav";
import Footer from "@/components/Footer";
import ScrollReveal from "@/components/ScrollReveal";
import { SITE_URL, clinic, hours } from "@/lib/site";

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
const urdu = Noto_Nastaliq_Urdu({
  subsets: ["arabic"],
  weight: ["400", "600"],
  variable: "--font-urdu",
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
    "skin treatment homeopathy",
    "diet and nutrition Lahore",
  ],
  alternates: { canonical: "/" },
  icons: { icon: "/icon.svg", apple: "/icon.svg" },
  openGraph: {
    type: "website",
    siteName: clinic.name,
    locale: "en_PK",
    url: "/",
    title: "Dr. Fariha Ashraf — Homeopathic Physician, Lahore",
    description:
      "Online homeopathic consultations for skin, digestion, hormonal and long-standing complaints. Remedies prepared in-house and couriered across Pakistan.",
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
  category: "health",
};

export const viewport = {
  themeColor: "#0B1F35",
  colorScheme: "light",
};

function jsonLd() {
  return {
    "@context": "https://schema.org",
    "@type": "MedicalBusiness",
    "@id": `${SITE_URL}/#clinic`,
    name: clinic.name,
    description:
      "Homeopathic physician offering online consultations for skin, digestion, hormonal and long-standing complaints, with remedies prepared in-house.",
    url: SITE_URL,
    telephone: clinic.phoneHref,
    email: clinic.email,
    medicalSpecialty: ["Dermatology", "Dietetics", "Homeopathy"],
    availableLanguage: clinic.languages,
    priceRange: "PKR 1,000–3,500",
    address: {
      "@type": "PostalAddress",
      addressLocality: "Lahore",
      addressRegion: "Punjab",
      addressCountry: "PK",
      streetAddress: "Shalimar Town",
    },
    founder: {
      "@type": "Person",
      name: clinic.name,
      jobTitle: "Homeopathic Physician",
      alumniOf: "Pakistan Homoeopathic Medical College, Lahore",
    },
    openingHoursSpecification: hours
      .filter((h) => !h.closed)
      .map((h) => ({
        "@type": "OpeningHoursSpecification",
        dayOfWeek: h.day,
        description: h.time,
      })),
  };
}

export default function RootLayout({ children }) {
  return (
    <html lang="en">
      <body className={`${fraunces.variable} ${jakarta.variable} ${urdu.variable}`}>
        <script
          type="application/ld+json"
          dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd()) }}
        />
        <Nav />
        <main>{children}</main>
        <Footer />
        <ScrollReveal />
      </body>
    </html>
  );
}
