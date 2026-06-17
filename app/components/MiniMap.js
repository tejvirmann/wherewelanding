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

    const loader = new Loader({ apiKey, version: "weekly", libraries: ["visualization", "maps"] });

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

      if (heatmapPoints.length > 0) {
        new google.maps.visualization.HeatmapLayer({
          data: heatmapPoints.map(p => new google.maps.LatLng(p.lat, p.lng)),
          map,
          radius: 35,
          opacity: 0.8,
          gradient: [
            "rgba(0,0,0,0)",
            "rgba(65,105,225,0.5)",
            "rgba(0,191,255,0.7)",
            "rgba(0,255,150,0.8)",
            "rgba(255,255,0,0.9)",
            "rgba(255,100,0,1)",
            "rgba(255,0,0,1)"
          ]
        });
      }
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
