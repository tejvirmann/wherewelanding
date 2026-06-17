import { createClient } from "@/lib/supabase/server";
import { createAdminClient } from "@/lib/supabase/admin";
import { Resend } from "resend";
import { NextResponse } from "next/server";

const resend = new Resend(process.env.RESEND_API_KEY);

export async function POST(request) {
  const supabase = await createClient();
  const { data: { user } } = await supabase.auth.getUser();
  const { data: profile } = await supabase.from("profiles").select("role").eq("id", user?.id).single();
  if (profile?.role !== "admin") return NextResponse.json({ error: "unauthorized" }, { status: 403 });

  const { name, memberIds, note } = await request.json();
  if (!memberIds || memberIds.length < 2) {
    return NextResponse.json({ error: "need at least 2 members" }, { status: 400 });
  }

  const admin = createAdminClient();

  // Fetch member details from applicants table
  const { data: members } = await admin
    .from("applicants")
    .select("name, email, goals, friend_type, neighborhood, availability_days")
    .in("id", memberIds);

  if (!members?.length) return NextResponse.json({ error: "members not found" }, { status: 404 });

  // Create the group
  const { data: group, error: groupError } = await admin
    .from("groups")
    .insert({ name: name || `group — ${members.map(m => m.name.split(" ")[0]).join(", ")}` })
    .select()
    .single();

  if (groupError) return NextResponse.json({ error: "failed to create group" }, { status: 500 });

  // Find profile IDs for each member (join on email)
  const emails = members.map(m => m.email);
  const { data: profileRows } = await admin
    .from("profiles")
    .select("id, email")
    .in("email", emails);

  const profileMap = Object.fromEntries((profileRows ?? []).map(p => [p.email, p.id]));

  // Add group members
  const memberInserts = members
    .filter(m => profileMap[m.email])
    .map(m => ({ group_id: group.id, user_id: profileMap[m.email] }));

  if (memberInserts.length) {
    await admin.from("group_members").insert(memberInserts);
  }

  // Log group creation event
  await admin.from("group_events").insert({
    group_id: group.id,
    type: "created",
    content: `Group formed with ${members.length} members${note ? `: ${note}` : ""}`,
    actor: "admin"
  });

  // Build the member summary for the email
  const memberSummaries = members.map(m =>
    `<b>${m.name}</b> (${m.neighborhood ?? "madison"})<br/>${m.goals ?? ""}`
  ).join("<br/><br/>");

  const sharedActivities = [...new Set(members.flatMap(m => m.friend_type ?? []))];

  // Send intro email to all members
  const emailPromises = members.map(m => {
    const others = members.filter(o => o.email !== m.email);
    return resend.emails.send({
      from: "where we landing <hello@wherewelanding.com>",
      to: m.email,
      subject: "you've been matched — where we landing",
      html: `
        <p>hey ${m.name.split(" ")[0]},</p>
        <p>we found your squad.</p>
        <hr style="border:none;border-top:1px solid #eee;margin:20px 0"/>
        <p><b>your squad:</b></p>
        ${memberSummaries}
        <hr style="border:none;border-top:1px solid #eee;margin:20px 0"/>
        ${sharedActivities.length ? `<p><b>what you have in common:</b> ${sharedActivities.slice(0, 5).join(", ")}</p>` : ""}
        ${note ? `<p><b>note from the matchmaker:</b> ${note}</p>` : ""}
        <hr style="border:none;border-top:1px solid #eee;margin:20px 0"/>
        <p><b>next step:</b> reply to this email and introduce yourself to the group. we've CC'd everyone.</p>
        <p style="color:#999;font-size:12px;margin-top:24px;">— where we landing · madison, wi</p>
      `,
      cc: others.map(o => o.email)
    });
  });

  await Promise.allSettled(emailPromises);

  return NextResponse.json({ message: `group created and ${members.length} emails sent.`, groupId: group.id });
}
