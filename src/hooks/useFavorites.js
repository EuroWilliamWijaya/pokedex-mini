import { useContext } from "react";
import FavoritesContext from "../contexts/favoritesContextValue.js";

export function useFavorites() {
  const ctx = useContext(FavoritesContext);
  if (!ctx) {
    throw new Error("useFavorites must be used within a FavoritesProvider");
  }
  return ctx;
}
