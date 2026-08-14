"use client";

import { Fragment, useRef, useState } from "react";
import Link from "next/link";
import Image from "next/image";
import Icon from "./Icon";
import { useClientToday } from "@/lib/useClientToday";
import { SERVICES, MODES } from "@/lib/consultation";
import { ALL_SLOTS, dateKey } from "@/lib/slots";
import { useBookings } from "./BookingProvider";

const MON = ["January", "February", "March", "April", "May", "June", "July", "August", "September", "October", "November", "December"];
const DOW = ["Sunday", "Monday", "Tuesday", "Wednesday", "Thursday", "Friday", "Saturday"];

const STEPS = [
  { s: 1, t: "Service" },
  { s: 2, t: "Date & time" },
  { s: 3, t: "Your details" },
  { s: 4, t: "Confirm" },
];

const PATIENT_INIT = { bname: "", bphone: "", bemail: "", bcity: "", bage: "", bgender: "", bcomplaint: "", bdur: "", bprev: "", bnotes: "" };
const patientRules = {
  bname: (v) => v.trim().length > 1,
  bphone: (v) => v.replace(/\D/g, "").length >= 10,
  bemail: (v) => /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(v),
  bage: (v) => v !== "" && +v > 0 && +v < 121,
  bcomplaint: (v) => v.trim().length > 2,
};

const sameDay = (a, b) => a && b && a.getTime() === b.getTime();
const fmtDate = (d) => `${DOW[d.getDay()]}, ${d.getDate()} ${MON[d.getMonth()]} ${d.getFullYear()}`;

export default function BookingFlow() {
  const wrapRef = useRef(null);
  const { isTaken, openCount, commit } = useBookings();
  const [step, setStep] = useState(1);
  const [service, setService] = useState(null); // one of SERVICES
  const [mode, setMode] = useState(null);
  const [date, setDate] = useState(null);
  const [time, setTime] = useState(null);
  const [patient, setPatient] = useState(PATIENT_INIT);
  const [perr, setPerr] = useState({});
  const [consent, setConsent] = useState(false);
  const [ref, setRef] = useState("");
  const [booking, setBooking] = useState("idle"); // idle | sending | error
  const [bookErr, setBookErr] = useState("");

  const today = useClientToday(); // start-of-day on client, null during SSR
  const [monthOffset, setMonthOffset] = useState(0);
  const view = today ? new Date(today.getFullYear(), today.getMonth() + monthOffset, 1) : null;

  const dayOpen = (d) => {
    if (!today || d < today) return false;
    if (d.getDay() === 0) return false; // Sunday closed
    const limit = new Date(today);
    limit.setDate(limit.getDate() + 60);
    if (d > limit) return false;
    return openCount(dateKey(d)) > 0; // hide days whose every slot is taken
  };

  const goStep = (n) => {
    setStep(n);
    const reduce = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
    const el = wrapRef.current;
    if (el) window.scrollTo({ top: el.offsetTop - 90, behavior: reduce ? "auto" : "smooth" });
  };

  const pickDate = (d) => {
    setDate(d);
    setTime(null);
  };

  const submitDetails = () => {
    const next = {};
    Object.keys(patientRules).forEach((k) => {
      if (!patientRules[k](patient[k])) next[k] = true;
    });
    setPerr(next);
    if (Object.keys(next).length === 0) goStep(4);
  };

  // Confirm sends the booking to the server, which validates it, builds the
  // .ics calendar file and emails both the clinic and the patient. Only once the
  // server confirms do we mark the slot taken (in context + localStorage) so it
  // disappears from availability, and show the success screen with the real
  // reference the server generated.
  const confirm = async () => {
    if (booking === "sending") return;
    setBooking("sending");
    setBookErr("");
    const dKey = dateKey(date);

    try {
      const res = await fetch("/api/book", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ service: service.svc, mode: mode.mode, dateKey: dKey, time, patient }),
      });
      const data = await res.json().catch(() => ({}));

      if (res.ok && data.ok) {
        setRef(data.ref);
        commit(dKey, time);
        setBooking("idle");
        goStep(5);
        return;
      }
      setBookErr(data.error || "Something went wrong. Please try again.");
      setBooking("error");
    } catch {
      setBookErr("Couldn't reach the server. Please check your connection and try again.");
      setBooking("error");
    }
  };

  const rebook = () => {
    setService(null);
    setMode(null);
    setDate(null);
    setTime(null);
    setPatient(PATIENT_INIT);
    setPerr({});
    setConsent(false);
    setRef("");
    setBooking("idle");
    setBookErr("");
    setMonthOffset(0);
    goStep(1);
  };

  const updatePatient = (name) => (e) => {
    setPatient((p) => ({ ...p, [name]: e.target.value }));
    setPerr((er) => ({ ...er, [name]: false }));
  };

  // ---- summary rail ----
  const sum = [
    { icon: "case", label: "Service", value: service ? `${service.svc} · ${service.dur}` : "Not selected yet", set: !!service },
    { icon: "video", label: "Format", value: mode ? mode.mode : "Not selected yet", set: !!mode },
    { icon: "calendar", label: "Date", value: date ? fmtDate(date) : "Not selected yet", set: !!date },
    { icon: "clock", label: "Time", value: time ? `${time} PKT` : "Not selected yet", set: !!time },
    { icon: "money", label: "Fee", value: service ? service.fee : "—", set: !!service },
  ];

  // ---- calendar cells ----
  const cells = [];
  if (view) {
    const first = new Date(view.getFullYear(), view.getMonth(), 1);
    const days = new Date(view.getFullYear(), view.getMonth() + 1, 0).getDate();
    for (let p = 0; p < first.getDay(); p++) cells.push({ pad: true, key: `p${p}` });
    for (let i = 1; i <= days; i++) {
      const d = new Date(view.getFullYear(), view.getMonth(), i);
      cells.push({ key: `d${i}`, i, d, open: dayOpen(d), isToday: sameDay(d, today), isSel: sameDay(d, date) });
    }
  }
  const prevDisabled = monthOffset <= 0;

  // ---- available slots for the chosen date ----
  // Every day offers the same one-hour grid (11 am – 6 pm PKT); slots that are
  // already booked for this date are filtered out entirely, so only genuinely
  // free times are ever shown.
  const openSlots = date ? ALL_SLOTS.filter((t) => !isTaken(dateKey(date), t)) : [];

  const paneClass = (n) => `bpane${step === n ? " on" : ""}`;

  return (
    <section className="bwrap" ref={wrapRef}>
      <div className="wrap">
        <div style={{ textAlign: "center", marginBottom: "38px" }}>
          <Link href="/" aria-label="Dr. Fariha Ashraf — home">
            <Image
              src="/logo.png"
              alt="Dr. Fariha Ashraf — Homeopathic Physician"
              width={806}
              height={192}
              priority
              style={{ height: "54px", width: "auto", margin: "0 auto 22px", display: "block" }}
            />
          </Link>
          <div className="eyebrow" style={{ justifyContent: "center" }}>
            Book an appointment
          </div>
          <h1 className="d2">Reserve your consultation.</h1>
        </div>

        {/* step indicator */}
        <div className="steps">
          {STEPS.map((st, i) => (
            <Fragment key={st.s}>
              <div className={`stp${step === st.s && step < 5 ? " on" : ""}${st.s < step ? " done" : ""}`}>
                <div className="stp-n">{st.s}</div>
                <div className="stp-t">{st.t}</div>
              </div>
              {i < STEPS.length - 1 && <div className={`stp-bar${i < step - 1 ? " fill" : ""}`} />}
            </Fragment>
          ))}
        </div>

        <div className="bgrid">
          {/* left rail */}
          <aside className="brail">
            <div className="bdoc">
              <div className="av">FA</div>
              <div>
                <b>Dr. Fariha Ashraf</b>
                <span>DHMS · Homeopathy</span>
              </div>
            </div>
            <div className="bsum">
              {sum.map((s) => (
                <div className={`bsum-i${s.set ? " set" : ""}`} key={s.label}>
                  <div className="ic">
                    <Icon name={s.icon} size={15} />
                  </div>
                  <div>
                    <b>{s.label}</b>
                    <span>{s.value}</span>
                  </div>
                </div>
              ))}
            </div>
            <div className="bnote">
              All times shown in Pakistan Standard Time (PKT). You&rsquo;ll receive confirmation on
              WhatsApp and email once the booking is made.
            </div>
          </aside>

          {/* right panes */}
          <div className="bmain">
            {/* STEP 1 */}
            <div className={paneClass(1)}>
              <div className="bh">
                <h2 className="d3">Which consultation do you need?</h2>
                <p>Not sure? Choose the first visit — she&rsquo;ll redirect you if something else fits better.</p>
              </div>
              <div className="opts">
                {SERVICES.map((s) => (
                  <button
                    type="button"
                    className={`opt${service?.svc === s.svc ? " sel" : ""}`}
                    key={s.svc}
                    onClick={() => setService(s)}
                  >
                    <div className="opt-ic">
                      <Icon name={s.icon} size={22} strokeWidth={1.8} />
                    </div>
                    <div className="opt-b">
                      <b>{s.svc}</b>
                      <p>{s.desc}</p>
                    </div>
                    <div className="opt-m">
                      <b>{s.fee}</b>
                      {s.dur}
                    </div>
                    <div className="opt-chk">
                      <Icon name="check" size={12} strokeWidth={3.4} />
                    </div>
                  </button>
                ))}
              </div>

              <p className="slots-h" style={{ margin: "34px 0 15px" }}>
                How would you like to meet?
              </p>
              <div className="opts">
                {MODES.map((m) => (
                  <button
                    type="button"
                    className={`opt${mode?.mode === m.mode ? " sel" : ""}`}
                    key={m.mode}
                    onClick={() => setMode(m)}
                  >
                    <div className="opt-ic">
                      <Icon name={m.icon} size={22} strokeWidth={1.8} />
                    </div>
                    <div className="opt-b">
                      <b>{m.mode}</b>
                      <p>{m.desc}</p>
                    </div>
                    <div className="opt-chk">
                      <Icon name="check" size={12} strokeWidth={3.4} />
                    </div>
                  </button>
                ))}
              </div>

              <div className="bnav">
                <span />
                <button className="btn btn-p" disabled={!(service && mode)} onClick={() => goStep(2)}>
                  Choose a date
                  <Icon name="arrow" size={15} className="ar" />
                </button>
              </div>
            </div>

            {/* STEP 2 */}
            <div className={paneClass(2)}>
              <div className="bh">
                <h2 className="d3">Pick a date and time.</h2>
                <p>Highlighted days have slots open. The practice is closed on Sundays.</p>
              </div>
              <div className="calgrid">
                <div>
                  <div className="cal">
                    <div className="cal-top">
                      <b>{view ? `${MON[view.getMonth()]} ${view.getFullYear()}` : "—"}</b>
                      <div className="cal-nav">
                        <button
                          aria-label="Previous month"
                          disabled={prevDisabled}
                          onClick={() => setMonthOffset((o) => o - 1)}
                        >
                          <Icon name="chevronLeft" size={15} />
                        </button>
                        <button aria-label="Next month" onClick={() => setMonthOffset((o) => o + 1)}>
                          <Icon name="chevronRight" size={15} />
                        </button>
                      </div>
                    </div>
                    <div className="cal-dow">
                      {["Sun", "Mon", "Tue", "Wed", "Thu", "Fri", "Sat"].map((d) => (
                        <span key={d}>{d}</span>
                      ))}
                    </div>
                    <div className="cal-days">
                      {cells.map((c) =>
                        c.pad ? (
                          <div className="cday pad" key={c.key} />
                        ) : (
                          <button
                            type="button"
                            key={c.key}
                            className={`cday${c.open ? " free" : " off"}${c.isSel ? " sel" : ""}${c.isToday ? " today" : ""}`}
                            disabled={!c.open}
                            onClick={() => c.open && pickDate(c.d)}
                          >
                            {c.i}
                          </button>
                        )
                      )}
                    </div>
                    <div className="cal-key">
                      <span>
                        <i style={{ background: "var(--lapis-wash)" }} />
                        Slots open
                      </span>
                      <span>
                        <i style={{ background: "var(--ink)" }} />
                        Selected
                      </span>
                      <span>
                        <i style={{ background: "var(--porcelain-2)" }} />
                        Unavailable
                      </span>
                    </div>
                  </div>
                </div>
                <div>
                  <p className="slots-h">
                    {date ? `Times for ${date.getDate()} ${MON[date.getMonth()]}` : "Available times"}
                  </p>
                  {date ? (
                    openSlots.length ? (
                      <div className="slot-grp">
                        <div className="slots">
                          {openSlots.map((t) => (
                            <button
                              type="button"
                              key={t}
                              className={`slot${time === t ? " sel" : ""}`}
                              onClick={() => setTime(t)}
                            >
                              {t}
                            </button>
                          ))}
                        </div>
                      </div>
                    ) : (
                      <div className="slots-empty">
                        Every time on this day is already booked. Please choose another date.
                      </div>
                    )
                  ) : (
                    <div className="slots-empty">Select a date on the calendar to see open slots.</div>
                  )}
                  <div className="tz">
                    <Icon name="clock" size={14} />
                    Times shown in Pakistan Standard Time (PKT, GMT+5)
                  </div>
                </div>
              </div>
              <div className="bnav">
                <button className="btn btn-o" onClick={() => goStep(1)}>
                  <Icon name="arrowLeft" size={15} /> Back
                </button>
                <button className="btn btn-p" disabled={!time} onClick={() => goStep(3)}>
                  Continue to details
                  <Icon name="arrow" size={15} className="ar" />
                </button>
              </div>
            </div>

            {/* STEP 3 */}
            <div className={paneClass(3)}>
              <div className="bh">
                <h2 className="d3">Tell her about your case.</h2>
                <p>The more she knows before the call, the more of the appointment goes to you.</p>
              </div>
              <form noValidate onSubmit={(e) => e.preventDefault()}>
                <div className="frow">
                  <div className={`fld${perr.bname ? " err" : ""}`}>
                    <label>Full name <i>*</i></label>
                    <input type="text" value={patient.bname} onChange={updatePatient("bname")} placeholder="Your name" />
                    <div className="emsg">Please enter your name</div>
                  </div>
                  <div className={`fld${perr.bphone ? " err" : ""}`}>
                    <label>Phone / WhatsApp <i>*</i></label>
                    <input type="tel" value={patient.bphone} onChange={updatePatient("bphone")} placeholder="03XX XXXXXXX" />
                    <div className="emsg">Please enter a phone number</div>
                  </div>
                </div>
                <div className="frow">
                  <div className={`fld${perr.bemail ? " err" : ""}`}>
                    <label>Email <i>*</i></label>
                    <input type="email" value={patient.bemail} onChange={updatePatient("bemail")} placeholder="you@example.com" />
                    <div className="emsg">Please enter a valid email address</div>
                  </div>
                  <div className="fld">
                    <label>City</label>
                    <input type="text" value={patient.bcity} onChange={updatePatient("bcity")} placeholder="Lahore" />
                  </div>
                </div>
                <div className="frow">
                  <div className={`fld${perr.bage ? " err" : ""}`}>
                    <label>Age <i>*</i></label>
                    <input type="number" value={patient.bage} onChange={updatePatient("bage")} placeholder="e.g. 29" min="0" max="120" />
                    <div className="emsg">Please enter an age</div>
                  </div>
                  <div className="fld">
                    <label>Gender</label>
                    <select value={patient.bgender} onChange={updatePatient("bgender")}>
                      <option value="">Prefer not to say</option>
                      <option>Female</option>
                      <option>Male</option>
                      <option>Other</option>
                    </select>
                  </div>
                </div>
                <div className={`fld${perr.bcomplaint ? " err" : ""}`}>
                  <label>Main complaint <i>*</i></label>
                  <input type="text" value={patient.bcomplaint} onChange={updatePatient("bcomplaint")} placeholder="e.g. persistent acne along the jawline" />
                  <div className="emsg">Please describe the main complaint</div>
                </div>
                <div className="frow">
                  <div className="fld">
                    <label>How long have you had it?</label>
                    <select value={patient.bdur} onChange={updatePatient("bdur")}>
                      <option value="">Select</option>
                      <option>Less than a month</option>
                      <option>1–6 months</option>
                      <option>6–12 months</option>
                      <option>1–3 years</option>
                      <option>More than 3 years</option>
                    </select>
                  </div>
                  <div className="fld">
                    <label>Consulted anyone before?</label>
                    <select value={patient.bprev} onChange={updatePatient("bprev")}>
                      <option value="">Select</option>
                      <option>No, this is the first time</option>
                      <option>Yes, allopathic treatment</option>
                      <option>Yes, homeopathic treatment</option>
                      <option>Yes, both</option>
                    </select>
                  </div>
                </div>
                <div className="fld">
                  <label>Anything else she should know</label>
                  <textarea
                    value={patient.bnotes}
                    onChange={updatePatient("bnotes")}
                    placeholder="Current medicines, allergies, recent lab reports, or anything you'd like to mention"
                    style={{ minHeight: "110px" }}
                  />
                </div>
              </form>
              <div className="bnav">
                <button className="btn btn-o" onClick={() => goStep(2)}>
                  <Icon name="arrowLeft" size={15} /> Back
                </button>
                <button className="btn btn-p" onClick={submitDetails}>
                  Review booking
                  <Icon name="arrow" size={15} className="ar" />
                </button>
              </div>
            </div>

            {/* STEP 4 */}
            <div className={paneClass(4)}>
              <div className="bh">
                <h2 className="d3">Check everything over.</h2>
                <p>One last look before the appointment is reserved.</p>
              </div>
              <div className="rev-card">
                <div className="rev-hd">Appointment</div>
                <div className="rev-row"><b>Service</b><span>{service?.svc || "—"}</span></div>
                <div className="rev-row"><b>Format</b><span>{mode?.mode || "—"}</span></div>
                <div className="rev-row"><b>Date</b><span>{date ? fmtDate(date) : "—"}</span></div>
                <div className="rev-row"><b>Time</b><span>{time ? `${time} PKT` : "—"}</span></div>
                <div className="rev-row"><b>Duration</b><span>{service?.dur || "—"}</span></div>
                <div className="rev-row"><b>Fee</b><span>{service?.fee || "—"}</span></div>
              </div>
              <div className="rev-card">
                <div className="rev-hd">Patient</div>
                <div className="rev-row"><b>Name</b><span>{patient.bname || "—"}</span></div>
                <div className="rev-row"><b>Phone</b><span>{patient.bphone || "—"}</span></div>
                <div className="rev-row"><b>Email</b><span>{patient.bemail || "—"}</span></div>
                <div className="rev-row"><b>Age</b><span>{patient.bage ? `${patient.bage} years` : "—"}</span></div>
                <div className="rev-row"><b>Main complaint</b><span>{patient.bcomplaint || "—"}</span></div>
              </div>
              <label className="consent">
                <input type="checkbox" checked={consent} onChange={(e) => setConsent(e.target.checked)} />
                <span>
                  I understand this is homeopathic care offered alongside, not in place of, treatment
                  from my physician — and that I should not stop any prescribed medicine without
                  speaking to the doctor who prescribed it.
                </span>
              </label>
              {bookErr ? (
                <p role="alert" style={{ color: "#c2503f", fontSize: ".9rem", fontWeight: 500, margin: "0 0 4px" }}>
                  {bookErr}
                </p>
              ) : null}
              <div className="bnav">
                <button className="btn btn-o" onClick={() => goStep(3)} disabled={booking === "sending"}>
                  <Icon name="arrowLeft" size={15} /> Back
                </button>
                <button
                  className="btn btn-b"
                  disabled={!consent || booking === "sending"}
                  aria-busy={booking === "sending"}
                  onClick={confirm}
                >
                  {booking === "sending" ? "Reserving…" : "Confirm booking"}
                  {booking !== "sending" && <Icon name="check" size={15} className="ar" />}
                </button>
              </div>
            </div>

            {/* DONE */}
            <div className={paneClass(5)}>
              <div className="done">
                <div className="done-ic">
                  <Icon name="check" size={38} strokeWidth={2.2} />
                </div>
                <h2 className="d2" style={{ marginBottom: "14px" }}>
                  Your appointment is reserved.
                </h2>
                <p className="lede" style={{ maxWidth: "480px", margin: "0 auto 6px" }}>
                  {service && date && time
                    ? `${service.svc} with Dr. Fariha on ${fmtDate(date)} at ${time} PKT.`
                    : "—"}
                </p>
                <div className="ref">{ref || "—"}</div>
                <p className="muted" style={{ maxWidth: "480px", margin: "0 auto 32px", fontSize: ".94rem" }}>
                  A confirmation is on its way to{" "}
                  <strong>{patient.bemail || "your email"}</strong> with a calendar file you can add
                  so your phone reminds you. If anything changes, message the practice at least four
                  hours ahead.
                </p>
                <div className="cta-acts">
                  <Link href="/" className="btn btn-p">
                    Back to home
                  </Link>
                  <button className="btn btn-o" onClick={rebook}>
                    Book another appointment
                  </button>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
