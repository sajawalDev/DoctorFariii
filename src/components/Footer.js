import Link from "next/link";
import Image from "next/image";
import { clinic, hours } from "@/lib/site";

export default function Footer() {
  const year = new Date().getFullYear();
  const weekdayHours = `${hours[0].day.slice(0, 3)}–${hours[5].day.slice(0, 3)}, 11:00 am – 6:00 pm`;

  return (
    <footer>
      <div className="wrap">
        <div className="fgrid">
          <div className="fbrand">
            <div className="brand">
              <span className="leaf-chip">
                <Image src="/leaf.png" alt="" width={30} height={30} />
              </span>
              <div className="brand-t">
                <div className="brand-n">{clinic.name}</div>
                <div className="brand-s">{clinic.role}</div>
              </div>
            </div>
            <p>
              An online homeopathic practice based in {clinic.city}, built around long case
              histories, careful follow-up, and consultations you don&rsquo;t have to travel for.
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
              <Link href="/services#skin-hair">Skin &amp; Hair specialist</Link>
              <Link href="/services#obesity">Obesity control &amp; diet</Link>
              <Link href="/services#beauty">Beauty care &amp; products</Link>
              <Link href="/services#women-children">Women&rsquo;s &amp; children&rsquo;s health</Link>
              <Link href="/services#chronic">Chronic case management</Link>
            </div>
          </div>

          <div>
            <h5>Contact</h5>
            <div className="fnav">
              <a href={`tel:${clinic.phoneHref}`}>{clinic.phoneDisplay}</a>
              <a href={`mailto:${clinic.email}`}>{clinic.email}</a>
              <Link href="/contact">Online &middot; Pakistan-wide</Link>
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
          <span>
            Built by{" "}
            <a href={clinic.builtByUrl} target="_blank" rel="noopener noreferrer">
              {clinic.builtBy}
            </a>
          </span>
        </div>
      </div>
    </footer>
  );
}
