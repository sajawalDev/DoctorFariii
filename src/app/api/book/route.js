import { NextResponse } from "next/server";
import nodemailer from "nodemailer";
import { clinic, SITE_URL } from "@/lib/site";
import { findMode, findService } from "@/lib/consultation";
import { CLOSED_DOW, isValidSlot, parseDateKey, slotToHour24, TIMEZONE_LABEL } from "@/lib/slots";
import { bookingClinic, bookingPatient } from "@/lib/emailTemplates";
import { buildIcs, googleCalendarUrl, pktToUtc } from "@/lib/ics";

// Sends real email + builds calendar files, so it must run on Node (nodemailer
// needs Node's net/tls stack, not the edge runtime).
export const runtime = "nodejs";
export const dynamic = "force-dynamic";

const EMAIL_RE = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
const DOW = ["Sunday", "Monday", "Tuesday", "Wednesday", "Thursday", "Friday", "Saturday"];
const MON = ["January", "February", "March", "April", "May", "June", "July", "August", "September", "October", "November", "December"];
const BOOKING_HORIZON_DAYS = 60;

// Same cleaners as the contact route: normalise, collapse whitespace, cap length.
// `clean` keeps newlines (message bodies); `cleanLine` flattens them (header-safe).
function clean(value, max) {
  return String(value ?? "")
    .replace(/\r\n?/g, "\n")
    .replace(/[^\S\n]+/g, " ")
    .replace(/\n{3,}/g, "\n\n")
    .trim()
    .slice(0, max);
}
function cleanLine(value, max) {
  return clean(value, max).replace(/\n+/g, " ").trim();
}

// Local start-of-day, mirrors useClientToday on the server for range checks.
function startOfToday() {
  const n = new Date();
  return new Date(n.getFullYear(), n.getMonth(), n.getDate());
}

// Full server-side validation — the source of truth, independent of the client.
function validate(raw) {
  const errors = {};

  const service = findService(cleanLine(raw?.service, 80));
  if (!service) errors.service = "Please choose a service.";

  const mode = findMode(cleanLine(raw?.mode, 80));
  if (!mode) errors.mode = "Please choose a meeting format.";

  const time = cleanLine(raw?.time, 20);
  if (!isValidSlot(time)) errors.time = "Please choose a valid time.";

  const dateKeyStr = cleanLine(raw?.dateKey, 10);
  const parts = parseDateKey(dateKeyStr);
  let day = null;
  if (!parts) {
    errors.date = "Please choose a valid date.";
  } else {
    day = new Date(parts.year, parts.month - 1, parts.day);
    const today = startOfToday();
    const horizon = new Date(today);
    horizon.setDate(horizon.getDate() + BOOKING_HORIZON_DAYS);
    if (day < today) errors.date = "That date is in the past.";
    else if (day.getDay() === CLOSED_DOW) errors.date = "The clinic is closed on Sundays.";
    else if (day > horizon) errors.date = "That date is too far ahead.";
  }

  const p = raw?.patient ?? {};
  const name = cleanLine(p.bname, 120);
  const phone = cleanLine(p.bphone, 40);
  const email = cleanLine(p.bemail, 200);
  const city = cleanLine(p.bcity, 80);
  const age = cleanLine(p.bage, 4);
  const gender = cleanLine(p.bgender, 30);
  const complaint = clean(p.bcomplaint, 600);
  const duration = cleanLine(p.bdur, 60);
  const prev = cleanLine(p.bprev, 60);
  const notes = clean(p.bnotes, 2000);

  if (name.length < 2) errors.bname = "Please enter your name.";
  if (phone.replace(/\D/g, "").length < 10) errors.bphone = "Please enter a valid phone number.";
  if (!EMAIL_RE.test(email)) errors.bemail = "Please enter a valid email address.";
  if (!(Number(age) > 0 && Number(age) < 121)) errors.bage = "Please enter a valid age.";
  if (complaint.length < 3) errors.bcomplaint = "Please describe the main complaint.";

  if (Object.keys(errors).length) return { errors };

  const dateHuman = `${DOW[day.getDay()]}, ${day.getDate()} ${MON[day.getMonth()]} ${day.getFullYear()}`;

  return {
    data: {
      service,
      mode,
      time,
      parts,
      dateHuman,
      patient: { name, phone, email, city, age, gender, complaint, duration, prev, notes },
    },
  };
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
    return NextResponse.json({ error: "Please check the booking details.", errors }, { status: 422 });
  }

  const user = process.env.SMTP_USER;
  const pass = process.env.SMTP_PASS;
  if (!user || !pass) {
    console.error("Booking: SMTP_USER / SMTP_PASS are not configured.");
    return NextResponse.json(
      { error: "Booking isn't available right now. Please call or WhatsApp to reserve instead." },
      { status: 503 }
    );
  }

  const { service, mode, time, parts, dateHuman, patient } = data;

  // Human-readable booking reference: FA-YYMMDD-NNNN.
  const yy = String(parts.year).slice(2);
  const mm = String(parts.month).padStart(2, "0");
  const dd = String(parts.day).padStart(2, "0");
  const ref = `FA-${yy}${mm}${dd}-${Math.floor(1000 + Math.random() * 9000)}`;

  // Resolve the PKT wall-clock time to a real UTC instant for the calendar event.
  const hour24 = slotToHour24(time);
  const start = pktToUtc({ year: parts.year, month: parts.month, day: parts.day, hour: hour24 });
  const durationMinutes = service.minutes;

  const location = mode.online ? "Online consultation — meeting link to follow" : clinic.area;
  const summary = `Consultation: ${patient.name} — ${service.svc}`;
  const description = [
    `${service.svc} (${service.dur}) with Dr. Fariha Ashraf.`,
    `Format: ${mode.mode}.`,
    `Patient: ${patient.name}, ${patient.phone}, ${patient.email}.`,
    `Main complaint: ${patient.complaint}`,
    `Fee: ${service.fee}. Reference: ${ref}.`,
    `Time shown in ${TIMEZONE_LABEL}.`,
  ].join("\n");

  const ics = buildIcs({
    uid: `${ref}@doctor-fariii`,
    start,
    durationMinutes,
    summary,
    description,
    location,
    organizerName: clinic.name,
    organizerEmail: user,
    attendeeName: patient.name,
    attendeeEmail: patient.email,
    method: "REQUEST",
  });

  const gcalUrl = googleCalendarUrl({ start, durationMinutes, summary, description, location });

  // The shape both email templates consume.
  const b = {
    ref,
    serviceName: service.svc,
    dur: service.dur,
    fee: service.fee,
    modeName: mode.mode,
    dateHuman,
    time,
    tzLabel: TIMEZONE_LABEL,
    name: patient.name,
    phone: patient.phone,
    email: patient.email,
    city: patient.city,
    age: patient.age,
    gender: patient.gender,
    complaint: patient.complaint,
    duration: patient.duration,
    prev: patient.prev,
    notes: patient.notes,
    gcalUrl,
  };

  const transporter = nodemailer.createTransport({
    host: "smtp.gmail.com",
    port: 465,
    secure: true,
    auth: { user, pass },
  });

  const from = `${clinic.name} <${user}>`;
  const attachments = [
    {
      filename: "consultation.ics",
      content: ics,
      contentType: "text/calendar; charset=utf-8; method=REQUEST",
    },
  ];

  const clinicMail = bookingClinic(b);
  const patientMail = bookingPatient(b);

  try {
    // 1) Notify the clinic inbox (SMTP_USER) — reply goes to the patient.
    await transporter.sendMail({
      from,
      to: user,
      replyTo: `${patient.name} <${patient.email}>`,
      subject: clinicMail.subject,
      html: clinicMail.html,
      text: clinicMail.text,
      attachments,
    });

    // 2) Confirm to the patient — reply goes to the clinic.
    await transporter.sendMail({
      from,
      to: patient.email,
      replyTo: user,
      subject: patientMail.subject,
      html: patientMail.html,
      text: patientMail.text,
      attachments,
    });
  } catch (err) {
    console.error("Booking: failed to send email —", err);
    return NextResponse.json(
      { error: "We couldn't send the confirmation. Please try again, or call to reserve." },
      { status: 502 }
    );
  }

  return NextResponse.json({ ok: true, ref });
}
