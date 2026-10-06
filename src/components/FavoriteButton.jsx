import { useFavorites } from "../hooks/useFavorites.js";

function FavoriteButton({ name }) {
  const { isFavorite, toggleFavorite } = useFavorites();
  const fav = isFavorite(name);

  function handleClick(e) {
    e.preventDefault();
    e.stopPropagation();
    toggleFavorite(name);
  }

  return (
    <button
      className={`favorite-button ${fav ? "active" : ""}`}
      onClick={handleClick}
      aria-label={`${fav ? "Remove" : "Add"} ${name} to favorites`}
      title={`${fav ? "Remove" : "Add"} ${name} to favorites`}
    >
      {fav ? "❤️" : "🤍"}
    </button>
  );
}

export default FavoriteButton;
