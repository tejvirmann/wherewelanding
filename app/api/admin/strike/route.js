import { createClient } from "@/lib/supabase/server";
import { createAdminClient } from "@/lib/supabase/admin";
import { Resend } from "resend";
import { NextResponse } from "next/server";

const resend = new Resend(process.env.RESEND_API_KEY);
const MAX_STRIKES = 3;

export async function POST(request) {
  const { userId, reason } = await request.json();
  const supabase = await createClient();
  const admin = createAdminClient();

  const { data: { user } } = await supabase.auth.getUser();
  const { data: adminProfile } = await supabase.from("profiles").select("role").eq("id", user?.id).single();
  if (adminProfile?.role !== "admin") return NextResponse.json({ error: "unauthorized" }, { status: 403 });

  const { data: target } = await admin.from("profiles").select("*").eq("id", userId).single();
  const newStrikes = (target?.strike_count ?? 0) + 1;

  await admin.from("profiles").update({ strike_count: newStrikes }).eq("id", userId);

  if (newStrikes >= MAX_STRIKES) {
    await admin.from("kicked_profiles").insert({
      original_user_id: userId, email: target.email, name: target.name,
      kick_reason: reason, strike_history: { strikes: newStrikes, last_reason: reason }
    });
    await admin.from("profiles").update({ status: "kicked", kicked_at: new Date().toISOString(), kick_reason: reason }).eq("id", userId);
    await resend.emails.send({
      from: "where we landing <hello@wherewelanding.com>",
      to: target.email,
      subject: "your account has been removed",
      html: `<p>hey ${target.name?.split(" ")[0]},</p><p>your account has been removed. you can reapply at wherewelanding.com/apply.</p><p>— where we landing</p>`
    });
    return NextResponse.json({ message: "user kicked and archived." });
  }

  return NextResponse.json({ message: `strike added. ${newStrikes}/${MAX_STRIKES}.` });
}
