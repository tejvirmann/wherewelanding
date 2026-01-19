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
    <button type="button" className="theme-toggle" onClick={toggleTheme}>
      {theme === "light" ? "Dark mode" : "Light mode"}
    </button>
  );
}
