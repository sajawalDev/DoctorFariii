import Icon from "@/components/Icon";
import ContactForm from "@/components/ContactForm";
import ClinicHours from "@/components/ClinicHours";
import { clinic } from "@/lib/site";

export const metadata = {
  title: "Contact the Clinic",
  description:
    "Contact Dr. Fariha Ashraf's homeopathic clinic in Shalimar Town, Lahore — phone, WhatsApp and email for questions about remedies, courier tracking or whether homeopathy suits your case.",
  alternates: { canonical: "/contact" },
  openGraph: {
    url: "/contact",
    title: "Contact Dr. Fariha Ashraf's Clinic — Lahore",
    description:
      "Phone, WhatsApp and email for the clinic, plus consultation hours. In-person visits by appointment in Shalimar Town, Lahore.",
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
                  <Icon name="pin" size={19} strokeWidth={1.8} />
                </div>
                <div>
                  <b>Clinic</b>
                  <span>{clinic.area}</span>
                  <em>In-person visits by appointment only</em>
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

      {/* map placeholder */}
      <section className="sec-tight">
        <div className="wrap">
          <div
            className="rv-s"
            style={{
              border: "1px solid var(--line)",
              borderRadius: "24px",
              overflow: "hidden",
              background: "var(--porcelain)",
              height: "340px",
              display: "grid",
              placeItems: "center",
              position: "relative",
            }}
          >
            <div style={{ textAlign: "center" }}>
              <div
                className="ic"
                style={{
                  width: "54px",
                  height: "54px",
                  borderRadius: "15px",
                  background: "#fff",
                  display: "grid",
                  placeItems: "center",
                  margin: "0 auto 16px",
                  boxShadow: "var(--shadow-s)",
                  color: "var(--lapis)",
                }}
              >
                <Icon name="pin" size={22} strokeWidth={1.8} />
              </div>
              <b style={{ fontFamily: "var(--serif)", fontSize: "1.16rem", display: "block" }}>
                {clinic.area}
              </b>
              <span className="muted" style={{ fontSize: ".86rem" }}>
                Google Maps embed goes here
              </span>
            </div>
          </div>
        </div>
      </section>
    </>
  );
}
