import { createClient } from "@/lib/supabase/server";
import { createAdminClient } from "@/lib/supabase/admin";
import SiteHeader from "./components/SiteHeader";
import BusHero from "./components/BusHero";
import dynamic from "next/dynamic";

const MiniMap = dynamic(() => import("./components/MiniMap"), { ssr: false });

export default async function HomePage() {
  const supabase = await createClient();
  const admin = createAdminClient();
  const { data: { user } } = await supabase.auth.getUser();

  let role = null;
  let appStatus = user ? "authed" : "guest";

  // Heatmap points for mini map (always load)
  const { data: heatmapData } = await admin
    .from("applicants")
    .select("home_lat, home_lng")
    .eq("status", "approved")
    .not("home_lat", "is", null);

  const heatmapPoints = (heatmapData ?? [])
    .filter(r => r.home_lat && r.home_lng)
    .map(r => ({ lat: r.home_lat, lng: r.home_lng }));

  if (user) {
    const [{ data: profile }, { data: app }] = await Promise.all([
      supabase.from("profiles").select("role").eq("id", user.id).single(),
      admin.from("applicants").select("status")
        .eq("email", user.email)
        .order("applied_at", { ascending: false })
        .limit(1)
        .single()
    ]);
    role = profile?.role ?? null;
    appStatus = app?.status ?? "authed";
  }

  return (
    <div className="page">
      <SiteHeader user={user ? { role, appStatus } : null} />
      <BusHero appStatus={appStatus} />

      <section className="home-mini-map-section">
        <MiniMap heatmapPoints={heatmapPoints} count={heatmapPoints.length} />
      </section>

      <footer className="footer">© 2026 where we landing</footer>
    </div>
  );
}
