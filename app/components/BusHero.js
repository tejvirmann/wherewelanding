"use client";

import dynamic from "next/dynamic";

const BattleBusScene = dynamic(() => import("./BattleBusScene"), {
  ssr: false,
  loading: () => <div className="bus-canvas-wrap" style={{ background: "#f5f6fb" }} />
});

export default function BusHero({ appStatus }) {
  const cta = appStatus === "approved"
    ? { label: "view the map", href: "/map" }
    : appStatus === "pending"
    ? { label: "view your application", href: "/apply" }
    : appStatus === "guest"
    ? { label: "sign in to apply", href: "/auth/signin?next=/apply" }
    : { label: "apply to join", href: "/apply" };

  const sub = appStatus === "approved"
    ? "you're in the pool. we're finding your squad."
    : appStatus === "pending"
    ? "your application is under review."
    : "friend matchmaking for madison, wi — find your squad.";

  return (
    <div className="bus-hero-section">
      <div className="bus-hero-text">
        <h1 className="hero-headline">where we landing?</h1>
        <p className="hero-sub">{sub}</p>
        <a href={cta.href} className="btn-primary">{cta.label}</a>
      </div>
      <div className="bus-canvas-wrap">
        <BattleBusScene />
      </div>
    </div>
  );
}
