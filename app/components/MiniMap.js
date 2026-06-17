"use client";

import { useEffect, useRef } from "react";
import { Loader } from "@googlemaps/js-api-loader";
import { useRouter } from "next/navigation";
import { MAP_STYLE } from "@/lib/mapStyle";

export default function MiniMap({ heatmapPoints = [], count = 0 }) {
  const mapRef = useRef(null);
  const router = useRouter();

  useEffect(() => {
    const apiKey = process.env.NEXT_PUBLIC_GOOGLE_MAPS_KEY;
    if (!apiKey || !mapRef.current) return;

    const loader = new Loader({ apiKey, version: "weekly", libraries: [] });

    loader.load().then((google) => {
      const map = new google.maps.Map(mapRef.current, {
        center: { lat: 43.0731, lng: -89.4012 },
        zoom: 11,
        minZoom: 11,
        maxZoom: 11,
        disableDefaultUI: true,
        gestureHandling: "none",
        keyboardShortcuts: false,
        styles: MAP_STYLE
      });

      heatmapPoints.forEach(p => {
        new google.maps.Circle({
          map,
          center: { lat: p.lat, lng: p.lng },
          radius: 1200,
          fillColor: "#4A90D9",
          fillOpacity: 0.08,
          strokeWeight: 0,
          clickable: false
        });
        new google.maps.Circle({
          map,
          center: { lat: p.lat, lng: p.lng },
          radius: 400,
          fillColor: "#2563EB",
          fillOpacity: 0.18,
          strokeWeight: 0,
          clickable: false
        });
      });
    });
  }, []);

  return (
    <div className="mini-map-wrap" onClick={() => router.push("/map")}>
      <div ref={mapRef} className="mini-map" />
      <div className="mini-map-overlay">
        <span className="mini-map-count">{count > 0 ? `${count} people in the pool` : "madison, wi"}</span>
        <span className="mini-map-cta">view the map →</span>
      </div>
    </div>
  );
}
