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

const MapPreview = dynamic(() => import("./components/MapPreview"), {
  ssr: false,
  loading: () => <div className="map-preview__loading">Loading map...</div>
});

export default function HomePage() {
  const { location } = useLocation();
  return (
    <div className="page">
      <SiteHeader active="home" />

      <section className="community-board">
        <div className="section">
          <h2>community board — {location}</h2>
          <p>Recent questions and discussions from the community.</p>
          <div className="board-posts">
            <a href="#" className="board-post">
              <span className="board-post-title">Looking for a running partner downtown</span>
              <span className="board-post-meta">2 hours ago</span>
            </a>
            <a href="#" className="board-post">
              <span className="board-post-title">Anyone interested in weekly coffee meetups?</span>
              <span className="board-post-meta">5 hours ago</span>
            </a>
            <a href="#" className="board-post">
              <span className="board-post-title">New to Madison, looking for friends</span>
              <span className="board-post-meta">1 day ago</span>
            </a>
          </div>
        </div>
      </section>

      <header className="hero hero--bus">
        <BattleBusScene />
      </header>

      <section id="community-map" className="section">
        <h2>community map — {location}</h2>
        <p>
          See where people are landing in real-time. Drop your pin and check who else is meeting up at the same spot.
        </p>
        <MapPreview />
        <div className="map-stats">
          <div className="map-stat-card">
            <span className="map-stat-label">Active members</span>
            <strong className="map-stat-value">18</strong>
            <span className="map-stat-hint">Last 2 weeks</span>
          </div>
          <div className="map-stat-card">
            <span className="map-stat-label">Total landings</span>
            <strong className="map-stat-value">47</strong>
            <span className="map-stat-hint">All time</span>
          </div>
          <div className="map-stat-card">
            <span className="map-stat-label">Most active zone</span>
            <strong className="map-stat-value">Downtown</strong>
            <span className="map-stat-hint">8 landings</span>
          </div>
        </div>
        <a className="btn-primary" href="#community-map">
          Try it now
        </a>
      </section>

      <section className="cta-section">
        <div className="section">
          <div className="cta-grid">
            <button className="cta-card" type="button">
              <h3>add to community board</h3>
              <p>Share a question or start a discussion</p>
            </button>
            <button className="cta-card" type="button">
              <h3>create squad</h3>
              <p>Start a new group in your city</p>
            </button>
            <button className="cta-card" type="button">
              <h3>join squad</h3>
              <p>Sign into an existing group</p>
            </button>
          </div>
        </div>
      </section>

      <footer className="footer">
        © 2026 where we landing
      </footer>
    </div>
  );
}
