import { createClient } from "@/lib/supabase/server";
import { createAdminClient } from "@/lib/supabase/admin";
import { getAuthState } from "@/lib/getAuthState";
import { redirect } from "next/navigation";
import SiteHeader from "../components/SiteHeader";
import ApplyForm from "./ApplyForm";

export default async function ApplyPage() {
  const supabase = await createClient();
  const { data: { user } } = await supabase.auth.getUser();

  if (!user) redirect("/auth/signin?next=/apply");

  const admin = createAdminClient();
  const [authState, { data: existing }] = await Promise.all([
    getAuthState(supabase, user.id, user.email),
    admin.from("applicants").select("*").eq("email", user.email)
      .order("applied_at", { ascending: false }).limit(1).single()
  ]);

  const name = user.user_metadata?.full_name ?? user.email.split("@")[0];
  const firstName = name.split(" ")[0];
  const isApproved = existing?.status === "approved";
  const isPending = existing?.status === "pending";

  return (
    <div className="page">
      <SiteHeader active="apply" user={authState} />
      <div className="apply-shell">
        <div className="apply-header">
          {isApproved ? (
            <>
              <h1>your squad profile</h1>
              <p>update your preferences anytime. we use this to keep your match fresh.</p>
            </>
          ) : isPending ? (
            <>
              <h1>your application</h1>
              <p>hey {firstName}. your application is under review. you can update it anytime before we match you.</p>
            </>
          ) : (
            <>
              <h1>apply to join</h1>
              <p>hey {firstName}. fill this out and we&apos;ll find your squad.</p>
            </>
          )}
        </div>
        <ApplyForm
          name={name}
          email={user.email}
          existing={existing ?? null}
          isApproved={isApproved}
        />
      </div>
      <footer className="footer">© 2026 where we landing</footer>
    </div>
  );
}
