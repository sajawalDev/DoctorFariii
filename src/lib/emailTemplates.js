// Branded HTML email templates for the contact form.
// Two emails are produced from every submission:
//   - notifyClinic(): lands in the clinic inbox (SMTP_USER) with the details.
//   - confirmUser():  a thank-you receipt to the visitor who wrote in.
// Both share one shell — centered logo header, clean body, copyright footer.

import { readFileSync } from "node:fs";
import { SITE_URL, clinic } from "@/lib/site";

const TEAL = "#07828C";
const INK = "#1f2a2c";
const MUTED = "#5c6b6d";
const LINE = "#e4ebeb";
const BG = "#f4f7f7";
const YEAR = 2026;

// Content-ID used to reference the inline logo attachment from the HTML.
const LOGO_CID = "brand-logo";

// Read the logo file once and keep it in module memory. Referencing it with
// `new URL(..., import.meta.url)` lets Next trace and bundle the asset into the
// serverless function, so `readFileSync` finds it at runtime on Vercel too.
let _logoBuffer;
function logoBuffer() {
  if (_logoBuffer === undefined) {
    try {
      _logoBuffer = readFileSync(new URL("../../public/logo.png", import.meta.url));
    } catch {
      _logoBuffer = null; // fall back to the hosted URL if it can't be read
    }
  }
  return _logoBuffer;
}

// The attachment routes hand to nodemailer so the inline logo resolves.
// Returns null when the file is unreadable — the shell then uses the hosted URL.
export function logoAttachment() {
  const buf = logoBuffer();
  return buf
    ? { filename: "logo.png", content: buf, cid: LOGO_CID, contentType: "image/png" }
    : null;
}

// Escape user-supplied text before it ever touches an HTML string.
export function escapeHtml(value) {
  return String(value ?? "")
    .replace(/&/g, "&amp;")
    .replace(/</g, "&lt;")
    .replace(/>/g, "&gt;")
    .replace(/"/g, "&quot;")
    .replace(/'/g, "&#39;");
}

// Keep multi-line messages readable in HTML by turning newlines into <br>.
function nl2br(value) {
  return escapeHtml(value).replace(/\r?\n/g, "<br>");
}

// Wraps body content in the shared, email-client-safe table shell.
function shell({ preheader, body }) {
  // Prefer the inline (CID) logo — remote <img> is blocked by default in many
  // email clients, which is why the logo wasn't rendering. Fall back to the
  // hosted URL only if the file couldn't be read at runtime.
  const logo = logoBuffer() ? `cid:${LOGO_CID}` : `${SITE_URL}/logo.png`;
  return `<!doctype html>
<html lang="en">
<head>
<meta charset="utf-8">
<meta name="viewport" content="width=device-width, initial-scale=1">
<meta name="color-scheme" content="light only">
</head>
<body style="margin:0;padding:0;background:${BG};">
<span style="display:none!important;opacity:0;color:transparent;visibility:hidden;height:0;width:0;overflow:hidden;mso-hide:all;">${escapeHtml(
    preheader
  )}</span>
<table role="presentation" width="100%" cellpadding="0" cellspacing="0" border="0" style="background:${BG};">
<tr>
<td align="center" style="padding:32px 16px;">
<table role="presentation" width="600" cellpadding="0" cellspacing="0" border="0" style="width:600px;max-width:100%;background:#ffffff;border:1px solid ${LINE};border-radius:16px;overflow:hidden;font-family:'Segoe UI',Helvetica,Arial,sans-serif;">
<tr>
<td align="center" style="padding:30px 24px 22px;border-bottom:1px solid ${LINE};background:#ffffff;">
<img src="${logo}" alt="${escapeHtml(
    clinic.name
  )}" width="210" style="display:block;width:210px;max-width:70%;height:auto;margin:0 auto;">
</td>
</tr>
<tr>
<td style="padding:34px 36px 30px;color:${INK};font-size:15px;line-height:1.65;">
${body}
</td>
</tr>
<tr>
<td style="padding:22px 36px 30px;border-top:1px solid ${LINE};background:#fafcfc;text-align:center;">
<p style="margin:0 0 4px;color:${MUTED};font-size:12px;line-height:1.6;font-family:'Segoe UI',Helvetica,Arial,sans-serif;">
&copy; ${YEAR} Dr. Fariha Ashraf &middot; All rights reserved.
</p>
<p style="margin:0;color:${MUTED};font-size:12px;line-height:1.6;font-family:'Segoe UI',Helvetica,Arial,sans-serif;">
Online homeopathic consultations &middot; Pakistan-wide
</p>
</td>
</tr>
</table>
</td>
</tr>
</table>
</body>
</html>`;
}

// A labelled detail row used in the clinic-facing notification.
function detailRow(label, value, { multiline = false } = {}) {
  const rendered = multiline ? nl2br(value) : escapeHtml(value);
  return `<tr>
<td style="padding:10px 0;border-bottom:1px solid ${LINE};vertical-align:top;">
<div style="color:${MUTED};font-size:11px;letter-spacing:.08em;text-transform:uppercase;font-weight:600;margin-bottom:3px;">${escapeHtml(
    label
  )}</div>
<div style="color:${INK};font-size:15px;line-height:1.6;">${rendered}</div>
</td>
</tr>`;
}

// Notification sent to the clinic inbox (SMTP_USER).
export function notifyClinic(data) {
  const heading = "New message from the website";
  const body = `
<h1 style="margin:0 0 6px;color:${INK};font-size:21px;font-weight:700;">${escapeHtml(
    heading
  )}</h1>
<p style="margin:0 0 22px;color:${MUTED};font-size:14px;line-height:1.6;">
Someone reached out through the contact form on your website. Their details are below — just reply to this email to respond to them directly.
</p>
<table role="presentation" width="100%" cellpadding="0" cellspacing="0" border="0" style="border-top:1px solid ${LINE};">
${detailRow("Full name", data.name)}
${detailRow("Email", data.email)}
${detailRow("Phone", data.phone)}
${detailRow("Topic", data.topic)}
${detailRow("Message", data.message, { multiline: true })}
</table>
<p style="margin:22px 0 0;color:${MUTED};font-size:12px;line-height:1.6;">
Sent automatically from the contact form at ${escapeHtml(SITE_URL)}.
</p>`;

  return {
    subject: `New contact message from ${data.name}`,
    html: shell({
      preheader: `${data.name} sent a message about "${data.topic}".`,
      body,
    }),
    text: [
      heading,
      "",
      `Full name: ${data.name}`,
      `Email: ${data.email}`,
      `Phone: ${data.phone}`,
      `Topic: ${data.topic}`,
      "",
      "Message:",
      data.message,
      "",
      `Sent from the contact form at ${SITE_URL}.`,
    ].join("\n"),
  };
}

// Confirmation receipt sent to the visitor who submitted the form.
export function confirmUser(data) {
  const heading = "Thanks for reaching out";
  const body = `
<h1 style="margin:0 0 6px;color:${INK};font-size:21px;font-weight:700;">${escapeHtml(
    heading
  )}</h1>
<p style="margin:0 0 16px;color:${INK};font-size:15px;line-height:1.65;">
Hi ${escapeHtml(data.name)},
</p>
<p style="margin:0 0 16px;color:${INK};font-size:15px;line-height:1.65;">
Thank you for contacting the practice of Dr.&nbsp;Fariha&nbsp;Ashraf. Your message has been received, and you can expect a reply <strong style="color:${TEAL};">within one working day</strong>.
</p>
<p style="margin:0 0 12px;color:${MUTED};font-size:13px;line-height:1.6;">
Here&rsquo;s a copy of what you sent:
</p>
<table role="presentation" width="100%" cellpadding="0" cellspacing="0" border="0" style="background:#fafcfc;border:1px solid ${LINE};border-radius:10px;">
<tr><td style="padding:16px 18px;">
<div style="color:${MUTED};font-size:11px;letter-spacing:.08em;text-transform:uppercase;font-weight:600;margin-bottom:4px;">Topic</div>
<div style="color:${INK};font-size:15px;line-height:1.6;margin-bottom:14px;">${escapeHtml(
    data.topic
  )}</div>
<div style="color:${MUTED};font-size:11px;letter-spacing:.08em;text-transform:uppercase;font-weight:600;margin-bottom:4px;">Message</div>
<div style="color:${INK};font-size:15px;line-height:1.6;">${nl2br(data.message)}</div>
</td></tr>
</table>
<p style="margin:22px 0 4px;color:${INK};font-size:15px;line-height:1.65;">
If anything is urgent, you can call or WhatsApp directly:
</p>
<p style="margin:0 0 22px;">
<a href="tel:${escapeHtml(clinic.phoneHref)}" style="color:${TEAL};font-weight:600;text-decoration:none;font-size:15px;">${escapeHtml(
    clinic.phoneDisplay
  )}</a>
</p>
<p style="margin:0;color:${MUTED};font-size:14px;line-height:1.65;">
Warm regards,<br>
<strong style="color:${INK};">The practice of Dr.&nbsp;Fariha&nbsp;Ashraf</strong><br>
Homeopathic Physician &middot; Online consultations
</p>`;

  return {
    subject: "We received your message — Dr. Fariha Ashraf",
    html: shell({
      preheader: "Thanks for contacting Dr. Fariha Ashraf. We'll reply within one working day.",
      body,
    }),
    text: [
      `Hi ${data.name},`,
      "",
      "Thank you for contacting the practice of Dr. Fariha Ashraf. Your message has been received, and you can expect a reply within one working day.",
      "",
      "Here's a copy of what you sent:",
      `Topic: ${data.topic}`,
      `Message: ${data.message}`,
      "",
      `If anything is urgent, call or WhatsApp: ${clinic.phoneDisplay}`,
      "",
      "Warm regards,",
      "The practice of Dr. Fariha Ashraf",
      "Homeopathic Physician · Online consultations",
    ].join("\n"),
  };
}

// An email-safe, centered "Add to calendar" button. Uses a bordered table cell
// (not a background image) so it renders in every major client.
function calButton(url, label) {
  return `<table role="presentation" cellpadding="0" cellspacing="0" border="0" style="margin:6px auto 0;">
<tr><td align="center" bgcolor="${TEAL}" style="border-radius:11px;">
<a href="${escapeHtml(url)}" target="_blank" style="display:inline-block;padding:14px 30px;font-family:'Segoe UI',Helvetica,Arial,sans-serif;font-size:15px;font-weight:700;color:#ffffff;text-decoration:none;border-radius:11px;">
${escapeHtml(label)} &nbsp;&rarr;
</a>
</td></tr>
</table>`;
}

// Notification to the clinic inbox (SMTP_USER) for a NEW booking — full clean
// details, a one-tap "Add to my calendar" button, and the .ics is attached.
export function bookingClinic(b) {
  const heading = "New consultation booked";
  const body = `
<h1 style="margin:0 0 6px;color:${INK};font-size:21px;font-weight:700;">${escapeHtml(heading)}</h1>
<p style="margin:0 0 18px;color:${MUTED};font-size:14px;line-height:1.6;">
A patient just reserved a consultation on your website. Everything is below, and the appointment is attached as a calendar file (<strong>consultation.ics</strong>) — open it to drop it into your calendar. Reply to this email to reach the patient directly.
</p>
<div style="background:${TEAL};color:#fff;border-radius:12px;padding:16px 20px;margin:0 0 22px;">
<div style="font-size:11px;letter-spacing:.1em;text-transform:uppercase;opacity:.85;margin-bottom:4px;">Reference</div>
<div style="font-size:20px;font-weight:700;letter-spacing:.04em;">${escapeHtml(b.ref)}</div>
</div>
<table role="presentation" width="100%" cellpadding="0" cellspacing="0" border="0" style="border-top:1px solid ${LINE};">
${detailRow("Service", b.serviceName)}
${detailRow("Format", b.modeName)}
${detailRow("Date", b.dateHuman)}
${detailRow("Time", `${b.time} · ${b.tzLabel}`)}
${detailRow("Duration", b.dur)}
${detailRow("Fee", b.fee)}
</table>
<h2 style="margin:26px 0 4px;color:${INK};font-size:15px;font-weight:700;">Patient</h2>
<table role="presentation" width="100%" cellpadding="0" cellspacing="0" border="0" style="border-top:1px solid ${LINE};">
${detailRow("Name", b.name)}
${detailRow("Phone / WhatsApp", b.phone)}
${detailRow("Email", b.email)}
${detailRow("City", b.city || "—")}
${detailRow("Age", b.age ? `${b.age} years` : "—")}
${detailRow("Gender", b.gender || "—")}
${detailRow("Main complaint", b.complaint, { multiline: true })}
${detailRow("Duration of complaint", b.duration || "—")}
${detailRow("Consulted before", b.prev || "—")}
${detailRow("Other notes", b.notes || "—", { multiline: true })}
</table>
<p style="margin:26px 0 12px;color:${INK};font-size:15px;line-height:1.6;text-align:center;font-weight:600;">
Add this consultation to your calendar so it reminds you as the time nears:
</p>
${calButton(b.gcalUrl, "Add to my calendar")}
<p style="margin:22px 0 0;color:${MUTED};font-size:12px;line-height:1.6;text-align:center;">
Sent automatically from the booking page at ${escapeHtml(SITE_URL)}.
</p>`;

  return {
    subject: `New booking — ${b.name}, ${b.dateHuman} at ${b.time}`,
    html: shell({ preheader: `${b.serviceName} · ${b.dateHuman} at ${b.time} (${b.ref})`, body }),
    text: [
      heading,
      `Reference: ${b.ref}`,
      "",
      `Service: ${b.serviceName}`,
      `Format: ${b.modeName}`,
      `Date: ${b.dateHuman}`,
      `Time: ${b.time} (${b.tzLabel})`,
      `Duration: ${b.dur}`,
      `Fee: ${b.fee}`,
      "",
      "PATIENT",
      `Name: ${b.name}`,
      `Phone: ${b.phone}`,
      `Email: ${b.email}`,
      `City: ${b.city || "—"}`,
      `Age: ${b.age || "—"}`,
      `Gender: ${b.gender || "—"}`,
      `Main complaint: ${b.complaint}`,
      `Duration of complaint: ${b.duration || "—"}`,
      `Consulted before: ${b.prev || "—"}`,
      `Other notes: ${b.notes || "—"}`,
      "",
      `Add to your calendar: ${b.gcalUrl}`,
      "(The appointment is also attached as consultation.ics.)",
    ].join("\n"),
  };
}

// Confirmation to the patient — friendly, with the same "Add to calendar"
// button so their own calendar reminds them, plus the attached .ics.
export function bookingPatient(b) {
  const heading = "Your consultation is confirmed";
  const body = `
<h1 style="margin:0 0 6px;color:${INK};font-size:21px;font-weight:700;">${escapeHtml(heading)}</h1>
<p style="margin:0 0 16px;color:${INK};font-size:15px;line-height:1.65;">Hi ${escapeHtml(b.name)},</p>
<p style="margin:0 0 20px;color:${INK};font-size:15px;line-height:1.65;">
Your appointment with <strong>Dr.&nbsp;Fariha&nbsp;Ashraf</strong> is reserved. Here are the details — we&rsquo;ve also attached a calendar file (<strong>consultation.ics</strong>) you can add so your phone reminds you beforehand.
</p>
<table role="presentation" width="100%" cellpadding="0" cellspacing="0" border="0" style="background:#fafcfc;border:1px solid ${LINE};border-radius:12px;">
<tr><td style="padding:20px 22px;">
${miniRow("Reference", b.ref)}
${miniRow("Service", b.serviceName)}
${miniRow("Format", b.modeName)}
${miniRow("Date", b.dateHuman)}
${miniRow("Time", `${b.time} · ${b.tzLabel}`)}
${miniRow("Fee", b.fee, true)}
</td></tr>
</table>
<p style="margin:24px 0 12px;color:${INK};font-size:15px;line-height:1.6;text-align:center;font-weight:600;">
Add it to your calendar so you don&rsquo;t miss it:
</p>
${calButton(b.gcalUrl, "Add to my calendar")}
<p style="margin:24px 0 4px;color:${INK};font-size:15px;line-height:1.65;">
If you need to reschedule, please message the practice at least four hours ahead:
</p>
<p style="margin:0 0 22px;">
<a href="tel:${escapeHtml(clinic.phoneHref)}" style="color:${TEAL};font-weight:600;text-decoration:none;font-size:15px;">${escapeHtml(clinic.phoneDisplay)}</a>
</p>
<p style="margin:0;color:${MUTED};font-size:14px;line-height:1.65;">
Warm regards,<br>
<strong style="color:${INK};">The practice of Dr.&nbsp;Fariha&nbsp;Ashraf</strong><br>
Homeopathic Physician &middot; Online consultations
</p>`;

  return {
    subject: `Consultation confirmed — ${b.dateHuman} at ${b.time}`,
    html: shell({ preheader: `You're booked for ${b.dateHuman} at ${b.time}. Reference ${b.ref}.`, body }),
    text: [
      `Hi ${b.name},`,
      "",
      "Your consultation with Dr. Fariha Ashraf is confirmed.",
      "",
      `Reference: ${b.ref}`,
      `Service: ${b.serviceName}`,
      `Format: ${b.modeName}`,
      `Date: ${b.dateHuman}`,
      `Time: ${b.time} (${b.tzLabel})`,
      `Fee: ${b.fee}`,
      "",
      `Add it to your calendar: ${b.gcalUrl}`,
      "(The appointment is also attached as consultation.ics.)",
      "",
      `To reschedule, message the practice at least four hours ahead: ${clinic.phoneDisplay}`,
      "",
      "Warm regards,",
      "The practice of Dr. Fariha Ashraf",
      "Homeopathic Physician · Online consultations",
    ].join("\n"),
  };
}

// Compact label/value row for the patient's summary card.
function miniRow(label, value, last = false) {
  return `<div style="display:flex;justify-content:space-between;gap:16px;padding:9px 0;${
    last ? "" : `border-bottom:1px solid ${LINE};`
  }">
<span style="color:${MUTED};font-size:13px;">${escapeHtml(label)}</span>
<span style="color:${INK};font-size:14px;font-weight:600;text-align:right;">${escapeHtml(value)}</span>
</div>`;
}
