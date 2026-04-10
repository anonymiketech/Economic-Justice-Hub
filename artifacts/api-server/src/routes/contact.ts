import { Router } from "express";
import { createClient } from "@supabase/supabase-js";
import { Resend } from "resend";

const router = Router();

const supabaseUrl = process.env.VITE_SUPABASE_URL ?? process.env.SUPABASE_URL ?? "";
const supabaseServiceKey = process.env.SUPABASE_SERVICE_ROLE_KEY ?? "";

if (!supabaseUrl || !supabaseServiceKey) {
  console.error("[contact] Missing VITE_SUPABASE_URL or SUPABASE_SERVICE_ROLE_KEY");
}

const supabase = createClient(supabaseUrl, supabaseServiceKey, {
  auth: { persistSession: false },
});

const resend = new Resend(process.env.RESEND_API_KEY);

const ADMIN_EMAIL = "economicsjusticeforums@gmail.com";
const FROM_EMAIL = "noreply@economicjusticeforum.org";

router.post("/contact", async (req, res) => {
  const { name, email, subject, message } = req.body as Record<string, string>;

  if (!name || !email || !message) {
    res.status(400).json({ error: "name, email and message are required" });
    return;
  }

  const { error: dbError } = await supabase.from("contact_submissions").insert({
    name: name.trim(),
    email: email.trim().toLowerCase(),
    subject: subject?.trim() ?? "(no subject)",
    message: message.trim(),
    submitted_at: new Date().toISOString(),
  });

  if (dbError) {
    console.error("[contact] DB error:", dbError.message);
  }

  try {
    await resend.emails.send({
      from: FROM_EMAIL,
      to: [ADMIN_EMAIL],
      replyTo: email.trim(),
      subject: `[EJF Contact] ${subject?.trim() || "(no subject)"} — from ${name.trim()}`,
      html: `
        <div style="font-family:sans-serif;max-width:600px;margin:auto;background:#f9fafb;border-radius:12px;overflow:hidden">
          <div style="background:#0e1f3d;padding:24px 32px">
            <h2 style="color:#ffffff;margin:0;font-size:20px">New Contact Message</h2>
            <p style="color:#d4a017;margin:4px 0 0;font-size:13px">Economic Justice Forum</p>
          </div>
          <div style="padding:28px 32px;background:#ffffff">
            <table style="width:100%;border-collapse:collapse;font-size:14px">
              <tr><td style="padding:8px 0;color:#6b7280;width:100px">From</td><td style="padding:8px 0;font-weight:600;color:#0e1f3d">${name} &lt;${email}&gt;</td></tr>
              <tr><td style="padding:8px 0;color:#6b7280">Subject</td><td style="padding:8px 0;color:#0e1f3d">${subject || "(no subject)"}</td></tr>
              <tr><td style="padding:8px 0;color:#6b7280">Date</td><td style="padding:8px 0;color:#0e1f3d">${new Date().toLocaleString("en-GB", { dateStyle: "full", timeStyle: "short" })}</td></tr>
            </table>
            <div style="margin-top:20px;padding:20px;background:#f9fafb;border-radius:8px;border-left:4px solid #d4a017">
              <p style="margin:0;color:#374151;font-size:14px;line-height:1.7;white-space:pre-wrap">${message}</p>
            </div>
            <div style="margin-top:24px">
              <a href="mailto:${email}?subject=Re: ${encodeURIComponent(subject || '')}" style="display:inline-block;background:#0e1f3d;color:#ffffff;text-decoration:none;padding:12px 24px;border-radius:8px;font-size:13px;font-weight:600">Reply to ${name} →</a>
            </div>
          </div>
          <div style="padding:16px 32px;background:#f9fafb;text-align:center">
            <p style="color:#9ca3af;font-size:12px;margin:0">EJF Admin Panel · economicjusticeforum.org</p>
          </div>
        </div>
      `,
    });
  } catch (emailErr) {
    console.error("[contact] Email error:", emailErr);
  }

  res.json({ ok: true, dbSaved: !dbError });
});

router.post("/newsletter", async (req, res) => {
  const { email, name } = req.body as { email?: string; name?: string };

  if (!email || !email.includes("@")) {
    res.status(400).json({ error: "Valid email is required" });
    return;
  }

  const { error: dbError } = await supabase.from("newsletter_subscriptions").upsert(
    { email: email.trim().toLowerCase(), name: name?.trim() ?? "", active: true },
    { onConflict: "email", ignoreDuplicates: false }
  );

  if (dbError) {
    console.error("[newsletter] DB error:", dbError.message);
    res.status(500).json({ error: dbError.message });
    return;
  }

  try {
    await resend.emails.send({
      from: FROM_EMAIL,
      to: [ADMIN_EMAIL],
      subject: `[EJF] New Newsletter Subscriber: ${email.trim().toLowerCase()}`,
      html: `<p style="font-family:sans-serif"><strong>${email}</strong>${name ? ` (${name})` : ""} has subscribed to the EJF newsletter.</p>`,
    });
  } catch (e) {
    console.error("[newsletter] Admin notification error:", e);
  }

  res.json({ ok: true });
});

export default router;
