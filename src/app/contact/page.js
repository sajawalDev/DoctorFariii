import Icon from "@/components/Icon";
import ContactForm from "@/components/ContactForm";
import ClinicHours from "@/components/ClinicHours";
import { clinic } from "@/lib/site";

export const metadata = {
  title: "Contact",
  description:
    "Contact Dr. Fariha Ashraf — phone, WhatsApp and email for questions about remedies, courier tracking or whether homeopathy suits your case. Online consultations across Pakistan.",
  alternates: { canonical: "/contact" },
  openGraph: {
    url: "/contact",
    title: "Contact Dr. Fariha Ashraf — Online Homeopathy",
    description:
      "Phone, WhatsApp and email, plus consultation hours. Online consultations across Pakistan — no physical clinic.",
  },
};

export default function ContactPage() {
  return (
    <>
      <section className="phero">
        <div className="wrap phero-in">
          <div className="crumb rv">
            Home &nbsp;/&nbsp; <b>Contact</b>
          </div>
          <h1 className="d1">
            <span className="wline">
              <span>Get in touch</span>
            </span>
            <span className="wline">
              <span>
                with the <em className="ital">clinic.</em>
              </span>
            </span>
          </h1>
          <p className="lede rv" style={{ "--dl": ".5s", marginTop: "24px", maxWidth: "600px" }}>
            For anything that isn&rsquo;t an appointment — questions about a remedy, courier
            tracking, or whether homeopathy suits your case.
          </p>
        </div>
      </section>

      <section className="sec">
        <div className="wrap cgrid">
          <div className="rv-l">
            <div className="eyebrow">Reach her</div>
            <h2 className="d3" style={{ marginBottom: "26px" }}>
              Direct lines.
            </h2>
            <div className="cinfo">
              <a className="citem" href={`tel:${clinic.phoneHref}`}>
                <div className="ic">
                  <Icon name="phone" size={19} strokeWidth={1.8} />
                </div>
                <div>
                  <b>Phone &amp; WhatsApp</b>
                  <span>{clinic.phoneDisplay}</span>
                  <em>Fastest for urgent questions</em>
                </div>
              </a>
              <a className="citem" href={`mailto:${clinic.email}`}>
                <div className="ic">
                  <Icon name="mail" size={19} strokeWidth={1.8} />
                </div>
                <div>
                  <b>Email</b>
                  <span>{clinic.email}</span>
                  <em>Replies within one working day</em>
                </div>
              </a>
              <div className="citem">
                <div className="ic">
                  <Icon name="video" size={19} strokeWidth={1.8} />
                </div>
                <div>
                  <b>Online consultations</b>
                  <span>Pakistan-wide, from anywhere</span>
                  <em>No physical clinic — remedies couriered to you</em>
                </div>
              </div>
            </div>

            <h3 className="d4" style={{ margin: "38px 0 14px" }}>
              Consultation hours
            </h3>
            <ClinicHours />
          </div>

          <div className="rv-r">
            <ContactForm />
          </div>
        </div>
      </section>
    </>
  );
}
