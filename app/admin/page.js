import { createClient } from "@/lib/supabase/server";
import { createAdminClient } from "@/lib/supabase/admin";
import SiteHeader from "../components/SiteHeader";
import AdminClient from "./AdminClient";

export default async function AdminPage() {
  const supabase = await createClient();
  const admin = createAdminClient();
  const { data: { user } } = await supabase.auth.getUser();
  const { data: profile } = await supabase.from("profiles").select("role").eq("id", user.id).single();

  const [{ data: applicants }, { data: groups }, { data: kicked }] = await Promise.all([
    admin.from("applicants").select("*").order("applied_at", { ascending: false }),
    admin.from("groups").select("*, group_members(user_id, profiles(name, email))").order("created_at", { ascending: false }),
    admin.from("kicked_profiles").select("*").order("kicked_at", { ascending: false })
  ]);

  return (
    <div className="page">
      <SiteHeader active="admin" user={{ role: profile?.role }} />
      <AdminClient applicants={applicants ?? []} groups={groups ?? []} kicked={kicked ?? []} />
      <footer className="footer">© 2026 where we landing</footer>
    </div>
  );
}
