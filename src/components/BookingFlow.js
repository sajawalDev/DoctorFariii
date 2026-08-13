"use client";

import { Fragment, useRef, useState } from "react";
import Link from "next/link";
import Icon from "./Icon";
import { useClientToday } from "@/lib/useClientToday";

const MON = ["January", "February", "March", "April", "May", "June", "July", "August", "September", "October", "November", "December"];
const DOW = ["Sunday", "Monday", "Tuesday", "Wednesday", "Thursday", "Friday", "Saturday"];
const SLOTS = {
  morning: ["11:00 am", "11:40 am", "12:20 pm", "1:00 pm"],
  evening: ["3:00 pm", "3:40 pm", "4:20 pm", "5:00 pm", "5:40 pm", "6:20 pm", "7:00 pm"],
};

const SERVICES = [
  { svc: "First consultation", fee: "PKR 2,000", dur: "40 min", icon: "case", desc: "Full case taking, written plan and remedy. For new patients." },
  { svc: "Follow-up review", fee: "PKR 1,000", dur: "20 min", icon: "refresh", desc: "For existing patients continuing an ongoing case." },
  { svc: "Case + diet plan", fee: "PKR 3,500", dur: "60 min", icon: "cutlery", desc: "Consultation with a four-week written nutrition plan alongside." },
];
const MODES = [
  { mode: "Video call", icon: "video", desc: "WhatsApp, Zoom or Google Meet — your choice." },
  { mode: "Audio call", icon: "phone", desc: "Voice only, if your connection is slow." },
  { mode: "In-clinic visit", icon: "pin", desc: "Shalimar Town, Lahore — by appointment." },
];

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
const taken = (dt, slot) => (dt.getDate() * 37 + dt.getMonth() * 11 + slot.length * 7 + slot.charCodeAt(0)) % 5 === 0;

export default function BookingFlow() {
  const wrapRef = useRef(null);
  const [step, setStep] = useState(1);
  const [service, setService] = useState(null); // one of SERVICES
  const [mode, setMode] = useState(null);
  const [date, setDate] = useState(null);
  const [time, setTime] = useState(null);
  const [patient, setPatient] = useState(PATIENT_INIT);
  const [perr, setPerr] = useState({});
  const [consent, setConsent] = useState(false);
  const [ref, setRef] = useState("");

  const today = useClientToday(); // start-of-day on client, null during SSR
  const [monthOffset, setMonthOffset] = useState(0);
  const view = today ? new Date(today.getFullYear(), today.getMonth() + monthOffset, 1) : null;

  const dayOpen = (d) => {
    if (!today || d < today) return false;
    if (d.getDay() === 0) return false; // Sunday closed
    const limit = new Date(today);
    limit.setDate(limit.getDate() + 60);
    return d <= limit;
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

  const confirm = () => {
    const yy = String(date.getFullYear()).slice(2);
    const mm = String(date.getMonth() + 1).padStart(2, "0");
    const dd = String(date.getDate()).padStart(2, "0");
    setRef(`FA-${yy}${mm}${dd}-${Math.floor(1000 + Math.random() * 9000)}`);
    goStep(5);
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

  // ---- slot groups for chosen date ----
  let slotGroups = [];
  if (date) {
    const sat = date.getDay() === 6;
    slotGroups = [["Morning", SLOTS.morning]];
    slotGroups.push(sat ? ["Afternoon", SLOTS.evening.slice(0, 3)] : ["Evening", SLOTS.evening]);
  }

  const paneClass = (n) => `bpane${step === n ? " on" : ""}`;

  return (
    <section className="bwrap" ref={wrapRef}>
      <div className="wrap">
        <div style={{ textAlign: "center", marginBottom: "38px" }}>
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
                <p>Highlighted days have slots open. The clinic is closed on Sundays.</p>
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
                    slotGroups.map(([label, list]) => (
                      <div className="slot-grp" key={label}>
                        <div className="slot-lb">{label}</div>
                        <div className="slots">
                          {list.map((t) => {
                            const busy = taken(date, t);
                            return (
                              <button
                                type="button"
                                key={t}
                                className={`slot${time === t ? " sel" : ""}`}
                                disabled={busy}
                                onClick={() => setTime(t)}
                              >
                                {t}
                              </button>
                            );
                          })}
                        </div>
                      </div>
                    ))
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
              <div className="bnav">
                <button className="btn btn-o" onClick={() => goStep(3)}>
                  <Icon name="arrowLeft" size={15} /> Back
                </button>
                <button className="btn btn-b" disabled={!consent} onClick={confirm}>
                  Confirm booking
                  <Icon name="check" size={15} className="ar" />
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
                  A confirmation with the meeting link is on its way to your WhatsApp and email. If
                  anything changes, message the clinic at least four hours ahead.
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
