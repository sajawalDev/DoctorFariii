import Link from "next/link";
import Icon from "@/components/Icon";
import Faq from "@/components/Faq";

export const metadata = {
  title: "Services & Fees",
  description:
    "Online homeopathic consultation, dermatology, diet & nutrition planning, chronic case management and women's & children's health — with remedies couriered across Pakistan.",
  alternates: { canonical: "/services" },
  openGraph: {
    url: "/services",
    title: "Homeopathic Services & Fees — Dr. Fariha Ashraf",
    description:
      "Six ways to work together, every one starting with a full case history. Clear pricing, remedies dispatched to your door.",
  },
};

const services = [
  {
    icon: "video",
    title: "Online homeopathic consultation",
    body: "A 40-minute video or audio consultation covering your complaint, medical history, sleep, appetite, temperament and family history. You leave with a written plan; the remedy is dispatched to your address.",
  },
  {
    icon: "face",
    title: "Homeopathic dermatology",
    body: "Her named specialty. Acne, eczema, pigmentation, chronic itching, hair fall and scalp complaints — approached constitutionally rather than as a surface problem to be suppressed.",
  },
  {
    icon: "cutlery",
    title: "Diet & nutrition planning",
    body: "A written eating plan built around desi household cooking, your budget and your routine — used alongside a remedy, or on its own for weight, energy and digestion goals.",
  },
  {
    icon: "pulse",
    title: "Chronic case management",
    body: "For complaints measured in years, not days. Structured review appointments, maintained case notes, and remedy adjustments based on how you actually respond over months.",
  },
  {
    icon: "female",
    title: "Women's & children's health",
    body: "Cycle irregularity, cycle-linked pain and mood, and gentle paediatric dosing for colic, teething, appetite and repeated infections. Consultations available in Urdu or Punjabi.",
  },
  {
    icon: "flask",
    title: "In-house prepared remedies",
    body: "Remedies are prepared and potentised in her own dispensary rather than ordered in, then couriered anywhere in Pakistan with dosage written on the label in Urdu and English.",
  },
];

const included = [
  ["40 minutes of case taking", " — the complaint, plus everything around it"],
  ["Review of your reports", " — share lab results or photographs beforehand"],
  ["A written plan", " sent on WhatsApp or email after the call"],
  ["Remedy prepared and couriered", " to your address across Pakistan"],
  ["Two follow-up reviews", " included, so the plan can be adjusted"],
  ["A message window", " for short questions between appointments"],
];

const prices = [
  {
    eyebrow: "Follow-up",
    title: "Review visit",
    amount: "PKR 1,000",
    unit: "/ visit",
    note: "For existing patients continuing a case.",
    ticks: ["15–20 minute review", "Remedy or potency adjustment", "Updated written instructions"],
    cta: "Book a review",
    btn: "btn-o",
  },
  {
    feat: true,
    flag: "Most booked",
    eyebrow: "First visit",
    title: "Full consultation",
    amount: "PKR 2,000",
    unit: "/ first visit",
    note: "The complete first appointment and case file.",
    ticks: ["40-minute case taking", "Written treatment plan", "Remedy prepared & dispatched", "Two follow-ups included"],
    cta: "Book first visit",
    btn: "btn-b",
  },
  {
    eyebrow: "Combined",
    title: "Case + diet plan",
    amount: "PKR 3,500",
    unit: "/ package",
    note: "Consultation with a full nutrition plan alongside.",
    ticks: ["Everything in the first visit", "Four-week written eating plan", "Grocery and portion guidance", "Monthly plan revision"],
    cta: "Book the package",
    btn: "btn-o",
  },
];

const faqs = [
  {
    q: "How does an online consultation actually work?",
    a: "You choose a date and time on the booking page and fill in a short case form. You'll receive a confirmation with a video link — WhatsApp, Zoom or Google Meet, whichever you prefer. At the appointment Dr. Fariha takes your full history, and afterwards you receive a written plan and, where a remedy is prescribed, a courier tracking number.",
  },
  {
    q: "How do I receive the remedy?",
    a: "Remedies are prepared in-house after the consultation and couriered to the address you provide. Delivery within Lahore is usually next day; elsewhere in Pakistan it typically takes two to four days. Dosage instructions are written on the label in both Urdu and English.",
  },
  {
    q: "How long before I see a change?",
    a: "It depends heavily on how long the complaint has been present. Recent, acute complaints often respond within days; something you've had for years is worked through over months, with reviews along the way. Dr. Fariha will give you a realistic timeline at the first appointment rather than a promise.",
  },
  {
    q: "Can I continue my current medication?",
    a: "Bring a list of everything you're taking to the first consultation. Homeopathic treatment is offered here as complementary care, and you should not stop any medicine prescribed by your physician without speaking to that physician first.",
  },
  {
    q: "Do you treat children and pregnant patients?",
    a: "Yes, both — with dosing adjusted accordingly. For pregnancy, please mention it when you book so enough time is set aside, and keep your obstetrician informed about any complementary care you're using.",
  },
  {
    q: "What if I need to reschedule?",
    a: "Message the clinic at least four hours before your appointment and it will be moved to the next available slot at no extra charge.",
  },
];

export default function ServicesPage() {
  return (
    <>
      <section className="phero">
        <div className="wrap phero-in">
          <div className="crumb rv">
            Home &nbsp;/&nbsp; <b>Services</b>
          </div>
          <h1 className="d1">
            <span className="wline">
              <span>Homeopathic care,</span>
            </span>
            <span className="wline">
              <span>
                fully <em className="ital">online.</em>
              </span>
            </span>
          </h1>
          <p className="lede rv" style={{ "--dl": ".5s", marginTop: "24px", maxWidth: "620px" }}>
            Every service below starts the same way — a full case history. What changes is what
            you&rsquo;re bringing to it.
          </p>
        </div>
      </section>

      {/* SERVICE ROWS */}
      <section className="sec">
        <div className="wrap">
          <div className="shead rv">
            <div className="eyebrow">What she offers</div>
            <h2 className="d2">Six ways to work together.</h2>
          </div>
          <div>
            {services.map((s, i) => (
              <div className="srow rv" style={{ "--dl": `${i * 0.08}s` }} key={s.title}>
                <div className="sr-ic">
                  <Icon name={s.icon} size={26} strokeWidth={1.7} />
                </div>
                <div>
                  <h3 className="d3">{s.title}</h3>
                  <p>{s.body}</p>
                </div>
                <div className="sr-go">
                  <Icon name="arrow" size={16} />
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* WHAT'S INCLUDED */}
      <section className="sec dark">
        <div className="wrap split rev">
          <div className="sp-media rv-r">
            <div
              className="mframe"
              style={{ background: "linear-gradient(160deg,#12314F,#0B1F35)", borderColor: "rgba(255,255,255,.12)" }}
            >
              <div className="ph">
                <b style={{ color: "rgba(255,255,255,.75)" }}>Consultation in progress</b>
                <span style={{ color: "rgba(255,255,255,.4)" }}>Photograph — 4:5</span>
              </div>
              <div className="vial" />
            </div>
          </div>
          <div className="rv-l">
            <div className="eyebrow">Inside a first consultation</div>
            <h2 className="d2">
              What the appointment
              <br />
              actually includes.
            </h2>
            <ul className="ticks">
              {included.map(([strong, rest]) => (
                <li key={strong}>
                  <span className="tick">
                    <Icon name="check" size={11} strokeWidth={3} />
                  </span>
                  <span>
                    <b>{strong}</b>
                    {rest}
                  </span>
                </li>
              ))}
            </ul>
            <Link href="/book" className="btn btn-b" style={{ marginTop: "36px" }}>
              Book a first consultation
              <Icon name="arrow" size={15} className="ar" />
            </Link>
          </div>
        </div>
      </section>

      {/* FEES */}
      <section className="sec">
        <div className="wrap">
          <div className="shead ctr rv">
            <span className="ph-note">Placeholder fees — confirm with Dr. Fariha</span>
            <div className="eyebrow">Consultation fees</div>
            <h2 className="d2">Clear pricing, no surprises.</h2>
            <p className="lede">
              Fees cover the consultation and the written plan. Remedy preparation and courier are
              billed separately at cost.
            </p>
          </div>
          <div className="grid cards3">
            {prices.map((p, i) => (
              <div className={`price${p.feat ? " feat" : ""} rv`} style={{ "--dl": `${i * 0.1}s` }} key={p.title}>
                {p.flag && <span className="pflag">{p.flag}</span>}
                <div className={`eyebrow${p.feat ? " brass-lite" : ""}`}>{p.eyebrow}</div>
                <h3 className="d3">{p.title}</h3>
                <div className="pamt">
                  {p.amount} <small>{p.unit}</small>
                </div>
                <p className={p.feat ? undefined : "muted"} style={{ fontSize: ".9rem", margin: 0 }}>
                  {p.note}
                </p>
                <ul className="ticks">
                  {p.ticks.map((t) => (
                    <li key={t}>
                      <span className="tick">
                        <Icon name="check" size={11} strokeWidth={3} />
                      </span>
                      <span>{t}</span>
                    </li>
                  ))}
                </ul>
                <Link href="/book" className={`btn ${p.btn}`}>
                  {p.cta}
                </Link>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* FAQ */}
      <section className="sec tint">
        <div className="wrap" style={{ maxWidth: "900px" }}>
          <div className="shead ctr rv">
            <div className="eyebrow">Before you book</div>
            <h2 className="d2">Common questions.</h2>
          </div>
          <Faq items={faqs} />
        </div>
      </section>

      <section className="sec-tight">
        <div className="wrap">
          <div className="ctaband rv-s">
            <div className="eyebrow brass-lite">Next step</div>
            <h2 className="d2">Choose a time that suits you.</h2>
            <p>Slots are open Monday to Saturday, morning and evening.</p>
            <div className="cta-acts">
              <Link href="/book" className="btn btn-b">
                Book consultation
                <Icon name="arrow" size={15} className="ar" />
              </Link>
            </div>
          </div>
        </div>
      </section>
    </>
  );
}
