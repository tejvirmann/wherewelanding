import { createClient } from "@/lib/supabase/server";
import { createAdminClient } from "@/lib/supabase/admin";
import { NextResponse } from "next/server";

export async function POST(request) {
  const { id } = await request.json();
  const supabase = await createClient();
  const admin = createAdminClient();

  const { data: { user } } = await supabase.auth.getUser();
  const { data: profile } = await supabase.from("profiles").select("role").eq("id", user?.id).single();
  if (profile?.role !== "admin") return NextResponse.json({ error: "unauthorized" }, { status: 403 });

  await admin.from("groups").update({ status: "dissolved", dissolved_at: new Date().toISOString() }).eq("id", id);
  await admin.from("group_events").insert({ group_id: id, type: "dissolved", content: "group dissolved by admin", actor: "admin" });

  return NextResponse.json({ message: "group dissolved." });
}
