import { useState, useEffect } from "react";
import { Link } from "react-router-dom";
import { getIdFromUrl, getArtworkUrl, capitalize, fetchPokemonDetails, getTypeColor } from "../utils.js";
import TypeBadge from "./TypeBadge.jsx";
import FavoriteButton from "./FavoriteButton.jsx";

function PokemonCard({ name, url }) {
  const id = getIdFromUrl(url);
  const [details, setDetails] = useState(null);

  useEffect(() => {
    let isCurrent = true;

    fetchPokemonDetails(name)
      .then((data) => {
        if (isCurrent) setDetails(data);
      })
      .catch(() => {
        /* silently ignore — card still renders with basic info */
      });

    return () => {
      isCurrent = false;
    };
  }, [name]);

  const types = details ? details.types.map((t) => t.type.name) : [];
  const primaryType = types[0];
  const accentColor = primaryType ? getTypeColor(primaryType) : "var(--color-border)";

  return (
    <li className="pokemon-list-item" style={{ position: "relative" }}>
      <Link
        to={`/pokemon/${name}`}
        className="pokemon-card"
        style={{ "--card-accent": accentColor }}
      >
        <div className="pokemon-card-img-wrapper">
          <img
            className="pokemon-card-img"
            src={getArtworkUrl(id)}
            alt={name}
            width={120}
            height={120}
            loading="lazy"
          />
        </div>
        <span className="pokemon-id">#{id.padStart(3, "0")}</span>
        <span className="pokemon-name">{capitalize(name)}</span>
        {types.length > 0 && (
          <div className="pokemon-card-types">
            {types.map((t) => (
              <TypeBadge key={t} typeName={t} />
            ))}
          </div>
        )}
      </Link>
      <div className="pokemon-card-favorite">
        <FavoriteButton name={name} />
      </div>
    </li>
  );
}

export default PokemonCard;
