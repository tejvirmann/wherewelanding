"use client";

import dynamic from "next/dynamic";
import SiteHeader from "./components/SiteHeader";
import { useLocation } from "./contexts/LocationContext";

const BattleBusScene = dynamic(() => import("./components/BattleBusScene"), {
  ssr: false,
  loading: () => (
    <div className="bus-hero bus-3d--loading">Loading the Battle Bus...</div>
  )
});

const CITY_SLUG = {
  "Madison, WI": "madison-wi",
  "Milwaukee, WI": "milwaukee-wi"
};

export default function HomePage() {
  const { location } = useLocation();
  const citySlug = CITY_SLUG[location] || "madison-wi";

  return (
    <div className="page">
      <SiteHeader active="home" />

      <section className="cta-section">
        <div className="section">
          <div className="cta-grid">
            <a href={`/board/${citySlug}`} className="cta-card">
              <h3>add to community board</h3>
              <p>Share a question or start a discussion</p>
            </a>
            <a href={`/squads/${citySlug}`} className="cta-card">
              <h3>create squad</h3>
              <p>Start a new group in your city</p>
            </a>
            <a href={`/squads/${citySlug}`} className="cta-card">
              <h3>join squad</h3>
              <p>Sign into an existing group</p>
            </a>
          </div>
        </div>
      </section>

      <header className="hero hero--bus">
        <BattleBusScene />
      </header>

      <footer className="footer">
        © 2026 where we landing
      </footer>
    </div>
  );
}
