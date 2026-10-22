// Central place for clinic facts, contact details and navigation.
// Update these once and every page + all SEO metadata follows.

export const SITE_URL =
  process.env.NEXT_PUBLIC_SITE_URL?.replace(/\/$/, "") ||
  "https://doctorfariha.online";

export const clinic = {
  name: "Dr. Fariha Ashraf",
  role: "Homeopathic Physician",
  qualification: "DHMS",
  monogram: "FA",
  tagline: "True healing begins when we treat the patient as a whole, not just the disease.",
  city: "Lahore",
  country: "Pakistan",
  phoneDisplay: "(+92) 314 4270788",
  phoneHref: "+923144270788",
  email: "doctorfarihallc@gmail.com",
  languages: ["Urdu", "Punjabi", "English"],
  builtBy: "BOSS Digital Solutions",
  builtByUrl: "https://www.bossdigitalsol.com/",
};

export const hours = [
  { day: "Monday", dow: 1, time: "11:00 am – 6:00 pm" },
  { day: "Tuesday", dow: 2, time: "11:00 am – 6:00 pm" },
  { day: "Wednesday", dow: 3, time: "11:00 am – 6:00 pm" },
  { day: "Thursday", dow: 4, time: "11:00 am – 6:00 pm" },
  { day: "Friday", dow: 5, time: "11:00 am – 6:00 pm" },
  { day: "Saturday", dow: 6, time: "11:00 am – 6:00 pm" },
  { day: "Sunday", dow: 0, time: "Closed", closed: true },
];

export const navLinks = [
  { href: "/", label: "Home" },
  { href: "/about", label: "About" },
  { href: "/services", label: "Services" },
  { href: "/contact", label: "Contact" },
];
