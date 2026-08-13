import BookingFlow from "@/components/BookingFlow";

export const metadata = {
  title: "Book a Consultation",
  description:
    "Reserve an online homeopathic consultation with Dr. Fariha Ashraf. Choose a service, pick a date and time in Pakistan Standard Time, and share your case in a few minutes.",
  alternates: { canonical: "/book" },
  openGraph: {
    url: "/book",
    title: "Book a Consultation — Dr. Fariha Ashraf",
    description:
      "Choose a service, pick a date and time, and reserve your homeopathic consultation online.",
  },
};

export default function BookPage() {
  return <BookingFlow />;
}
