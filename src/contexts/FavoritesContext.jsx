import { useState, useEffect } from "react";
import FavoritesContext from "./favoritesContextValue.js";

function getInitialFavorites() {
  try {
    const saved = localStorage.getItem("pokedex-favorites");
    if (saved) {
      return JSON.parse(saved);
    }
  } catch {
    /* ignore */
  }
  return [];
}

export default function FavoritesProvider({ children }) {
  const [favorites, setFavorites] = useState(getInitialFavorites);

  useEffect(() => {
    try {
      localStorage.setItem("pokedex-favorites", JSON.stringify(favorites));
    } catch {
      /* ignore */
    }
  }, [favorites]);

  function toggleFavorite(name) {
    setFavorites((prev) => {
      if (prev.includes(name)) {
        return prev.filter((f) => f !== name);
      }
      return [...prev, name];
    });
  }

  function isFavorite(name) {
    return favorites.includes(name);
  }

  return (
    <FavoritesContext.Provider value={{ favorites, toggleFavorite, isFavorite }}>
      {children}
    </FavoritesContext.Provider>
  );
}
