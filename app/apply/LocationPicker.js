"use client";

import { useEffect, useRef, useState } from "react";
import { Loader } from "@googlemaps/js-api-loader";

const MADISON = { lat: 43.0731, lng: -89.4012 };
const DEFAULT_RADIUS_M = 4000;
const KM_TO_MI = 0.621371;

const MAP_STYLE = [
  { featureType: "all", stylers: [{ saturation: -100 }] },
  { featureType: "poi", stylers: [{ visibility: "off" }] },
  { featureType: "transit", stylers: [{ visibility: "off" }] }
];

export default function LocationPicker({ onChange }) {
  const mapRef = useRef(null);
  const markerRef = useRef(null);
  const circleRef = useRef(null);
  const googleRef = useRef(null);
  const [placed, setPlaced] = useState(false);
  const [radiusMi, setRadiusMi] = useState((DEFAULT_RADIUS_M / 1000) * KM_TO_MI);

  useEffect(() => {
    const apiKey = process.env.NEXT_PUBLIC_GOOGLE_MAPS_KEY;
    if (!apiKey) return;

    const loader = new Loader({ apiKey, version: "weekly" });

    loader.load().then((google) => {
      googleRef.current = google;

      const map = new google.maps.Map(mapRef.current, {
        center: MADISON,
        zoom: 12,
        disableDefaultUI: true,
        zoomControl: true,
        styles: MAP_STYLE
      });

      const circle = new google.maps.Circle({
        map,
        center: MADISON,
        radius: DEFAULT_RADIUS_M,
        editable: true,
        draggable: false,
        fillColor: "#000000",
        fillOpacity: 0.08,
        strokeColor: "#000000",
        strokeOpacity: 0.5,
        strokeWeight: 1.5,
        visible: false
      });
      circleRef.current = circle;

      map.addListener("click", (e) => {
        const pos = { lat: e.latLng.lat(), lng: e.latLng.lng() };

        if (!markerRef.current) {
          markerRef.current = new google.maps.Marker({
            position: pos,
            map,
            icon: {
              path: google.maps.SymbolPath.CIRCLE,
              scale: 7,
              fillColor: "#000000",
              fillOpacity: 1,
              strokeWeight: 0
            }
          });
        } else {
          markerRef.current.setPosition(pos);
        }

        circle.setCenter(pos);
        circle.setVisible(true);
        setPlaced(true);

        const radiusKm = circle.getRadius() / 1000;
        onChange?.({ lat: pos.lat, lng: pos.lng, radiusKm });
      });

      circle.addListener("radius_changed", () => {
        const radiusM = circle.getRadius();
        const radiusKm = radiusM / 1000;
        const mi = radiusKm * KM_TO_MI;
        setRadiusMi(mi);
        const pos = markerRef.current?.getPosition();
        if (pos) onChange?.({ lat: pos.lat(), lng: pos.lng(), radiusKm });
      });
    });
  }, []);

  const apiKey = process.env.NEXT_PUBLIC_GOOGLE_MAPS_KEY;

  if (!apiKey) {
    return (
      <div className="location-picker-missing">
        <p>map unavailable — <code>NEXT_PUBLIC_GOOGLE_MAPS_KEY</code> not set.</p>
      </div>
    );
  }

  return (
    <div className="location-picker">
      <div ref={mapRef} className="location-picker-map" />
      <div className="location-picker-hint">
        {!placed
          ? "click anywhere on the map to drop your general area — not your exact address."
          : `your area is set. drag the circle edge to adjust how far you'll travel (currently ~${radiusMi.toFixed(1)} mi).`
        }
      </div>
    </div>
  );
}
