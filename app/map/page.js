import { createClient } from "@/lib/supabase/server";
import { createAdminClient } from "@/lib/supabase/admin";
import { getAuthState } from "@/lib/getAuthState";
import SiteHeader from "../components/SiteHeader";
import MapClient from "./MapClient";

export default async function MapPage() {
  const supabase = await createClient();
  const admin = createAdminClient();
  const { data: { user } } = await supabase.auth.getUser();

  let authState = null;
  let isApproved = false;
  let profiles = [];

  // Heatmap points — always load (guests see this too)
  const { data: heatmapData } = await admin
    .from("applicants")
    .select("home_lat, home_lng")
    .eq("status", "approved")
    .not("home_lat", "is", null);

  const heatmapPoints = (heatmapData ?? [])
    .filter(r => r.home_lat && r.home_lng)
    .map(r => ({ lat: r.home_lat, lng: r.home_lng }));

  if (user) {
    authState = await getAuthState(supabase, user.id, user.email);
    isApproved = authState.appStatus === "approved" || authState.role === "admin";

    if (isApproved) {
      // Join approved applicants with their profiles
      const { data: approvedApps } = await admin
        .from("applicants")
        .select("name, stage_of_life, neighborhood, goals, friend_type, availability_days, home_lat, home_lng, travel_radius_km, email")
        .eq("status", "approved")
        .not("home_lat", "is", null);

      profiles = (approvedApps ?? []).map(a => ({
        id: a.email,
        name: a.name,
        stage_of_life: a.stage_of_life,
        neighborhood: a.neighborhood,
        goals: a.goals,
        friend_type: a.friend_type ?? [],
        availability_days: a.availability_days ?? [],
        home_lat: a.home_lat,
        home_lng: a.home_lng,
        travel_radius_km: a.travel_radius_km
      }));
    }
  }

  return (
    <div className="page page--map">
      <SiteHeader active="map" user={authState} />
      <MapClient
        heatmapPoints={heatmapPoints}
        profiles={profiles}
        isAuthed={!!user}
        isApproved={isApproved}
      />
    </div>
  );
}
