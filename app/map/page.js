import { createClient } from "@/lib/supabase/server";
import SiteHeader from "../components/SiteHeader";
import MapClient from "./MapClient";

export default async function MapPage() {
  const supabase = await createClient();
  const { data: { user } } = await supabase.auth.getUser();

  let profiles = [];
  let role = null;

  if (user) {
    const [{ data: profile }, { data: allProfiles }] = await Promise.all([
      supabase.from("profiles").select("role").eq("id", user.id).single(),
      supabase.from("profiles")
        .select("id, name, neighborhood, goals, friend_type, availability_days, stage_of_life")
        .eq("status", "active")
    ]);
    role = profile?.role ?? null;
    profiles = allProfiles ?? [];
  }

  return (
    <div className="page">
      <SiteHeader active="map" user={user ? { role } : null} />
      <MapClient profiles={profiles} isAuthed={!!user} />
      <footer className="footer">© 2026 where we landing</footer>
    </div>
  );
}
