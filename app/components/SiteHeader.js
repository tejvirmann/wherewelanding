"use client";

import ThemeToggle from "./ThemeToggle";
import LocationSelector from "./LocationSelector";
import { useLocation } from "../contexts/LocationContext";

const CITY_SLUG = {
  "Madison, WI": "madison-wi",
  "Milwaukee, WI": "milwaukee-wi"
};

export default function SiteHeader({ active = "home", showLocation = true }) {
  const { location } = useLocation();
  const citySlug = CITY_SLUG[location] || "madison-wi";

  return (
    <header className="topbar">
      <div className="logo-link">
        <div className="logo-text">
          <a href="/" className="logo-title">where we landing?</a>
          <a href={`/squads/${citySlug}`} className="logo-subtitle">Find a squad.</a>
        </div>
      </div>
      <nav className="nav-minimal">
        <a className={active === "home" ? "active" : ""} href="/">
          home
        </a>
        <a className={active === "squads" ? "active" : ""} href={`/squads/${citySlug}`}>
          squads
        </a>
        <a className={active === "mission" ? "active" : ""} href="/mission">
          mission
        </a>
        <a className={active === "contact" ? "active" : ""} href="/contact">
          contact
        </a>
      </nav>
      <div className="topbar-actions">
        {showLocation && <LocationSelector />}
        <ThemeToggle />
      </div>
    </header>
  );
}
