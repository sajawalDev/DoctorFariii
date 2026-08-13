"use client";

import { useState } from "react";
import Link from "next/link";
import Icon from "./Icon";

// Client-side validators mirror the server rules in /api/contact.
// The server re-validates everything — this is only for fast feedback.
const validators = {
  name: (v) => v.trim().length > 1,
  phone: (v) => v.replace(/\D/g, "").length >= 10,
  email: (v) => /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(v),
  topic: (v) => v.trim().length > 0,
  message: (v) => v.trim().length > 4,
};

const topics = [
  "General question",
  "About a remedy I've received",
  "Courier or delivery",
  "Rescheduling an appointment",
  "Something else",
];

export default function ContactForm() {
  const [values, setValues] = useState({ name: "", phone: "", email: "", topic: topics[0], message: "" });
  const [errors, setErrors] = useState({});
  const [status, setStatus] = useState("idle"); // idle | sending | sent | error
  const [formError, setFormError] = useState("");

  const update = (name) => (e) => {
    setValues((v) => ({ ...v, [name]: e.target.value }));
    setErrors((er) => ({ ...er, [name]: false }));
    if (formError) setFormError("");
  };

  const onSubmit = async (e) => {
    e.preventDefault();
    if (status === "sending") return;

    const next = {};
    Object.keys(validators).forEach((k) => {
      if (!validators[k](values[k])) next[k] = true;
    });
    setErrors(next);
    if (Object.keys(next).length > 0) return;

    setStatus("sending");
    setFormError("");

    try {
      const res = await fetch("/api/contact", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(values),
      });

      if (res.ok) {
        setStatus("sent");
        return;
      }

      // Surface field errors the server flagged, if any.
      const data = await res.json().catch(() => ({}));
      if (data?.errors && typeof data.errors === "object") {
        const serverErrors = {};
        Object.keys(data.errors).forEach((k) => (serverErrors[k] = true));
        setErrors(serverErrors);
      }
      setFormError(data?.error || "Something went wrong. Please try again.");
      setStatus("error");
    } catch {
      setFormError("Couldn't reach the server. Please check your connection and try again.");
      setStatus("error");
    }
  };

  if (status === "sent") {
    return (
      <div className="formcard">
        <div style={{ textAlign: "center", padding: "26px 0" }}>
          <div className="done-ic" style={{ width: "70px", height: "70px" }}>
            <Icon name="check" size={30} strokeWidth={2.4} />
          </div>
          <h3 className="d3" style={{ marginBottom: "10px" }}>
            Message sent
          </h3>
          <p className="muted" style={{ margin: 0 }}>
            Thanks for reaching out — a confirmation is on its way to your inbox and the clinic
            replies within one working day. For anything urgent, call or WhatsApp instead.
          </p>
        </div>
      </div>
    );
  }

  const field = (name) => `fld${errors[name] ? " err" : ""}`;
  const sending = status === "sending";

  return (
    <div className="formcard">
      <div className="eyebrow">Send a message</div>
      <h2 className="d3" style={{ marginBottom: "10px" }}>
        Write to the clinic.
      </h2>
      <p className="muted" style={{ fontSize: ".94rem", margin: "0 0 30px" }}>
        Please don&rsquo;t include detailed medical history here — that&rsquo;s what the consultation
        form is for.
      </p>

      <form onSubmit={onSubmit} noValidate>
        <div className="frow">
          <div className={field("name")}>
            <label>
              Full name <i>*</i>
            </label>
            <input type="text" value={values.name} onChange={update("name")} placeholder="Your name" required />
            <div className="emsg">Please enter your name</div>
          </div>
          <div className={field("phone")}>
            <label>
              Phone <i>*</i>
            </label>
            <input type="tel" value={values.phone} onChange={update("phone")} placeholder="03XX XXXXXXX" required />
            <div className="emsg">Please enter a phone number</div>
          </div>
        </div>
        <div className={field("email")}>
          <label>
            Email <i>*</i>
          </label>
          <input type="email" value={values.email} onChange={update("email")} placeholder="you@example.com" required />
          <div className="emsg">Please enter a valid email address</div>
        </div>
        <div className={field("topic")}>
          <label>
            What is this about? <i>*</i>
          </label>
          <select value={values.topic} onChange={update("topic")} required>
            {topics.map((t) => (
              <option key={t}>{t}</option>
            ))}
          </select>
          <div className="emsg">Please choose a topic</div>
        </div>
        <div className={field("message")}>
          <label>
            Message <i>*</i>
          </label>
          <textarea value={values.message} onChange={update("message")} placeholder="How can the clinic help?" required />
          <div className="emsg">Please write a short message</div>
        </div>

        {formError ? (
          <p
            role="alert"
            style={{ color: "#c2503f", fontSize: ".88rem", fontWeight: 500, margin: "0 0 16px" }}
          >
            {formError}
          </p>
        ) : null}

        <button type="submit" className="btn btn-p" style={{ width: "100%" }} disabled={sending} aria-busy={sending}>
          {sending ? "Sending…" : "Send message"}
          {!sending && <Icon name="arrow" size={15} className="ar" />}
        </button>
        <p className="muted" style={{ fontSize: ".82rem", textAlign: "center", margin: "18px 0 0" }}>
          Prefer to book straight away?{" "}
          <Link href="/book" style={{ color: "var(--lapis)", fontWeight: 600 }}>
            Open the booking page
          </Link>
          .
        </p>
      </form>
    </div>
  );
}
