"use client";

import { useEffect, useRef, useState } from "react";
import { Loader } from "@googlemaps/js-api-loader";

const MADISON_CENTER = { lat: 43.0731, lng: -89.4012 };

const samplePins = [
  { id: 1, name: "Maya", lat: 43.0750, lng: -89.3850, verified: true },
  { id: 2, name: "Andre", lat: 43.0765, lng: -89.3900, verified: true },
  { id: 3, name: "Priya", lat: 43.0710, lng: -89.4100, verified: true },
  { id: 4, name: "Sam", lat: 43.0680, lng: -89.4050, verified: true },
  { id: 5, name: "Jordan", lat: 43.0740, lng: -89.3950, verified: true },
  { id: 6, name: "Alex", lat: 43.0755, lng: -89.3875, verified: false },
  { id: 7, name: "Taylor", lat: 43.0720, lng: -89.4080, verified: false },
  { id: 8, name: "Riley", lat: 43.0690, lng: -89.4000, verified: true }
];

export default function MapPreview() {
  const mapRef = useRef(null);
  const [error, setError] = useState(null);

  useEffect(() => {
    const apiKey = process.env.NEXT_PUBLIC_GOOGLE_MAPS_API_KEY;
    if (!apiKey) {
      setError("Google Maps API key not configured");
      return;
    }

    const loader = new Loader({
      apiKey,
      version: "weekly"
    });

    loader
      .load()
      .then((google) => {
        const map = new google.maps.Map(mapRef.current, {
          center: MADISON_CENTER,
          zoom: 13,
          disableDefaultUI: true,
          zoomControl: true,
          styles: [
            {
              featureType: "poi",
              elementType: "labels",
              stylers: [{ visibility: "off" }]
            }
          ]
        });

        // Add pins
        samplePins.forEach((pin) => {
          const marker = new google.maps.Marker({
            position: { lat: pin.lat, lng: pin.lng },
            map,
            title: pin.name,
            icon: {
              path: google.maps.SymbolPath.CIRCLE,
              scale: 8,
              fillColor: pin.verified ? "#4ec4ff" : "#ff7a6b",
              fillOpacity: 1,
              strokeColor: "#ffffff",
              strokeWeight: 2
            }
          });

          const infoWindow = new google.maps.InfoWindow({
            content: `<div style="padding: 8px; font-weight: 600;">${pin.name}${pin.verified ? " ✓" : ""}</div>`
          });

          marker.addListener("click", () => {
            infoWindow.open(map, marker);
          });
        });
      })
      .catch((err) => {
        console.error("Map load error:", err);
        setError("Failed to load map");
      });
  }, []);

  if (error) {
    return (
      <div className="map-preview-container">
        <div className="map-error">{error}</div>
      </div>
    );
  }

  return (
    <div className="map-preview-container">
      <div ref={mapRef} className="map-preview-instance" />
    </div>
  );
}
