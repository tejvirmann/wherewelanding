import { createClient } from "@/lib/supabase/server";
import { createAdminClient } from "@/lib/supabase/admin";
import { Resend } from "resend";
import { NextResponse } from "next/server";

const resend = new Resend(process.env.RESEND_API_KEY);
const MAX_STRIKES = 3;

export async function POST(request) {
  const { email, reason } = await request.json();
  const supabase = await createClient();
  const admin = createAdminClient();

  const { data: { user } } = await supabase.auth.getUser();
  const { data: adminProfile } = await supabase.from("profiles").select("role").eq("id", user?.id).single();
  if (adminProfile?.role !== "admin") return NextResponse.json({ error: "unauthorized" }, { status: 403 });

  // Find profile by email
  const { data: target } = await admin.from("profiles").select("*").eq("email", email).single();
  if (!target) return NextResponse.json({ error: "profile not found" }, { status: 404 });

  const newStrikes = (target.strike_count ?? 0) + 1;
  await admin.from("profiles").update({ strike_count: newStrikes }).eq("id", target.id);

  if (newStrikes >= MAX_STRIKES) {
    await admin.from("kicked_profiles").insert({
      original_user_id: target.id,
      email: target.email,
      name: target.name,
      kick_reason: reason,
      strike_history: { strikes: newStrikes, last_reason: reason }
    });
    await admin.from("profiles").update({
      status: "kicked",
      kicked_at: new Date().toISOString(),
      kick_reason: reason
    }).eq("id", target.id);

    await resend.emails.send({
      from: "where we landing <hello@wherewelanding.com>",
      to: target.email,
      subject: "your account has been removed",
      html: `<p>hey ${target.name?.split(" ")[0]},</p><p>your account has been removed from where we landing.</p>${reason ? `<p>reason: ${reason}</p>` : ""}<p>you can reapply at wherewelanding.com/apply.</p><p>— where we landing</p>`
    });

    return NextResponse.json({ message: "user kicked and removed." });
  }

  return NextResponse.json({ message: `strike issued. ${newStrikes}/${MAX_STRIKES} strikes.` });
}
