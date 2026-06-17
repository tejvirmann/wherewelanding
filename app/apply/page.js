import { createClient } from "@/lib/supabase/server";
import { redirect } from "next/navigation";
import SiteHeader from "../components/SiteHeader";
import ApplyForm from "./ApplyForm";

export default async function ApplyPage() {
  const supabase = await createClient();
  const { data: { user } } = await supabase.auth.getUser();

  if (!user) redirect("/auth/signin?next=/apply");

  const { data: profile } = await supabase
    .from("profiles").select("role").eq("id", user.id).single();

  const name = user.user_metadata?.full_name ?? user.email.split("@")[0];

  return (
    <div className="page">
      <SiteHeader active="apply" user={user ? { role: profile?.role } : null} />
      <div className="apply-shell">
        <div className="apply-header">
          <h1>apply to join</h1>
          <p>hey {name.split(" ")[0]}. fill this out and we&apos;ll find your squad.</p>
        </div>
        <ApplyForm name={name} email={user.email} />
      </div>
      <footer className="footer">© 2026 where we landing</footer>
    </div>
  );
}
