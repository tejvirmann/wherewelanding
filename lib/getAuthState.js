import { createAdminClient } from "./supabase/admin";

export async function getAuthState(supabase, userId, email) {
  const admin = createAdminClient();
  const [{ data: profile }, { data: app }] = await Promise.all([
    supabase.from("profiles").select("role").eq("id", userId).single(),
    admin.from("applicants")
      .select("status")
      .eq("email", email)
      .order("applied_at", { ascending: false })
      .limit(1)
      .single()
  ]);
  return {
    role: profile?.role ?? null,
    appStatus: app?.status ?? null
  };
}
