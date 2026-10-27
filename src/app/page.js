import Link from "next/link";
import Image from "next/image";
import Icon from "@/components/Icon";
import HeroGlobules from "@/components/HeroGlobules";
import { clinic } from "@/lib/site";

const conditions = [
  {
    icon: "face",
    title: "Skin & hair",
    body: "Her main area of focus. Long-running skin complaints are taken as a whole picture, not treated surface-first.",
    tags: ["Acne", "Eczema", "Pigmentation", "Hair fall"],
  },
  {
    icon: "stomach",
    title: "Digestion & gut",
    body: "Acidity, bloating, irregular bowels and appetite issues, looked at alongside what you actually eat each day.",
    tags: ["Acidity", "Bloating", "Constipation"],
  },
  {
    icon: "female",
    title: "Women's health",
    body: "Irregular cycles, cycle-linked pain and mood, and the skin and weight changes that often travel with them.",
    tags: ["Irregular cycles", "PCOS support"],
  },
  {
    icon: "immunity",
    title: "Allergy & immunity",
    body: "Seasonal sneezing, sinus congestion and the pattern of catching every infection that passes through the house.",
    tags: ["Sinus", "Seasonal allergy", "Recurrent cold"],
  },
  {
    icon: "heart",
    title: "Children's health",
    body: "Gentle dosing for children — colic, teething trouble, appetite, sleep and repeated throat or chest infections.",
    tags: ["Colic", "Appetite", "Sleep"],
  },
  {
    icon: "pulse",
    title: "Diet & lifestyle",
    body: "A written eating plan built around your household, your budget and your routine — not a printout of forbidden foods.",
    tags: ["Weight", "Meal planning", "Energy"],
  },
];

const steps = [
  { n: "01", title: "Book a time", body: "Pick a date and slot that suits you. You'll get a confirmation with the meeting link." },
  { n: "02", title: "Full case taking", body: "A 40-minute conversation covering the complaint, your history, sleep, appetite and temperament." },
  { n: "03", title: "Remedy & plan", body: "A written plan and a remedy prescribed for your case, with clear dosage instructions." },
  { n: "04", title: "Follow-up", body: "Two scheduled reviews so the plan is adjusted to how you actually respond." },
];

const strip = [
  "Homeopathic Dermatology",
  "Diet & Nutrition",
  "Chronic Case Management",
  "Women's Health",
  "Children's Health",
  "Online Consultation",
];

export default function HomePage() {
  return (
    <>
      {/* 1. HERO */}
      <section className="hero">
        <div className="hero-bg" />
        <HeroGlobules />
        <div className="wrap hero-grid">
          <div>
            <div className="hero-tag rv">
              <i>&#10003;</i> Now accepting online patients
            </div>
            <h1 className="d1">
              <span className="wline" style={{ "--dl": ".12s" }}>
                <span>
                  <em className="hl">True Healing</em> begins
                </span>
              </span>
              <span className="wline" style={{ "--dl": ".2s" }}>
                <span>when we treat the patient</span>
              </span>
              <span className="wline" style={{ "--dl": ".28s" }}>
                <span>
                  as a <em className="ital">whole</em> &mdash; not just
                </span>
              </span>
              <span className="wline" style={{ "--dl": ".36s" }}>
                <span>the disease.</span>
              </span>
            </h1>
            <p className="lede hero-lede rv" style={{ "--dl": ".65s" }}>
              Dr. Fariha Ashraf, DHMS — a homeopathic physician in Lahore treating skin, digestion,
              hormonal and long-standing complaints. Consult from anywhere in Pakistan, in Urdu,
              Punjabi or English.
            </p>
            <div className="hero-acts rv" style={{ "--dl": ".75s" }}>
              <Link href="/book" className="btn btn-p">
                Book an online consultation
                <Icon name="arrow" size={15} className="ar" />
              </Link>
              <Link href="/services" className="btn btn-o">
                See what she treats
              </Link>
            </div>
            <div className="hero-meta rv" style={{ "--dl": ".85s" }}>
              <div>
                <b data-count="4" data-suffix="+">0</b>
                <span>Years in practice</span>
              </div>
              <div>
                <b>DHMS</b>
                <span>Qualified physician</span>
              </div>
              <div>
                <b data-count="100" data-suffix="%">0</b>
                <span>Individual case-taking</span>
              </div>
            </div>
          </div>

          <div className="pcard rv-s" style={{ "--dl": ".35s" }} id="pcard">
            <div className="pframe">
              <Image
                src="/homepagehero.jpg"
                alt={`${clinic.name} — ${clinic.role}`}
                fill
                priority
                sizes="(max-width: 1080px) 430px, 440px"
                style={{ objectFit: "cover" }}
              />
            </div>
            <div className="pbadge b1">
              <div className="ic">
                <Icon name="shield" size={18} strokeWidth={2} />
              </div>
              <div>
                <b>DHMS Certified</b>
                <span>Pak. Homoeopathic Medical College</span>
              </div>
            </div>
            <div className="pbadge b2">
              <div className="ic brass">
                <Icon name="video" size={18} strokeWidth={2} />
              </div>
              <div>
                <b>Online consultations</b>
                <span>Video or audio, Pakistan-wide</span>
              </div>
            </div>
          </div>
        </div>

        <div className="scroll-cue">
          <span>Scroll</span>
          <div className="cue-line" />
        </div>
      </section>

      {/* credential strip */}
      <div className="strip">
        <div className="strip-in">
          {[0, 1].map((dup) => (
            <span key={dup}>
              {strip.map((s, i) => (
                <span key={i}>{s}</span>
              ))}
            </span>
          ))}
        </div>
      </div>

      {/* 2. WHAT SHE TREATS */}
      <section className="sec">
        <div className="wrap">
          <div className="shead-row">
            <div className="shead rv">
              <div className="eyebrow">Areas of care</div>
              <h2 className="d2">
                Complaints that rarely fit
                <br />a five-minute visit.
              </h2>
            </div>
            <Link href="/services" className="btn btn-o rv" style={{ "--dl": ".15s" }}>
              All services
              <Icon name="arrow" size={15} className="ar" />
            </Link>
          </div>
          <div className="grid cards3">
            {conditions.map((c, i) => (
              <div className="card rv" style={{ "--dl": `${(i % 3) * 0.1}s` }} key={c.title}>
                <div className="ic">
                  <Icon name={c.icon} size={22} strokeWidth={1.8} />
                </div>
                <h3 className="d4">{c.title}</h3>
                <p>{c.body}</p>
                <div className="tags">
                  {c.tags.map((t) => (
                    <span className="tag" key={t}>
                      {t}
                    </span>
                  ))}
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* 3. HOW IT WORKS */}
      <section className="sec dark">
        <div className="wrap">
          <div className="shead ctr rv">
            <div className="eyebrow">How a consultation runs</div>
            <h2 className="d2">Four steps, start to follow-up.</h2>
            <p className="lede">
              No queue, no rushed history. Most of the first appointment is spent on questions
              nobody has asked you before.
            </p>
          </div>
          <div className="proc">
            {steps.map((s, i) => (
              <div className="pstep rv" style={{ "--dl": `${i * 0.12}s` }} key={s.n}>
                <div className="pnum">{s.n}</div>
                <h4 className="d4">{s.title}</h4>
                <p>{s.body}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* 4. ABOUT PREVIEW */}
      <section className="sec">
        <div className="wrap split">
          <div className="sp-media rv-l">
            <div className="mframe">
              <Image
                src="/homepageaboutsection.jpg"
                alt="Dr. Fariha Ashraf, homeopathic physician"
                fill
                sizes="(max-width: 900px) 100vw, 520px"
                style={{ objectFit: "cover" }}
              />
              <div className="vial" />
            </div>
          </div>
          <div className="rv-r">
            <div className="eyebrow">About the doctor</div>
            <h2 className="d2">
              Five years of asking
              <br />
              the longer questions.
            </h2>
            <p className="lede" style={{ marginTop: "22px" }}>
              Dr. Fariha Ashraf holds a Diploma in Homoeopathic Medical Sciences from Pakistan
              Homoeopathic Medical College, Lahore, with a science background in zoology, botany and
              chemistry behind it. Her practice has moved from a two-year supervised house job to a
              fully online consultation room serving patients across Pakistan.
            </p>
            <ul className="ticks">
              {[
                ["DHMS", " — Pakistan Homoeopathic Medical College, Lahore"],
                ["Two years", " of online consultation and prescribing"],
                ["Dermatology and diet", " as her named areas of focus"],
                ["Urdu, Punjabi and English", " — consult in whichever you're most at ease"],
              ].map(([strong, rest]) => (
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
            <Link href="/about" className="btn btn-o" style={{ marginTop: "34px" }}>
              Read her full story
              <Icon name="arrow" size={15} className="ar" />
            </Link>
          </div>
        </div>
      </section>

      {/* 5. PHILOSOPHY QUOTE */}
      <section className="sec-tight tint">
        <div className="wrap">
          <div className="quote rv">
            <span className="qm">&ldquo;</span>
            <p>
              Two patients can arrive with the same rash and leave with different remedies. The
              complaint is only the beginning of the case.
            </p>
            <div className="qauth">Dr. Fariha Ashraf, DHMS</div>
          </div>
        </div>
      </section>

      {/* 7. CTA */}
      <section className="sec-tight">
        <div className="wrap">
          <div className="ctaband rv-s">
            <div className="eyebrow brass-lite">Ready when you are</div>
            <h2 className="d2">Book your first consultation.</h2>
            <p>
              Pick a date, choose a time, and tell her what&rsquo;s been going on. It takes about two
              minutes.
            </p>
            <div className="cta-acts">
              <Link href="/book" className="btn btn-b">
                Book consultation
                <Icon name="arrow" size={15} className="ar" />
              </Link>
              <Link href="/contact" className="btn btn-ghost-l">
                Ask a question first
              </Link>
            </div>
          </div>
        </div>
      </section>
    </>
  );
}
