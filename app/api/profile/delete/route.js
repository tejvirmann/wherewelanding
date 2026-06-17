import { createClient } from "@/lib/supabase/server";
import { createAdminClient } from "@/lib/supabase/admin";
import { NextResponse } from "next/server";

export async function POST() {
  const supabase = await createClient();
  const { data: { user } } = await supabase.auth.getUser();
  if (!user) return NextResponse.json({ error: "unauthorized" }, { status: 401 });

  const admin = createAdminClient();
  await admin.from("applicants").delete().eq("email", user.email);
  await admin.from("profiles").delete().eq("id", user.id);
  const { error } = await admin.auth.admin.deleteUser(user.id);

  if (error) return NextResponse.json({ error: "failed to delete" }, { status: 500 });
  return NextResponse.json({ ok: true });
}
