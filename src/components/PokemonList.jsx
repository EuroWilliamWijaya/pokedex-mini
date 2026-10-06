import { useState, useEffect } from "react";
import { API_BASE_URL, PAGE_SIZE } from "../config.js";
import { cachedFetch } from "../utils.js";
import PokemonCard from "./PokemonCard.jsx";
import SkeletonCard from "./SkeletonCard.jsx";
import TypeFilter from "./TypeFilter.jsx";
import { useFavorites } from "../hooks/useFavorites.js";

function PokemonList() {
  const [pokemons, setPokemons] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  const [isLoadingMore, setIsLoadingMore] = useState(false);
  const [error, setError] = useState(null);
  const [totalCount, setTotalCount] = useState(0);
  const [activeType, setActiveType] = useState("all");
  const [showFavorites, setShowFavorites] = useState(false);
  const [filteredListCache, setFilteredListCache] = useState(null); // Stores the full unpaginated list

  const { favorites } = useFavorites();

  useEffect(() => {
    let isCurrent = true;

    async function load() {
      setIsLoading(true);
      setError(null);

      try {
        if (showFavorites) {
          let baseList = [];
          if (activeType === "all") {
            // Need the full list to get URLs for favorites
            const data = await cachedFetch(`${API_BASE_URL}/pokemon?limit=2000`);
            baseList = data.results;
          } else {
            const data = await cachedFetch(`${API_BASE_URL}/type/${activeType}`);
            baseList = data.pokemon.map((p) => p.pokemon);
          }
          
          const favList = baseList.filter(p => favorites.includes(p.name));
          if (isCurrent) {
            setFilteredListCache(favList);
            setTotalCount(favList.length);
            setPokemons(favList.slice(0, PAGE_SIZE));
          }
        } else if (activeType === "all") {
          setFilteredListCache(null);
          const data = await cachedFetch(
            `${API_BASE_URL}/pokemon?limit=${PAGE_SIZE}&offset=0`
          );
          if (isCurrent) {
            setTotalCount(data.count);
            setPokemons(data.results);
          }
        } else {
          // Fetch all pokemon of the active type
          const data = await cachedFetch(`${API_BASE_URL}/type/${activeType}`);
          if (isCurrent) {
            const fullList = data.pokemon.map((p) => p.pokemon);
            setFilteredListCache(fullList);
            setTotalCount(fullList.length);
            setPokemons(fullList.slice(0, PAGE_SIZE));
          }
        }
      } catch (err) {
        if (isCurrent) setError(err.message);
      } finally {
        if (isCurrent) setIsLoading(false);
      }
    }

    load();
    return () => {
      isCurrent = false;
    };
  }, [activeType, showFavorites, favorites]);

  async function handleLoadMore() {
    setIsLoadingMore(true);
    setError(null);

    try {
      if (!showFavorites && activeType === "all") {
        const data = await cachedFetch(
          `${API_BASE_URL}/pokemon?limit=${PAGE_SIZE}&offset=${pokemons.length}`
        );
        setTotalCount(data.count);
        setPokemons((prev) => [...prev, ...data.results]);
      } else {
        // We already have the full list in memory for the active type/favorites
        const nextBatch = filteredListCache.slice(
          pokemons.length,
          pokemons.length + PAGE_SIZE
        );
        setPokemons((prev) => [...prev, ...nextBatch]);
      }
    } catch (err) {
      setError(err.message);
    } finally {
      setIsLoadingMore(false);
    }
  }

  function handleRetry() {
    setActiveType((prev) => prev); 
  }

  return (
    <>
      <TypeFilter 
        activeType={activeType} 
        onTypeSelect={setActiveType}
        showFavorites={showFavorites}
        onToggleFavorites={() => setShowFavorites(!showFavorites)}
        favoritesCount={favorites.length}
      />

      {isLoading ? (
        <ul className="pokemon-list" aria-label="Loading Pokémon">
          {Array.from({ length: PAGE_SIZE }, (_, i) => (
            <SkeletonCard key={i} />
          ))}
        </ul>
      ) : error && pokemons.length === 0 ? (
        <div className="error-state">
          <p className="error-state-message">Couldn&apos;t load the list: {error}</p>
          <button className="load-more-button" onClick={handleRetry}>
            Try again
          </button>
        </div>
      ) : (
        <>
          <ul className="pokemon-list">
            {pokemons.map((pokemon) => (
              <PokemonCard key={pokemon.name} name={pokemon.name} url={pokemon.url} />
            ))}
            {isLoadingMore &&
              Array.from({ length: PAGE_SIZE }, (_, i) => (
                <SkeletonCard key={`skel-${i}`} />
              ))}
          </ul>

          {error && pokemons.length > 0 && (
            <div className="error-state">
              <p className="error-state-message">{error}</p>
            </div>
          )}

          {pokemons.length < totalCount && !isLoadingMore && (
            <div className="load-more-wrapper">
              <button className="load-more-button" onClick={handleLoadMore}>
                Load more Pokémon
              </button>
            </div>
          )}
          
          {!isLoading && !error && pokemons.length === 0 && (
            <div className="status">
              <p>No Pokémon found.</p>
            </div>
          )}
        </>
      )}
    </>
  );
}

export default PokemonList;