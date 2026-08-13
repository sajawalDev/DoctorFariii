// Central place for clinic facts, contact details and navigation.
// Update these once and every page + all SEO metadata follows.

export const SITE_URL =
  process.env.NEXT_PUBLIC_SITE_URL?.replace(/\/$/, "") ||
  "https://drfarihaashraf.com";

export const clinic = {
  name: "Dr. Fariha Ashraf",
  role: "Homeopathic Physician",
  qualification: "DHMS",
  monogram: "FA",
  tagline: "Healing that begins with listening.",
  taglineUrdu: "علاج، سننے سے شروع ہوتا ہے",
  city: "Lahore",
  area: "Shalimar Town, Lahore",
  country: "Pakistan",
  phoneDisplay: "(+92) 314 4270788",
  phoneHref: "+923144270788",
  email: "learningpoint836@gmail.com",
  languages: ["Urdu", "Punjabi", "English"],
  builtBy: "BOSS Digital Solutions",
};

export const hours = [
  { day: "Monday", dow: 1, time: "11:00 am – 8:00 pm" },
  { day: "Tuesday", dow: 2, time: "11:00 am – 8:00 pm" },
  { day: "Wednesday", dow: 3, time: "11:00 am – 8:00 pm" },
  { day: "Thursday", dow: 4, time: "11:00 am – 8:00 pm" },
  { day: "Friday", dow: 5, time: "11:00 am – 1:00 pm, 3:00 – 8:00 pm" },
  { day: "Saturday", dow: 6, time: "11:00 am – 5:00 pm" },
  { day: "Sunday", dow: 0, time: "Closed", closed: true },
];

export const navLinks = [
  { href: "/", label: "Home" },
  { href: "/about", label: "About" },
  { href: "/services", label: "Services" },
  { href: "/contact", label: "Contact" },
];
