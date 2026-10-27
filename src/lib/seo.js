// Central SEO helpers: page metadata + JSON-LD structured data.
// Keeping these in one place means titles, canonicals, Open Graph, Twitter
// cards and schema.org markup all stay consistent across the site.

import { SITE_URL, clinic, hours } from "@/lib/site";

const OG_TITLE_DEFAULT = `${clinic.name} — ${clinic.role} in ${clinic.city}`;

/**
 * Build a complete, correct metadata object for a page.
 *
 * Next.js merges metadata *shallowly*: when a page exports its own
 * `openGraph` / `twitter`, it REPLACES the layout's version rather than
 * merging. So each page must restate siteName / locale / card type or those
 * tags silently disappear. This helper guarantees they are always present.
 */
export function pageMetadata({ title, description, path = "/", keywords }) {
  const ogTitle = title ? `${title} · ${clinic.name}` : OG_TITLE_DEFAULT;
  return {
    title,
    description,
    ...(keywords ? { keywords } : {}),
    alternates: { canonical: path },
    openGraph: {
      type: "website",
      siteName: clinic.name,
      locale: "en_PK",
      url: path,
      title: ogTitle,
      description,
    },
    twitter: {
      card: "summary_large_image",
      title: ogTitle,
      description,
    },
  };
}

const physicianId = `${SITE_URL}/#physician`;
const clinicId = `${SITE_URL}/#clinic`;
const websiteId = `${SITE_URL}/#website`;

const postalAddress = {
  "@type": "PostalAddress",
  addressLocality: clinic.city,
  addressRegion: "Punjab",
  addressCountry: "PK",
};

const areaServed = { "@type": "Country", name: clinic.country };

const specialties = ["Dermatology", "Dietetics", "Homeopathy"];

function openingHours() {
  // All open days share the same 11:00–18:00 window.
  return hours
    .filter((h) => !h.closed)
    .map((h) => ({
      "@type": "OpeningHoursSpecification",
      dayOfWeek: `https://schema.org/${h.day}`,
      opens: "11:00",
      closes: "18:00",
    }));
}

/**
 * The site-wide knowledge graph: the practice, the physician and the website,
 * cross-linked by @id so search engines read them as one entity. Rendered once
 * in the root layout.
 */
export function siteJsonLd() {
  return {
    "@context": "https://schema.org",
    "@graph": [
      {
        "@type": "MedicalBusiness",
        "@id": clinicId,
        name: clinic.name,
        alternateName: `${clinic.name}, ${clinic.qualification}`,
        description:
          "Online homeopathic physician offering consultations for skin, digestion, hormonal and long-standing complaints, with remedies couriered across Pakistan.",
        url: SITE_URL,
        logo: `${SITE_URL}/logo.png`,
        image: `${SITE_URL}/homepagehero.jpg`,
        telephone: `+${clinic.phoneHref.replace(/^\+/, "")}`,
        email: clinic.email,
        slogan: clinic.tagline,
        priceRange: "PKR 1,000–3,500",
        currenciesAccepted: "PKR",
        medicalSpecialty: specialties,
        availableLanguage: clinic.languages,
        knowsLanguage: clinic.languages,
        areaServed,
        address: postalAddress,
        founder: { "@id": physicianId },
        employee: { "@id": physicianId },
        openingHoursSpecification: openingHours(),
      },
      {
        "@type": "Physician",
        "@id": physicianId,
        name: clinic.name,
        givenName: "Fariha",
        familyName: "Ashraf",
        jobTitle: `${clinic.role} (${clinic.qualification})`,
        description:
          "Lahore-trained homeopathic physician (DHMS) focused on dermatology and diet, running a fully online practice serving patients across Pakistan.",
        url: `${SITE_URL}/about`,
        image: `${SITE_URL}/homepagehero.jpg`,
        telephone: `+${clinic.phoneHref.replace(/^\+/, "")}`,
        email: clinic.email,
        medicalSpecialty: specialties,
        knowsLanguage: clinic.languages,
        worksFor: { "@id": clinicId },
        areaServed,
        alumniOf: {
          "@type": "CollegeOrUniversity",
          name: "Pakistan Homoeopathic Medical College, Lahore",
        },
        hasCredential: {
          "@type": "EducationalOccupationalCredential",
          credentialCategory: "Diploma",
          name: "Diploma in Homoeopathic Medical Sciences (DHMS)",
        },
      },
      {
        "@type": "WebSite",
        "@id": websiteId,
        url: SITE_URL,
        name: `${clinic.name} — ${clinic.role}`,
        description:
          "Online homeopathic consultations for skin, digestion, hormonal and long-standing complaints across Pakistan.",
        inLanguage: "en",
        publisher: { "@id": clinicId },
      },
    ],
  };
}

/** Breadcrumb trail for an inner page. Pass ordered {name, path} items. */
export function breadcrumbJsonLd(items) {
  return {
    "@context": "https://schema.org",
    "@type": "BreadcrumbList",
    itemListElement: items.map((it, i) => ({
      "@type": "ListItem",
      position: i + 1,
      name: it.name,
      item: `${SITE_URL}${it.path === "/" ? "" : it.path}`,
    })),
  };
}

/** FAQPage markup — eligible for FAQ rich results in Google. */
export function faqJsonLd(faqs) {
  return {
    "@context": "https://schema.org",
    "@type": "FAQPage",
    mainEntity: faqs.map((f) => ({
      "@type": "Question",
      name: f.q,
      acceptedAnswer: { "@type": "Answer", text: f.a },
    })),
  };
}

/** Service catalogue, attached to the clinic entity via its @id. */
export function serviceCatalogJsonLd(services) {
  return {
    "@context": "https://schema.org",
    "@type": "MedicalBusiness",
    "@id": clinicId,
    hasOfferCatalog: {
      "@type": "OfferCatalog",
      name: "Homeopathic consultations & services",
      itemListElement: services.map((s) => ({
        "@type": "Offer",
        itemOffered: {
          "@type": "Service",
          name: s.title,
          description: s.body,
          provider: { "@id": clinicId },
          areaServed,
        },
      })),
    },
  };
}
