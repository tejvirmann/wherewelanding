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
        {user && <a className={active === "map" ? "active" : ""} href="/map">map</a>}
        {user?.role === "admin" && (
          <a className={active === "admin" ? "active" : ""} href="/admin">admin</a>
        )}
      </nav>

      <div className="topbar-actions">
        <a href="/apply" className={`btn-ghost ${active === "apply" ? "btn-ghost--active" : ""}`}>apply</a>
        {user ? (
          <>
            <a href="/profile" className={`btn-ghost ${active === "profile" ? "btn-ghost--active" : ""}`}>account</a>
            <button className="btn-ghost" onClick={signOut}>sign out</button>
          </>
        ) : (
          <a href="/auth/signin" className="btn-ghost">sign in</a>
        )}
      </div>
    </header>
  );
}
