// Branded HTML email templates for the contact form.
// Two emails are produced from every submission:
//   - notifyClinic(): lands in the clinic inbox (SMTP_USER) with the details.
//   - confirmUser():  a thank-you receipt to the visitor who wrote in.
// Both share one shell — centered logo header, clean body, copyright footer.

import { SITE_URL, clinic } from "@/lib/site";

const TEAL = "#07828C";
const INK = "#1f2a2c";
const MUTED = "#5c6b6d";
const LINE = "#e4ebeb";
const BG = "#f4f7f7";
const YEAR = 2026;

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
  const logo = `${SITE_URL}/logo.png`;
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
