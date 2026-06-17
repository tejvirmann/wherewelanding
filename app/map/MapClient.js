"use client";

import { useEffect, useRef, useState } from "react";
import { Loader } from "@googlemaps/js-api-loader";
import { MAP_STYLE } from "@/lib/mapStyle";

const MADISON_CENTER = { lat: 43.0731, lng: -89.4012 };

const MADISON_BOUNDS = {
  north: 43.22,
  south: 42.94,
  west: -89.65,
  east: -89.15
};

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

function primaryColor(activities) {
  if (!activities?.length) return "#888888";
  return ACTIVITY_COLORS[activities[0]] ?? "#888888";
}

function makeMarkerIcon(color, google) {
  return {
    path: google.maps.SymbolPath.CIRCLE,
    scale: 9,
    fillColor: color,
    fillOpacity: 0.9,
    strokeColor: "#ffffff",
    strokeWeight: 2
  };
}

export default function MapClient({ heatmapPoints, profiles, isAuthed, isApproved }) {
  const mapRef = useRef(null);
  const mapInstanceRef = useRef(null);
  const heatmapRef = useRef(null);
  const markersRef = useRef([]);
  const infoWindowRef = useRef(null);

  const [activeActivities, setActiveActivities] = useState([]);
  const [activeDays, setActiveDays] = useState([]);
  const [showFilters, setShowFilters] = useState(false);
  const [mapReady, setMapReady] = useState(false);

  const filtered = profiles.filter(p => {
    if (activeActivities.length > 0 && !p.friend_type?.some(a => activeActivities.includes(a))) return false;
    if (activeDays.length > 0 && !p.availability_days?.some(d => activeDays.includes(d))) return false;
    return true;
  });

  // Init map
  useEffect(() => {
    const apiKey = process.env.NEXT_PUBLIC_GOOGLE_MAPS_KEY;
    if (!apiKey || !mapRef.current) return;

    const loader = new Loader({
      apiKey,
      version: "weekly",
      libraries: ["visualization"]
    });

    loader.load().then((google) => {
      console.log("[map] loaded. heatmap pts:", heatmapPoints.length, "profiles:", profiles.length, "visualization:", !!google.maps.visualization);
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

      // Heatmap layer
      if (heatmapPoints.length > 0) {
        const heatmapData = heatmapPoints.map(p =>
          new google.maps.LatLng(p.lat, p.lng)
        );
        heatmapRef.current = new google.maps.visualization.HeatmapLayer({
          data: heatmapData,
          map,
          radius: 40,
          opacity: 0.7,
          gradient: [
            "rgba(0,0,0,0)",
            "rgba(65,105,225,0.4)",
            "rgba(0,191,255,0.6)",
            "rgba(0,255,200,0.7)",
            "rgba(0,255,100,0.8)",
            "rgba(255,255,0,0.9)",
            "rgba(255,140,0,1)",
            "rgba(255,0,0,1)"
          ]
        });
      }

      setMapReady(true);
    });
  }, []);

  // Update markers when filters or profiles change
  useEffect(() => {
    if (!mapReady || !mapInstanceRef.current) return;
    const google = window.google;
    if (!google) return;

    // Clear existing markers
    markersRef.current.forEach(m => m.setMap(null));
    markersRef.current = [];

    if (!isApproved) return;

    filtered.forEach(profile => {
      if (!profile.home_lat || !profile.home_lng) return;

      const color = primaryColor(profile.friend_type);
      const marker = new google.maps.Marker({
        position: { lat: profile.home_lat, lng: profile.home_lng },
        map: mapInstanceRef.current,
        icon: makeMarkerIcon(color, google),
        title: profile.name
      });

      // Travel radius circle
      const circle = new google.maps.Circle({
        map: mapInstanceRef.current,
        center: { lat: profile.home_lat, lng: profile.home_lng },
        radius: (profile.travel_radius_km ?? 3) * 1000,
        fillColor: color,
        fillOpacity: 0.06,
        strokeColor: color,
        strokeOpacity: 0.3,
        strokeWeight: 1,
        clickable: false
      });

      marker.addListener("click", () => {
        const content = `
          <div style="font-family:system-ui;max-width:220px;padding:4px">
            <strong style="font-size:14px">${profile.name}</strong>
            <p style="font-size:12px;color:#666;margin:2px 0 6px">${profile.stage_of_life ?? ""} · ${profile.neighborhood ?? ""}</p>
            ${profile.goals ? `<p style="font-size:13px;margin:0 0 6px;line-height:1.4">${profile.goals}</p>` : ""}
            ${profile.friend_type?.length ? `<p style="font-size:11px;color:#888;margin:0">${profile.friend_type.slice(0,3).join(" · ")}</p>` : ""}
          </div>
        `;
        infoWindowRef.current.setContent(content);
        infoWindowRef.current.open(mapInstanceRef.current, marker);
      });

      markersRef.current.push(marker);

      // Store circle reference so we can clean it up
      marker._circle = circle;
    });

    return () => {
      markersRef.current.forEach(m => {
        m._circle?.setMap(null);
        m.setMap(null);
      });
    };
  }, [mapReady, filtered, isApproved]);

  function toggleActivity(a) {
    setActiveActivities(prev => prev.includes(a) ? prev.filter(x => x !== a) : [...prev, a]);
  }

  function toggleDay(d) {
    setActiveDays(prev => prev.includes(d) ? prev.filter(x => x !== d) : [...prev, d]);
  }

  const hasFilters = activeActivities.length > 0 || activeDays.length > 0;

  return (
    <div className="map-page">
      {/* Filter bar */}
      <div className="map-filterbar">
        <div className="map-filterbar-left">
          <span className="map-count">
            {isApproved
              ? `${filtered.length} of ${profiles.length} people · ${heatmapPoints.length} heatmap pts`
              : `${heatmapPoints.length} in pool`
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
          <button className="map-clear-filters" onClick={() => { setActiveActivities([]); setActiveDays([]); }}>
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
                <button
                  key={a}
                  type="button"
                  className={`chip chip--sm ${activeActivities.includes(a) ? "chip--active" : ""}`}
                  style={activeActivities.includes(a) ? {} : { borderLeft: `3px solid ${ACTIVITY_COLORS[a]}` }}
                  onClick={() => toggleActivity(a)}
                >{a}</button>
              ))}
            </div>
          </div>
          <div className="map-filter-group">
            <span className="map-filter-label">available</span>
            <div className="chip-group">
              {ALL_DAYS.map(d => (
                <button
                  key={d}
                  type="button"
                  className={`chip chip--sm ${activeDays.includes(d) ? "chip--active" : ""}`}
                  onClick={() => toggleDay(d)}
                >{d}</button>
              ))}
            </div>
          </div>
        </div>
      )}

      {/* Activity legend (approved only) */}
      {isApproved && profiles.length > 0 && (
        <div className="map-legend">
          {ALL_ACTIVITIES.filter(a => profiles.some(p => p.friend_type?.includes(a))).slice(0, 8).map(a => (
            <span key={a} className="map-legend-item">
              <span className="map-legend-dot" style={{ background: ACTIVITY_COLORS[a] }} />
              {a}
            </span>
          ))}
        </div>
      )}

      {/* Map */}
      <div ref={mapRef} className="map-canvas-full" />

      {/* Guest / pending overlay */}
      {!isApproved && (
        <div className="map-overlay-hint">
          {!isAuthed && (
            <div className="map-overlay-card">
              <p>sign in to apply and see who&apos;s in the pool</p>
              <a href="/auth/signin?next=/map" className="btn-primary">sign in with google</a>
            </div>
          )}
          {isAuthed && !isApproved && (
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
