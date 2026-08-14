import Link from "next/link";
import Image from "next/image";
import Icon from "@/components/Icon";

export const metadata = {
  title: "About the Doctor",
  description:
    "Dr. Fariha Ashraf, DHMS — a Lahore-trained homeopathic physician with a science background in zoology, botany and chemistry, and a practice built on long case histories.",
  alternates: { canonical: "/about" },
  openGraph: {
    url: "/about",
    title: "About Dr. Fariha Ashraf — Homeopathic Physician",
    description:
      "A Lahore-trained homeopathic physician practising where careful listening matters more than a quick prescription.",
  },
};

const stats = [
  { count: "5", suffix: "+", label: "Years in practice" },
  { count: "2", suffix: " yrs", label: "Online consulting" },
  { count: "3", suffix: "", label: "Languages spoken" },
  { count: "40", suffix: " min", label: "First consultation" },
];

const timeline = [
  {
    tag: "Homeopathic qualification",
    title: "Diploma in Homoeopathic Medical Sciences (DHMS)",
    place: "Pakistan Homoeopathic Medical College, Lahore",
  },
  {
    tag: "Undergraduate",
    title: "Bachelor of Sciences",
    place: "Zoology, Botany, Chemistry — Punjab Group of Colleges, Lahore",
  },
  {
    tag: "Intermediate",
    title: "Faculty of Sciences (Pre-Medical)",
    place: "Biology, Chemistry, Physics — Punjab Group of Colleges, Lahore",
  },
  {
    tag: "Secondary",
    title: "Matriculation in Sciences",
    place: "Biology, Physics, Chemistry, Mathematics — BISE Lahore",
  },
];

const experience = [
  {
    icon: "monitor",
    years: "2 years",
    title: "Online consultation & prescribing",
    body: "Running a full remote practice — case taking by video, written plans, remedies dispatched, follow-ups scheduled.",
  },
  {
    icon: "face",
    years: "1 year",
    title: "Homeopathic dermatology & diet",
    body: "A focused year on skin and nutrition cases — the two areas that still make up most of her caseload.",
  },
  {
    icon: "case",
    years: "2 years",
    title: "House job, hands-on practice",
    body: "Hands-on training under supervision: acute presentations, case histories, and the discipline of proper record keeping.",
  },
];

const beyond = [
  ["Volunteer work", " with a blood donation society in Lahore"],
  ["Writes poetry and health content", " in Urdu and English"],
  ["Hosting and public speaking", " at community health events"],
  ["Consults in Urdu, Punjabi and English", ""],
];

export default function AboutPage() {
  return (
    <>
      <section className="phero">
        <div className="wrap phero-in">
          <div className="crumb rv">
            Home &nbsp;/&nbsp; <b>About</b>
          </div>
          <h1 className="d1">
            <span className="wline">
              <span>The doctor</span>
            </span>
            <span className="wline">
              <span>
                behind the <em className="ital">case file.</em>
              </span>
            </span>
          </h1>
          <p className="lede rv" style={{ "--dl": ".5s", marginTop: "24px", maxWidth: "620px" }}>
            A homeopathic physician trained in Lahore, practising where careful listening matters
            more than a quick prescription.
          </p>
        </div>
      </section>

      {/* STORY */}
      <section className="sec">
        <div className="wrap split">
          <div className="sp-media rv-l">
            <div className="mframe" style={{ aspectRatio: "3 / 2" }}>
              <Image
                src="/aboutpageherstory.jpg"
                alt="Dr. Fariha Ashraf's homeopathic practice"
                fill
                sizes="(max-width: 900px) 100vw, 520px"
                style={{ objectFit: "cover" }}
              />
              <div className="vial" />
            </div>
          </div>
          <div className="rv-r">
            <div className="eyebrow">Her story</div>
            <h2 className="d2">Science first, then homeopathy.</h2>
            <p className="lede" style={{ marginTop: "22px" }}>
              Dr. Fariha Ashraf came to homeopathy through the sciences — matriculation and
              intermediate in biology, chemistry and physics, then a bachelor&rsquo;s in zoology,
              botany and chemistry at Punjab Group of Colleges, Lahore. Botany in particular turned
              out to matter: most of the materia medica she works from every day begins as a plant.
            </p>
            <p className="lede">
              The Diploma in Homoeopathic Medical Sciences at Pakistan Homoeopathic Medical College
              followed, and with it a two-year house job where she saw how much of a case
              never makes it into the first sentence a patient says.
            </p>
            <p className="lede">
              Today her practice is mostly online. Patients from Lahore, and increasingly from other
              cities, book a slot, sit down for a proper conversation, and receive remedies she
              prepares herself.
            </p>
          </div>
        </div>
      </section>

      {/* STATS */}
      <section className="sec-tight">
        <div className="wrap">
          <div className="stats rv-s">
            {stats.map((s) => (
              <div className="stat" key={s.label}>
                <b data-count={s.count} data-suffix={s.suffix}>
                  0
                </b>
                <span>{s.label}</span>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* QUALIFICATIONS */}
      <section className="sec tint">
        <div className="wrap split">
          <div className="rv-l">
            <div className="eyebrow">Education</div>
            <h2 className="d2">Qualifications.</h2>
            <p className="lede" style={{ marginTop: "20px", maxWidth: "440px" }}>
              A conventional science foundation, then a formal homeopathic medical qualification —
              all completed in Lahore.
            </p>
            <div
              className="disc"
              style={{ background: "#fff", border: "1px solid var(--line)", color: "var(--slate)", marginTop: "30px" }}
            >
              Homeopathic practice in Pakistan is regulated by the National Council for Homoeopathy.
              Registration details can be listed here once confirmed.
            </div>
          </div>
          <div className="rv-r">
            <div className="tline">
              {timeline.map((t) => (
                <div className="titem" key={t.title}>
                  <div className="tyear">{t.tag}</div>
                  <h4 className="d4">{t.title}</h4>
                  <p>{t.place}</p>
                </div>
              ))}
            </div>
          </div>
        </div>
      </section>

      {/* EXPERIENCE */}
      <section className="sec">
        <div className="wrap">
          <div className="shead rv">
            <div className="eyebrow brass">Hands-on experience</div>
            <h2 className="d2">Where she has practised.</h2>
          </div>
          <div className="grid cards3">
            {experience.map((e, i) => (
              <div className="card rv" style={{ "--dl": `${i * 0.1}s` }} key={e.title}>
                <div className="ic">
                  <Icon name={e.icon} size={22} strokeWidth={1.8} />
                </div>
                <div className="tyear">{e.years}</div>
                <h3 className="d4">{e.title}</h3>
                <p>{e.body}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* BEYOND THE CLINIC */}
      <section className="sec dark">
        <div className="wrap split">
          <div className="rv-l">
            <div className="eyebrow">Outside the consultation room</div>
            <h2 className="d2">
              A physician, and a few
              <br />
              other things besides.
            </h2>
            <p className="lede" style={{ marginTop: "22px" }}>
              Patients tend to notice that she writes. Poetry, mostly in Urdu — which is probably why
              the case notes read like sentences rather than abbreviations.
            </p>
            <ul className="ticks">
              {beyond.map(([strong, rest]) => (
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
          </div>
          <div className="rv-r">
            <div className="quote" style={{ textAlign: "left", maxWidth: "none" }}>
              <span className="qm">&ldquo;</span>
              <p style={{ color: "#fff" }}>
                A remedy is chosen for the person, not for the diagnosis. That is the whole of it —
                the rest is just careful listening.
              </p>
              <div className="qauth" style={{ color: "rgba(255,255,255,.5)" }}>
                Her working principle
              </div>
            </div>
          </div>
        </div>
      </section>

      <section className="sec-tight">
        <div className="wrap">
          <div className="ctaband rv-s">
            <div className="eyebrow brass-lite">Start your case</div>
            <h2 className="d2">Bring her the long version.</h2>
            <p>
              The first consultation is built for the complaint that has been going on for months,
              not the one that started yesterday.
            </p>
            <div className="cta-acts">
              <Link href="/book" className="btn btn-b">
                Book consultation
                <Icon name="arrow" size={15} className="ar" />
              </Link>
              <Link href="/services" className="btn btn-ghost-l">
                View services
              </Link>
            </div>
          </div>
        </div>
      </section>
    </>
  );
}
