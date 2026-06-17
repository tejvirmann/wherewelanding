import { createClient } from "@/lib/supabase/server";
import { createAdminClient } from "@/lib/supabase/admin";
import { NextResponse } from "next/server";

export async function POST(request) {
  const { email } = await request.json();
  const supabase = await createClient();
  const { data: { user } } = await supabase.auth.getUser();
  const { data: profile } = await supabase.from("profiles").select("role").eq("id", user?.id).single();
  if (profile?.role !== "admin") return NextResponse.json({ error: "unauthorized" }, { status: 403 });

  const admin = createAdminClient();
  const { error } = await admin.from("profiles").update({ role: "admin" }).eq("email", email);
  if (error) return NextResponse.json({ error: "failed" }, { status: 500 });

  return NextResponse.json({ message: `${email} is now an admin.` });
}
