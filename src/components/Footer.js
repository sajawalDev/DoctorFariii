import Link from "next/link";
import { clinic, hours } from "@/lib/site";

export default function Footer() {
  const year = new Date().getFullYear();
  const weekdayHours = `${hours[0].day.slice(0, 3)}–${hours[5].day.slice(0, 3)}, 11:00 am – 8:00 pm`;

  return (
    <footer>
      <div className="wrap">
        <div className="fgrid">
          <div className="fbrand">
            <div className="brand">
              <div className="mono">{clinic.monogram}</div>
              <div className="brand-t">
                <div className="brand-n">{clinic.name}</div>
                <div className="brand-s">{clinic.role}</div>
              </div>
            </div>
            <p>
              A homeopathic practice in {clinic.city} built around long case histories, remedies
              prepared in-house, and consultations you don&rsquo;t have to travel for.
            </p>
          </div>

          <div>
            <h5>Pages</h5>
            <div className="fnav">
              <Link href="/">Home</Link>
              <Link href="/about">About</Link>
              <Link href="/services">Services</Link>
              <Link href="/contact">Contact</Link>
              <Link href="/book">Book consultation</Link>
            </div>
          </div>

          <div>
            <h5>Care</h5>
            <div className="fnav">
              <Link href="/services">Homeopathic dermatology</Link>
              <Link href="/services">Diet &amp; nutrition</Link>
              <Link href="/services">Women&rsquo;s health</Link>
              <Link href="/services">Children&rsquo;s health</Link>
              <Link href="/services">Chronic cases</Link>
            </div>
          </div>

          <div>
            <h5>Clinic</h5>
            <div className="fnav">
              <a href={`tel:${clinic.phoneHref}`}>{clinic.phoneDisplay}</a>
              <a href={`mailto:${clinic.email}`}>{clinic.email}</a>
              <Link href="/contact">{clinic.area}</Link>
              <Link href="/contact">{weekdayHours}</Link>
            </div>
          </div>
        </div>

        <div className="disc">
          Homeopathic treatment is offered here as complementary care. It does not replace
          emergency medical attention or treatment prescribed by your physician. For any medical
          emergency, contact your nearest hospital immediately.
        </div>

        <div className="fbot">
          <span>
            &copy; {year} {clinic.name}. All rights reserved.
          </span>
          <span>Built by {clinic.builtBy}</span>
        </div>
      </div>
    </footer>
  );
}
