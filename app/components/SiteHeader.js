"use client";

import { createClient } from "@/lib/supabase/client";
import { useRouter } from "next/navigation";

export default function SiteHeader({ active, user }) {
  const router = useRouter();

  async function signOut() {
    const supabase = createClient();
    await supabase.auth.signOut();
    router.push("/");
    router.refresh();
  }

  const applyLabel = user?.appStatus === "approved"
    ? "profile"
    : user?.appStatus === "pending"
    ? "application"
    : "apply";

  const applyHref = user?.appStatus === "approved"
    ? "/profile"
    : "/apply";

  return (
    <header className="topbar">
      <a href="/" className="logo-link">
        <div className="logo-text">
          <span className="logo-title">where we landing?</span>
          <span className="logo-subtitle">madison, wi</span>
        </div>
      </a>

      <nav className="nav-minimal">
        <a className={active === "about" ? "active" : ""} href="/about">about</a>
        <a className={active === "contact" ? "active" : ""} href="/contact">contact</a>
        {user && <a className={active === "map" ? "active" : ""} href="/map">map</a>}
        {user?.role === "admin" && (
          <a className={active === "admin" ? "active" : ""} href="/admin">admin</a>
        )}
      </nav>

      <div className="topbar-actions">
        <a
          href={applyHref}
          className={`btn-ghost ${(active === "apply" || active === "profile") ? "btn-ghost--active" : ""}`}
        >
          {applyLabel}
        </a>
        {user ? (
          <button className="btn-ghost" onClick={signOut}>sign out</button>
        ) : (
          <a href="/auth/signin" className="btn-ghost">sign in</a>
        )}
      </div>
    </header>
  );
}
