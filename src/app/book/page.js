import BookingFlow from "@/components/BookingFlow";
import BookingProvider from "@/components/BookingProvider";
import JsonLd from "@/components/JsonLd";
import { pageMetadata, breadcrumbJsonLd } from "@/lib/seo";

export const metadata = pageMetadata({
  title: "Book a Consultation",
  description:
    "Reserve an online homeopathic consultation with Dr. Fariha Ashraf. Choose a service, pick a date and time in Pakistan Standard Time, and share your case in a few minutes.",
  path: "/book",
  keywords: [
    "book homeopathy consultation online",
    "online homeopathic appointment Pakistan",
    "Dr. Fariha Ashraf booking",
    "homeopathic doctor appointment Lahore",
  ],
});

const breadcrumb = breadcrumbJsonLd([
  { name: "Home", path: "/" },
  { name: "Book a Consultation", path: "/book" },
]);

export default function BookPage() {
  return (
    <BookingProvider>
      <JsonLd data={breadcrumb} />
      <BookingFlow />
    </BookingProvider>
  );
}
