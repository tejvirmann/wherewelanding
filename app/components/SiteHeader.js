"use client";

import ThemeToggle from "./ThemeToggle";
import LocationSelector from "./LocationSelector";

export default function SiteHeader({ active = "home" }) {
  return (
    <header className="topbar">
      <a href="/" className="logo-link">
        <div className="logo-text">
          <p className="logo-title">where we landing?</p>
          <p className="logo-subtitle">Find a squad.</p>
        </div>
      </a>
      <nav className="nav-minimal">
        <a className={active === "home" ? "active" : ""} href="/">
          home
        </a>
        <a className={active === "squads" ? "active" : ""} href="/squads">
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
        <LocationSelector />
        <ThemeToggle />
      </div>
    </header>
  );
}
