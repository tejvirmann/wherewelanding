"use client";

import { useState, useEffect, useRef } from "react";
import { useLocation } from "../contexts/LocationContext";

const CITIES = [
  "Madison, WI",
  "Chicago, IL",
  "Milwaukee, WI",
  "Minneapolis, MN",
  "Austin, TX"
];

export default function LocationSelector() {
  const { location, updateLocation } = useLocation();
  const [searchTerm, setSearchTerm] = useState("");
  const [isOpen, setIsOpen] = useState(false);
  const dropdownRef = useRef(null);

  const filteredCities = CITIES.filter((city) =>
    city.toLowerCase().includes(searchTerm.toLowerCase())
  );

  const handleSelect = (city) => {
    updateLocation(city);
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
