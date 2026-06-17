import { createClient } from "@/lib/supabase/server";
import { Resend } from "resend";
import { NextResponse } from "next/server";

const resend = new Resend(process.env.RESEND_API_KEY);

export async function POST(request) {
  const body = await request.json();
  const { name, email, age, stage, homeLat, homeLng, radiusKm, activities, goals, days, daysDetail, intro, proofLink } = body;

  if (!name || !email || !goals || !intro) {
    return NextResponse.json({ error: "missing required fields" }, { status: 400 });
  }

  const supabase = await createClient();

  const { error: dbError } = await supabase.from("applicants").insert({
    name, email,
    age: parseInt(age) || null,
    stage_of_life: stage,
    home_lat: homeLat ?? null,
    home_lng: homeLng ?? null,
    travel_radius_km: radiusKm ?? null,
    friend_type: activities ?? [],
    goals,
    availability_days: days ?? [],
    availability_detail: daysDetail || null,
    madison_proof: intro,
    proof_link: proofLink || null,
    status: "pending"
  });

  if (dbError) {
    console.error("db error:", dbError);
    return NextResponse.json({ error: "failed to save" }, { status: 500 });
  }

  await resend.emails.send({
    from: "where we landing <hello@wherewelanding.com>",
    to: email,
    subject: "we got your application.",
    html: `<p>hey ${name.split(" ")[0]},</p><p>we got your application. real humans — not AI — are reading it now.</p><p>we'll email you when we've found your squad. usually a week or two.</p><p>— where we landing</p>`
  });

  return NextResponse.json({ ok: true });
}
