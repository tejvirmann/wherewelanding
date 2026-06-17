import { createClient } from "@/lib/supabase/server";
import { createAdminClient } from "@/lib/supabase/admin";
import { getAuthState } from "@/lib/getAuthState";
import { redirect } from "next/navigation";
import SiteHeader from "../components/SiteHeader";
import ProfileClient from "./ProfileClient";

export default async function ProfilePage() {
  const supabase = await createClient();
  const { data: { user } } = await supabase.auth.getUser();

  if (!user) redirect("/auth/signin?next=/profile");

  const admin = createAdminClient();

  const [authState, { data: application }] = await Promise.all([
    getAuthState(supabase, user.id, user.email),
    admin.from("applicants").select("*").eq("email", user.email).order("applied_at", { ascending: false }).limit(1).single()
  ]);

  return (
    <div className="page">
      <SiteHeader active="profile" user={authState} />
      <ProfileClient
        user={{ name: user.user_metadata?.full_name ?? user.email, email: user.email }}
        profile={null}
        application={application}
      />
      <footer className="footer">© 2026 where we landing</footer>
    </div>
  );
}
