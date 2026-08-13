import { NextResponse } from "next/server";
import nodemailer from "nodemailer";
import { clinic } from "@/lib/site";
import { notifyClinic, confirmUser } from "@/lib/emailTemplates";

// This route sends real email, so it must run on the Node.js runtime
// (nodemailer relies on Node's net/tls stack, not the edge runtime).
export const runtime = "nodejs";
export const dynamic = "force-dynamic";

const EMAIL_RE = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
const TOPICS = [
  "General question",
  "About a remedy I've received",
  "Courier or delivery",
  "Rescheduling an appointment",
  "Something else",
];

// Normalise line endings, collapse runs of spaces/tabs and blank lines, then
// trim and cap length. Everything that reaches the templates is HTML-escaped
// again there — this is defence in depth for the body text.
function clean(value, max) {
  return String(value ?? "")
    .replace(/\r\n?/g, "\n")
    .replace(/[^\S\n]+/g, " ")
    .replace(/\n{3,}/g, "\n\n")
    .trim()
    .slice(0, max);
}

// Single-line variant for fields that end up in email headers (name, address,
// subject). Flattening newlines here blocks header-injection attempts.
function cleanLine(value, max) {
  return clean(value, max).replace(/\n+/g, " ").trim();
}

// Server-side validation — the source of truth, independent of the client.
// Every field is required; returns { data } on success or { errors } on failure.
function validate(raw) {
  const name = cleanLine(raw.name, 120);
  const phone = cleanLine(raw.phone, 40);
  const email = cleanLine(raw.email, 200);
  const topic = cleanLine(raw.topic, 120);
  const message = clean(raw.message, 5000);

  const errors = {};
  if (name.length < 2) errors.name = "Please enter your name.";
  if (phone.replace(/\D/g, "").length < 10) errors.phone = "Please enter a valid phone number.";
  if (!EMAIL_RE.test(email)) errors.email = "Please enter a valid email address.";
  if (!TOPICS.includes(topic)) errors.topic = "Please choose a topic.";
  if (message.length < 5) errors.message = "Please write a short message.";

  if (Object.keys(errors).length) return { errors };
  return { data: { name, phone, email, topic, message } };
}

export async function POST(request) {
  let raw;
  try {
    raw = await request.json();
  } catch {
    return NextResponse.json({ error: "Invalid request." }, { status: 400 });
  }

  const { data, errors } = validate(raw ?? {});
  if (errors) {
    return NextResponse.json({ error: "Please check the form.", errors }, { status: 422 });
  }

  const user = process.env.SMTP_USER;
  const pass = process.env.SMTP_PASS;
  if (!user || !pass) {
    console.error("Contact form: SMTP_USER / SMTP_PASS are not configured.");
    return NextResponse.json(
      { error: "The contact form isn't available right now. Please call or WhatsApp instead." },
      { status: 503 }
    );
  }

  const transporter = nodemailer.createTransport({
    host: "smtp.gmail.com",
    port: 465,
    secure: true,
    auth: { user, pass },
  });

  const from = `${clinic.name} <${user}>`;
  const clinicMail = notifyClinic(data);
  const userMail = confirmUser(data);

  try {
    // 1) Notify the clinic inbox — replying to it answers the visitor directly.
    await transporter.sendMail({
      from,
      to: user,
      replyTo: `${data.name} <${data.email}>`,
      subject: clinicMail.subject,
      html: clinicMail.html,
      text: clinicMail.text,
    });

    // 2) Send the visitor their confirmation receipt.
    await transporter.sendMail({
      from,
      to: data.email,
      replyTo: user,
      subject: userMail.subject,
      html: userMail.html,
      text: userMail.text,
    });
  } catch (err) {
    console.error("Contact form: failed to send email —", err);
    return NextResponse.json(
      { error: "Something went wrong sending your message. Please try again or call instead." },
      { status: 502 }
    );
  }

  return NextResponse.json({ ok: true });
}
