import { createClient } from "@/lib/supabase/server";
import { createAdminClient } from "@/lib/supabase/admin";
import { Resend } from "resend";
import { NextResponse } from "next/server";

const resend = new Resend(process.env.RESEND_API_KEY);

export async function POST(request) {
  const { id } = await request.json();
  const supabase = await createClient();
  const admin = createAdminClient();

  const { data: { user } } = await supabase.auth.getUser();
  const { data: profile } = await supabase.from("profiles").select("role").eq("id", user?.id).single();
  if (profile?.role !== "admin") return NextResponse.json({ error: "unauthorized" }, { status: 403 });

  const { data: applicant, error } = await admin.from("applicants").update({ status: "rejected" }).eq("id", id).select().single();
  if (error) return NextResponse.json({ error: "db error" }, { status: 500 });

  await resend.emails.send({
    from: "where we landing <hello@wherewelanding.com>",
    to: applicant.email,
    subject: "your application to where we landing",
    html: `<p>hey ${applicant.name.split(" ")[0]},</p><p>we weren't able to approve your application at this time. you're welcome to apply again.</p><p>— where we landing</p>`
  });

  return NextResponse.json({ message: "rejected and emailed." });
}
