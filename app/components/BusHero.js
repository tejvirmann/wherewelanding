"use client";

import dynamic from "next/dynamic";

const BattleBusScene = dynamic(() => import("./BattleBusScene"), {
  ssr: false,
  loading: () => <div className="bus-canvas-wrap" style={{ background: "#f5f6fb" }} />
});

export default function BusHero({ isAuthed }) {
  return (
    <div className="bus-hero-section">
      <div className="bus-hero-text">
        <h1 className="hero-headline">where we landing?</h1>
        <p className="hero-sub">friend matchmaking for madison, wi</p>
        {isAuthed
          ? <a href="/apply" className="btn-primary">apply to join</a>
          : <a href="/auth/signin?next=/apply" className="btn-primary">sign in to apply</a>
        }
      </div>
      <div className="bus-canvas-wrap">
        <BattleBusScene />
      </div>
    </div>
  );
}
