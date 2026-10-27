import Link from "next/link";
import Image from "next/image";
import Icon from "@/components/Icon";
import Faq from "@/components/Faq";
import JsonLd from "@/components/JsonLd";
import {
  pageMetadata,
  breadcrumbJsonLd,
  faqJsonLd,
  serviceCatalogJsonLd,
} from "@/lib/seo";

export const metadata = pageMetadata({
  title: "Services & Fees",
  description:
    "Online homeopathic consultation, skin & hair care, obesity control with diet management, beauty care, chronic case management and women's & children's health — online, for patients across Pakistan.",
  path: "/services",
  keywords: [
    "homeopathic consultation online",
    "homeopathy for skin and hair",
    "homeopathic weight loss diet plan",
    "homeopathy for PCOS",
    "chronic case management homeopathy",
    "homeopathic consultation fees Pakistan",
    "women and children homeopathy Lahore",
  ],
});

const services = [
  {
    slug: "online-consultation",
    icon: "video",
    title: "Online homeopathic consultation",
    body: "A 40-minute video or audio consultation covering your complaint, medical history, sleep, appetite, temperament and family history. You leave with a written plan and a prescribed remedy.",
  },
  {
    slug: "skin-hair",
    icon: "face",
    title: "Skin & Hair specialist",
    body: "Her named specialty. Acne, eczema, pigmentation, chronic itching, hair fall and scalp complaints — approached constitutionally, treated from the inside out rather than suppressed at the surface.",
  },
  {
    slug: "obesity",
    icon: "cutlery",
    title: "Obesity control — homeopathy & diet management",
    body: "Control your obesity with homoeopathy and a written diet-management plan built around desi household cooking, your budget and your routine — for lasting changes in weight, energy and digestion.",
  },
  {
    slug: "beauty",
    icon: "heart",
    title: "Beauty care & beauty products",
    body: "Homoeopathic beauty care for skin and hair, with guidance on gentle, remedy-based beauty products chosen to suit your skin type — supporting the treatment rather than masking the complaint.",
  },
  {
    slug: "chronic",
    icon: "pulse",
    title: "Chronic case management",
    body: "For complaints measured in years, not days. Structured review appointments, maintained case notes, and remedy adjustments based on how you actually respond over months.",
  },
  {
    slug: "women-children",
    icon: "female",
    title: "Women's & children's health",
    body: "Cycle irregularity, cycle-linked pain and mood, and gentle paediatric dosing for colic, teething, appetite and repeated infections. Consultations available in Urdu or Punjabi.",
  },
];

const included = [
  ["40 minutes of case taking", " — the complaint, plus everything around it"],
  ["Review of your reports", " — share lab results or photographs beforehand"],
  ["A written plan", " sent on WhatsApp or email after the call"],
  ["A prescribed remedy", " with dosage instructions in Urdu and English"],
  ["Two follow-up reviews", " included, so the plan can be adjusted"],
  ["A message window", " for short questions between appointments"],
];

const prices = [
  {
    eyebrow: "Follow-up",
    title: "Review consultation",
    amount: "PKR 1,000",
    unit: "/ review",
    note: "For existing patients continuing a case.",
    ticks: ["15–20 minute review", "Remedy or potency adjustment", "Updated written instructions"],
    cta: "Book a review",
    btn: "btn-o",
  },
  {
    feat: true,
    flag: "Most booked",
    eyebrow: "First consultation",
    title: "Full consultation",
    amount: "PKR 2,000",
    unit: "/ consultation",
    note: "The complete first appointment and case file.",
    ticks: ["40-minute case taking", "Written treatment plan", "Prescribed remedy & dosage", "Two follow-ups included"],
    cta: "Book first consultation",
    btn: "btn-b",
  },
  {
    eyebrow: "Combined",
    title: "Case + diet plan",
    amount: "PKR 3,500",
    unit: "/ package",
    note: "Consultation with a full nutrition plan alongside.",
    ticks: ["Everything in the first consultation", "Four-week written eating plan", "Grocery and portion guidance", "Monthly plan revision"],
    cta: "Book the package",
    btn: "btn-o",
  },
];

const faqs = [
  {
    q: "How does an online consultation actually work?",
    a: "You choose a date and time on the booking page and fill in a short case form. You'll receive a confirmation with a video link — WhatsApp, Zoom or Google Meet, whichever you prefer. At the appointment Dr. Fariha takes your full history, and afterwards you receive a written plan and, where needed, a prescribed remedy with dosage instructions.",
  },
  {
    q: "Where do I get the remedy?",
    a: "Dr. Fariha prescribes the remedy and includes it, with dosage instructions in both Urdu and English, in your written plan. You can then get it from any homeopathic pharmacy near you.",
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
    a: "Message the practice at least four hours before your appointment and it will be moved to the next available slot at no extra charge.",
  },
];

export default function ServicesPage() {
  return (
    <>
      <JsonLd
        data={breadcrumbJsonLd([
          { name: "Home", path: "/" },
          { name: "Services", path: "/services" },
        ])}
      />
      <JsonLd data={serviceCatalogJsonLd(services)} />
      <JsonLd data={faqJsonLd(faqs)} />
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
            <h2 className="d2">Ways to work together.</h2>
            <p className="lede" style={{ marginTop: "18px" }}>
              <em className="hl">Healing begins here</em> — from skin and hair to weight, beauty care
              and everyday complaints, every service starts with a full case history.
            </p>
          </div>
          <div>
            {services.map((s, i) => (
              <div className="srow rv" id={s.slug} style={{ "--dl": `${i * 0.08}s` }} key={s.title}>
                <div className="sr-ic">
                  <Icon name={s.icon} size={26} strokeWidth={1.7} />
                </div>
                <div>
                  <h3 className="d3">{s.title}</h3>
                  <p>{s.body}</p>
                </div>
                <Link href="/book" className="sr-go" aria-label={`Book a consultation — ${s.title}`}>
                  <Icon name="arrow" size={16} />
                </Link>
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
              style={{
                aspectRatio: "4 / 3",
                background: "linear-gradient(160deg,#0A5158,#063B41)",
                borderColor: "rgba(255,255,255,.12)",
              }}
            >
              <Image
                src="/servicesconsultation.jpg"
                alt="An online homeopathic consultation in progress — case notes written during a video call"
                fill
                sizes="(max-width: 900px) 100vw, 520px"
                style={{ objectFit: "cover" }}
              />
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
              Fees cover the consultation and the written plan. Prescribed remedies are bought
              separately from any homeopathic pharmacy.
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
