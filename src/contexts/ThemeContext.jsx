import { useState, useEffect } from "react";
import ThemeContext from "./themeContextValue.js";

/**
 * Reads the saved theme from localStorage, falling back to the
 * user's OS preference, then to "light".
 */
function getInitialTheme() {
  try {
    const saved = localStorage.getItem("pokedex-theme");
    if (saved === "dark" || saved === "light") return saved;
  } catch {
    /* localStorage may be unavailable */
  }
  if (window.matchMedia?.("(prefers-color-scheme: dark)").matches) {
    return "dark";
  }
  return "light";
}

export default function ThemeProvider({ children }) {
  const [theme, setTheme] = useState(getInitialTheme);

  useEffect(() => {
    document.documentElement.setAttribute("data-theme", theme);
    try {
      localStorage.setItem("pokedex-theme", theme);
    } catch {
      /* ignore */
    }
  }, [theme]);

  function toggleTheme() {
    setTheme((prev) => (prev === "dark" ? "light" : "dark"));
  }

  return (
    <ThemeContext.Provider value={{ theme, toggleTheme }}>
      {children}
    </ThemeContext.Provider>
  );
}
