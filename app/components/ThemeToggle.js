"use client";

import { useEffect, useState } from "react";

const getStoredTheme = () => {
  if (typeof window === "undefined") return "light";
  return localStorage.getItem("wwl-theme") || "light";
};

export default function ThemeToggle() {
  const [theme, setTheme] = useState("light");

  useEffect(() => {
    const stored = getStoredTheme();
    setTheme(stored);
    document.documentElement.dataset.theme = stored;
  }, []);

  const toggleTheme = () => {
    const next = theme === "light" ? "dark" : "light";
    setTheme(next);
    localStorage.setItem("wwl-theme", next);
    document.documentElement.dataset.theme = next;
    window.dispatchEvent(new CustomEvent("theme-change", { detail: next }));
  };

  return (
    <button 
      type="button" 
      className="theme-toggle" 
      onClick={toggleTheme}
      title={theme === "light" ? "Switch to dark mode" : "Switch to light mode"}
      aria-label={theme === "light" ? "Switch to dark mode" : "Switch to light mode"}
    >
      {theme === "light" ? (
        <svg width="20" height="20" viewBox="0 0 20 20" fill="none" stroke="currentColor">
          <circle cx="10" cy="10" r="3" strokeWidth="2"/>
          <line x1="10" y1="1" x2="10" y2="3" strokeWidth="2" strokeLinecap="round"/>
          <line x1="10" y1="17" x2="10" y2="19" strokeWidth="2" strokeLinecap="round"/>
          <line x1="3.34" y1="3.34" x2="4.75" y2="4.75" strokeWidth="2" strokeLinecap="round"/>
          <line x1="15.25" y1="15.25" x2="16.66" y2="16.66" strokeWidth="2" strokeLinecap="round"/>
          <line x1="1" y1="10" x2="3" y2="10" strokeWidth="2" strokeLinecap="round"/>
          <line x1="17" y1="10" x2="19" y2="10" strokeWidth="2" strokeLinecap="round"/>
          <line x1="3.34" y1="16.66" x2="4.75" y2="15.25" strokeWidth="2" strokeLinecap="round"/>
          <line x1="15.25" y1="4.75" x2="16.66" y2="3.34" strokeWidth="2" strokeLinecap="round"/>
        </svg>
      ) : (
        <svg width="20" height="20" viewBox="0 0 20 20" fill="currentColor">
          <path d="M17.293 13.293A8 8 0 016.707 2.707a8.001 8.001 0 1010.586 10.586z"/>
        </svg>
      )}
    </button>
  );
}
