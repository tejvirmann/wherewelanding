"use client";

import { useState, useEffect, useRef } from "react";
import { useRouter, usePathname } from "next/navigation";
import { useLocation } from "../contexts/LocationContext";

const CITIES = [
  "Madison, WI",
  "Milwaukee, WI"
];

const CITY_SLUG = {
  "Madison, WI": "madison-wi",
  "Milwaukee, WI": "milwaukee-wi"
};

export default function LocationSelector() {
  const { location, updateLocation } = useLocation();
  const [searchTerm, setSearchTerm] = useState("");
  const [isOpen, setIsOpen] = useState(false);
  const dropdownRef = useRef(null);
  const router = useRouter();
  const pathname = usePathname();

  const filteredCities = CITIES.filter((city) =>
    city.toLowerCase().includes(searchTerm.toLowerCase())
  );

  const handleSelect = (city) => {
    updateLocation(city);
    const slug = CITY_SLUG[city] || "madison-wi";
    if (pathname.startsWith("/board/")) {
      router.push(`/board/${slug}`);
    } else if (pathname.startsWith("/squads/")) {
      router.push(`/squads/${slug}`);
    }
    setSearchTerm("");
    setIsOpen(false);
  };

  useEffect(() => {
    const handleClickOutside = (event) => {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target)) {
        setIsOpen(false);
        setSearchTerm("");
      }
    };

    if (isOpen) {
      document.addEventListener("mousedown", handleClickOutside);
    }

    return () => {
      document.removeEventListener("mousedown", handleClickOutside);
    };
  }, [isOpen]);

  return (
    <div className="location-selector" ref={dropdownRef}>
      <button
        type="button"
        className="location-selector-btn"
        onClick={() => setIsOpen(!isOpen)}
      >
        📍 {location}
      </button>
      {isOpen && (
        <div className="location-dropdown">
          <input
            type="text"
            className="location-search"
            placeholder="Search city or zipcode..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            autoFocus
          />
          <div className="location-list">
            {filteredCities.length > 0 ? (
              filteredCities.map((city) => (
                <button
                  key={city}
                  type="button"
                  className="location-option"
                  onClick={() => handleSelect(city)}
                >
                  {city}
                </button>
              ))
            ) : (
              <div className="location-empty">No cities found</div>
            )}
          </div>
        </div>
      )}
    </div>
  );
}
