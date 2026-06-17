"use client";

import { useEffect, useRef, useState, useMemo } from "react";
import { Loader } from "@googlemaps/js-api-loader";
import { MAP_STYLE } from "@/lib/mapStyle";

const MADISON_CENTER = { lat: 43.0731, lng: -89.4012 };
const MADISON_BOUNDS = { north: 43.22, south: 42.94, west: -89.65, east: -89.15 };

const ACTIVITY_COLORS = {
  "running / fitness":        "#FF6B35",
  "climbing":                 "#4CAF50",
  "hiking & outdoors":        "#8BC34A",
  "golfing":                  "#CDDC39",
  "going out / nightlife":    "#9C27B0",
  "book club":                "#2196F3",
  "cooking & food":           "#FF5722",
  "music":                    "#E91E63",
  "creative (art / writing)": "#FF9800",
  "woodworking & making":     "#795548",
  "sobriety-friendly socials":"#00BCD4",
  "gaming":                   "#673AB7",
  "coding / tech":            "#3F51B5",
  "learning something new":   "#009688",
  "volunteering":             "#F44336"
};

const ALL_ACTIVITIES = Object.keys(ACTIVITY_COLORS);
const ALL_DAYS = ["mon", "tue", "wed", "thu", "fri", "sat", "sun"];

export default function MapClient({ heatmapPoints, profiles, isAuthed, isApproved }) {
  const mapRef = useRef(null);
  const googleRef = useRef(null);
  const mapInstanceRef = useRef(null);
  const densityCirclesRef = useRef([]);
  const markersRef = useRef([]);
  const circlesRef = useRef([]);
  const infoWindowRef = useRef(null);

  const [ready, setReady] = useState(false);
  const [activeActivities, setActiveActivities] = useState([]);
  const [activeDays, setActiveDays] = useState([]);
  const [showFilters, setShowFilters] = useState(false);

  const filtered = useMemo(() => profiles.filter(p => {
    if (activeActivities.length > 0 && !p.friend_type?.some(a => activeActivities.includes(a))) return false;
    if (activeDays.length > 0 && !p.availability_days?.some(d => activeDays.includes(d))) return false;
    return true;
  }), [profiles, activeActivities, activeDays]);

  // Init map once
  useEffect(() => {
    const apiKey = process.env.NEXT_PUBLIC_GOOGLE_MAPS_KEY;
    if (!apiKey || !mapRef.current) return;

    new Loader({ apiKey, version: "weekly", libraries: [] })
      .load()
      .then((google) => {
        googleRef.current = google;

        const map = new google.maps.Map(mapRef.current, {
          center: MADISON_CENTER,
          zoom: 12,
          minZoom: 10,
          maxZoom: 16,
          restriction: { latLngBounds: MADISON_BOUNDS, strictBounds: false },
          disableDefaultUI: true,
          zoomControl: true,
          styles: MAP_STYLE
        });

        mapInstanceRef.current = map;
        infoWindowRef.current = new google.maps.InfoWindow();

        // Force resize in case container wasn't fully laid out yet
        google.maps.event.trigger(map, "resize");
        map.setCenter(MADISON_CENTER);

        setReady(true);
      })
      .catch(err => console.error("[map] load error:", err));
  }, []);

  // Draw density circles (replaces deprecated HeatmapLayer)
  useEffect(() => {
    if (!ready || !googleRef.current || !mapInstanceRef.current) return;
    const google = googleRef.current;

    densityCirclesRef.current.forEach(c => c.setMap(null));
    densityCirclesRef.current = [];

    heatmapPoints.forEach(p => {
      // Large outer glow
      densityCirclesRef.current.push(new google.maps.Circle({
        map: mapInstanceRef.current,
        center: { lat: p.lat, lng: p.lng },
        radius: 1200,
        fillColor: "#4A90D9",
        fillOpacity: 0.08,
        strokeWeight: 0,
        clickable: false
      }));
      // Tighter inner circle
      densityCirclesRef.current.push(new google.maps.Circle({
        map: mapInstanceRef.current,
        center: { lat: p.lat, lng: p.lng },
        radius: 400,
        fillColor: "#2563EB",
        fillOpacity: 0.18,
        strokeWeight: 0,
        clickable: false
      }));
    });
  }, [ready, heatmapPoints]);

  // Update markers whenever ready, filtered profiles, or approval changes
  useEffect(() => {
    if (!ready || !googleRef.current || !mapInstanceRef.current) return;
    const google = googleRef.current;

    // Clear old markers and circles
    markersRef.current.forEach(m => m.setMap(null));
    circlesRef.current.forEach(c => c.setMap(null));
    markersRef.current = [];
    circlesRef.current = [];

    if (!isApproved) return;

    filtered.forEach(profile => {
      if (!profile.home_lat || !profile.home_lng) return;

      const color = ACTIVITY_COLORS[profile.friend_type?.[0]] ?? "#888888";
      const pos = { lat: Number(profile.home_lat), lng: Number(profile.home_lng) };

      const marker = new google.maps.Marker({
        position: pos,
        map: mapInstanceRef.current,
        icon: {
          path: google.maps.SymbolPath.CIRCLE,
          scale: 9,
          fillColor: color,
          fillOpacity: 0.9,
          strokeColor: "#ffffff",
          strokeWeight: 2
        },
        title: profile.name
      });

      const circle = new google.maps.Circle({
        map: mapInstanceRef.current,
        center: pos,
        radius: Number(profile.travel_radius_km ?? 3) * 1000,
        fillColor: color,
        fillOpacity: 0.07,
        strokeColor: color,
        strokeOpacity: 0.25,
        strokeWeight: 1,
        clickable: false
      });

      marker.addListener("click", () => {
        infoWindowRef.current.setContent(`
          <div style="font-family:system-ui;max-width:220px;padding:4px">
            <strong style="font-size:14px">${profile.name}</strong>
            <p style="font-size:12px;color:#666;margin:2px 0 6px">${profile.stage_of_life ?? ""} · ${profile.neighborhood ?? ""}</p>
            ${profile.goals ? `<p style="font-size:13px;margin:0 0 6px;line-height:1.4">${profile.goals}</p>` : ""}
            ${profile.friend_type?.length ? `<p style="font-size:11px;color:#888;margin:0">${profile.friend_type.slice(0, 3).join(" · ")}</p>` : ""}
          </div>
        `);
        infoWindowRef.current.open(mapInstanceRef.current, marker);
      });

      markersRef.current.push(marker);
      circlesRef.current.push(circle);
    });
  }, [ready, filtered, isApproved]);

  const hasFilters = activeActivities.length > 0 || activeDays.length > 0;

  return (
    <div className="map-page">
      {/* Filter bar */}
      <div className="map-filterbar">
        <div className="map-filterbar-left">
          <span className="map-count">
            {isApproved
              ? `${filtered.length} of ${profiles.length} ${profiles.length === 1 ? "person" : "people"}`
              : `${heatmapPoints.length} active ${heatmapPoints.length === 1 ? "friend" : "friends"} in madison`
            }
          </span>
          {isApproved && (
            <button
              className={`map-filter-toggle ${showFilters ? "map-filter-toggle--open" : ""}`}
              onClick={() => setShowFilters(s => !s)}
            >
              filters {hasFilters ? `(${activeActivities.length + activeDays.length})` : ""}
            </button>
          )}
          {!isApproved && isAuthed && (
            <span className="map-filter-locked">filters unlock once your application is approved</span>
          )}
          {!isAuthed && (
            <span className="map-filter-locked">
              <a href="/auth/signin?next=/map">sign in</a> and get approved to use filters
            </span>
          )}
        </div>
        {hasFilters && (
          <button className="map-clear-filters"
            onClick={() => { setActiveActivities([]); setActiveDays([]); }}>
            clear all
          </button>
        )}
      </div>

      {/* Filter panel */}
      {showFilters && isApproved && (
        <div className="map-filters">
          <div className="map-filter-group">
            <span className="map-filter-label">activity</span>
            <div className="chip-group">
              {ALL_ACTIVITIES.map(a => (
                <button key={a} type="button"
                  className={`chip chip--sm ${activeActivities.includes(a) ? "chip--active" : ""}`}
                  style={activeActivities.includes(a) ? {} : { borderLeft: `3px solid ${ACTIVITY_COLORS[a]}` }}
                  onClick={() => setActiveActivities(prev =>
                    prev.includes(a) ? prev.filter(x => x !== a) : [...prev, a]
                  )}>{a}</button>
              ))}
            </div>
          </div>
          <div className="map-filter-group">
            <span className="map-filter-label">available</span>
            <div className="chip-group">
              {ALL_DAYS.map(d => (
                <button key={d} type="button"
                  className={`chip chip--sm ${activeDays.includes(d) ? "chip--active" : ""}`}
                  onClick={() => setActiveDays(prev =>
                    prev.includes(d) ? prev.filter(x => x !== d) : [...prev, d]
                  )}>{d}</button>
              ))}
            </div>
          </div>
        </div>
      )}

      {/* Legend */}
      {isApproved && profiles.length > 0 && (
        <div className="map-legend">
          {ALL_ACTIVITIES
            .filter(a => profiles.some(p => p.friend_type?.includes(a)))
            .slice(0, 8)
            .map(a => (
              <span key={a} className="map-legend-item">
                <span className="map-legend-dot" style={{ background: ACTIVITY_COLORS[a] }} />
                {a}
              </span>
            ))}
        </div>
      )}

      {/* Map canvas */}
      <div ref={mapRef} className="map-canvas-full" />

      {/* Guest / pending overlay */}
      {!isApproved && (
        <div className="map-overlay-hint">
          {!isAuthed ? (
            <div className="map-overlay-card">
              <p>sign in to see who&apos;s looking for their squad in madison</p>
              <a href="/auth/signin?next=/map" className="btn-primary">sign in with google</a>
            </div>
          ) : (
            <div className="map-overlay-card">
              <p>your application is under review.</p>
              <p className="map-overlay-sub">filters and full data unlock once approved.</p>
            </div>
          )}
        </div>
      )}
    </div>
  );
}
