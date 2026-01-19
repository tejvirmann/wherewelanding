"use client";

import { useEffect, useMemo, useRef, useState } from "react";
import SiteHeader from "../components/SiteHeader";

const MADISON_CENTER = { lat: 43.0731, lng: -89.4012 };
const botNames = ["Alex", "Jess", "Riley", "Kai", "Noah", "Sage"];

const getGroupKey = (lat, lng) => {
  const snap = 0.002;
  const glat = Math.round(lat / snap) * snap;
  const glng = Math.round(lng / snap) * snap;
  return `${glat.toFixed(3)}-${glng.toFixed(3)}`;
};

const loadGoogleMaps = (apiKey) => {
  if (typeof window === "undefined") {
    return Promise.reject(new Error("Window not available"));
  }
  if (window.google && window.google.maps) {
    return Promise.resolve(window.google.maps);
  }
  if (window.__googleMapsPromise) {
    return window.__googleMapsPromise;
  }
  window.__googleMapsPromise = new Promise((resolve, reject) => {
    const script = document.createElement("script");
    script.src = `https://maps.googleapis.com/maps/api/js?key=${apiKey}`;
    script.async = true;
    script.defer = true;
    script.onload = () => resolve(window.google.maps);
    script.onerror = () => reject(new Error("Failed to load Google Maps"));
    document.head.appendChild(script);
  });
  return window.__googleMapsPromise;
};

const initialPins = [
  { id: 1, name: "Maya", lat: 43.071, lng: -89.4, verified: true },
  { id: 2, name: "Andre", lat: 43.075, lng: -89.41, verified: true },
  { id: 3, name: "Priya", lat: 43.067, lng: -89.395, verified: true }
];

export default function MapPage() {
  const mapRef = useRef(null);
  const mapInstanceRef = useRef(null);
  const markersRef = useRef([]);
  const [pins, setPins] = useState(initialPins);
  const [displayName, setDisplayName] = useState("You");
  const [isVerified, setIsVerified] = useState(true);
  const [selectedGroup, setSelectedGroup] = useState(null);
  const [message, setMessage] = useState("");
  const [lastUpdated, setLastUpdated] = useState("just now");
  const [mapReady, setMapReady] = useState(false);
  const [theme, setTheme] = useState("light");

  const apiKey = process.env.NEXT_PUBLIC_GOOGLE_MAPS_API_KEY;

  const getMapStyles = (mode) => {
    if (mode === "dark") {
      return [
        { elementType: "geometry", stylers: [{ color: "#1c2440" }] },
        { elementType: "labels.text.fill", stylers: [{ color: "#e1e5ff" }] },
        { elementType: "labels.text.stroke", stylers: [{ color: "#1c2440" }] },
        { featureType: "road", elementType: "geometry", stylers: [{ color: "#2a355f" }] },
        { featureType: "water", elementType: "geometry", stylers: [{ color: "#142035" }] }
      ];
    }
    return [
      { elementType: "geometry", stylers: [{ color: "#f4f6fb" }] },
      { elementType: "labels.text.fill", stylers: [{ color: "#2c3554" }] },
      { elementType: "labels.text.stroke", stylers: [{ color: "#ffffff" }] },
      { featureType: "road", elementType: "geometry", stylers: [{ color: "#d7ddea" }] },
      { featureType: "water", elementType: "geometry", stylers: [{ color: "#c6d3f2" }] }
    ];
  };

  useEffect(() => {
    const current = document.documentElement.dataset.theme || "light";
    setTheme(current);
    const handler = (event) => setTheme(event.detail || "light");
    window.addEventListener("theme-change", handler);
    return () => window.removeEventListener("theme-change", handler);
  }, []);

  useEffect(() => {
    if (!apiKey || !mapRef.current) {
      return;
    }
    let isMounted = true;
    loadGoogleMaps(apiKey)
      .then((maps) => {
        if (!isMounted) return;
        mapInstanceRef.current = new maps.Map(mapRef.current, {
          center: MADISON_CENTER,
          zoom: 13,
          mapTypeControl: false,
          fullscreenControl: false,
          streetViewControl: false,
          styles: getMapStyles(theme)
        });

        mapInstanceRef.current.addListener("click", (event) => {
          if (!event.latLng) return;
          if (!isVerified) {
            setMessage("Verification required to drop a pin.");
            return;
          }
          if (!displayName.trim()) {
            setMessage("Add a display name before landing.");
            return;
          }
          const lat = event.latLng.lat();
          const lng = event.latLng.lng();
          const newPin = {
            id: Date.now(),
            name: displayName.trim(),
            lat,
            lng,
            verified: isVerified
          };
          setPins((prev) => [...prev, newPin]);
          setSelectedGroup(getGroupKey(lat, lng));
          setMessage("Pin dropped. Check the roster below.");
          setLastUpdated("just now");
        });

        setMapReady(true);
      })
      .catch(() => {
        setMessage("Map failed to load. Check your API key.");
      });

    return () => {
      isMounted = false;
    };
  }, [apiKey, displayName, isVerified, theme]);

  useEffect(() => {
    if (!mapInstanceRef.current) return;
    mapInstanceRef.current.setOptions({ styles: getMapStyles(theme) });
  }, [theme]);

  useEffect(() => {
    if (!mapReady || !mapInstanceRef.current || !window.google?.maps) return;
    markersRef.current.forEach((marker) => marker.setMap(null));
    markersRef.current = pins.map(
      (pin) =>
        new window.google.maps.Marker({
          position: { lat: pin.lat, lng: pin.lng },
          map: mapInstanceRef.current,
          title: pin.name,
          icon: {
            path: window.google.maps.SymbolPath.CIRCLE,
            scale: 7,
            fillColor: pin.verified ? "#5fd7ff" : "#ff7a6b",
            fillOpacity: 1,
            strokeColor: "#0f1224",
            strokeWeight: 2
          }
        })
    );
  }, [pins, mapReady]);

  useEffect(() => {
    const interval = setInterval(() => {
      setPins((prev) => {
        if (prev.length > 18) return prev;
        const name = botNames[Math.floor(Math.random() * botNames.length)];
        const lat = MADISON_CENTER.lat + (Math.random() - 0.5) * 0.03;
        const lng = MADISON_CENTER.lng + (Math.random() - 0.5) * 0.03;
        return [...prev, { id: Date.now(), name, lat, lng, verified: false }];
      });
      setLastUpdated("a few seconds ago");
    }, 15000);

    return () => clearInterval(interval);
  }, []);

  const groups = useMemo(() => {
    const grouped = new Map();
    pins.forEach((pin) => {
      const key = getGroupKey(pin.lat, pin.lng);
      if (!grouped.has(key)) {
        grouped.set(key, { key, pins: [], lat: pin.lat, lng: pin.lng });
      }
      grouped.get(key).pins.push(pin);
    });
    return Array.from(grouped.values());
  }, [pins]);

  const groupsWithLabels = useMemo(() => {
    return groups.map((group, index) => ({
      ...group,
      label: `Drop Zone ${String.fromCharCode(65 + index)}`
    }));
  }, [groups]);

  useEffect(() => {
    if (!selectedGroup && groupsWithLabels.length) {
      setSelectedGroup(groupsWithLabels[0].key);
    }
  }, [groupsWithLabels, selectedGroup]);

  const selectedZone = groupsWithLabels.find(
    (group) => group.key === selectedGroup
  );

  return (
    <div className="page">
      <SiteHeader active="map" />

      <section className="section">
        <h1>Madison Software Meetup Map</h1>
        <p>
          Pick a landing spot for the software community. If many people click
          the same location, you can see the list of who’s landing there. The
          map is live and can change at any time.
        </p>

        <div className="map-shell">
          <div className="map-header">
            <div className="live-indicator">
              <span className="live-dot" />
              Live now • updated {lastUpdated}
            </div>
            <div className="map-controls">
              <input
                type="text"
                value={displayName}
                onChange={(event) => setDisplayName(event.target.value)}
                placeholder="Display name"
              />
              <label>
                <input
                  type="checkbox"
                  checked={isVerified}
                  onChange={(event) => setIsVerified(event.target.checked)}
                />
                Verified user
              </label>
            </div>
          </div>

          <div className="map-canvas">
            {!apiKey ? (
              <div className="map-overlay">
                <p>Add `NEXT_PUBLIC_GOOGLE_MAPS_API_KEY` to load the map.</p>
              </div>
            ) : null}
            <div ref={mapRef} className="map-instance" />
          </div>

          <div className="map-footer">
            <div className="list-card">
              <h3>Drop zones</h3>
              <ul>
                {groupsWithLabels.map((group) => (
                  <li key={group.key}>
                    <button
                      type="button"
                      className="btn-secondary"
                      onClick={() => setSelectedGroup(group.key)}
                    >
                      {group.label} • {group.pins.length} landing
                      {group.pins.length === 1 ? "" : "s"}
                    </button>
                  </li>
                ))}
              </ul>
            </div>
            <div className="list-card">
              <h3>People landing here</h3>
              {selectedZone ? (
                <ul>
                  {selectedZone.pins.map((pin) => (
                    <li key={pin.id}>
                      {pin.name}
                      {pin.verified ? <span className="tag">verified</span> : null}
                    </li>
                  ))}
                </ul>
              ) : (
                <p>No zone selected yet.</p>
              )}
              {message ? <p>{message}</p> : null}
            </div>
          </div>
        </div>
      </section>
    </div>
  );
}
