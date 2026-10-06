import { useState, useEffect } from "react";
import { API_BASE_URL, PAGE_SIZE } from "../config.js";
import PokemonCard from "./PokemonCard.jsx";
import SkeletonCard from "./SkeletonCard.jsx";

function PokemonList() {
  const [pokemons, setPokemons] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  const [isLoadingMore, setIsLoadingMore] = useState(false);
  const [error, setError] = useState(null);
  const [totalCount, setTotalCount] = useState(0);
  const [retryKey, setRetryKey] = useState(0);

  /* Initial load (and retry) */
  useEffect(() => {
    let isCurrent = true;

    async function load() {
      setIsLoading(true);
      setError(null);

      try {
        const response = await fetch(
          `${API_BASE_URL}/pokemon?limit=${PAGE_SIZE}&offset=0`
        );
        if (!response.ok) {
          throw new Error(`Server responded with status ${response.status}`);
        }
        const data = await response.json();
        if (isCurrent) {
          setTotalCount(data.count);
          setPokemons(data.results);
        }
      } catch (err) {
        if (isCurrent) setError(err.message);
      } finally {
        if (isCurrent) setIsLoading(false);
      }
    }

    load();
    return () => { isCurrent = false; };
  }, [retryKey]);

  async function handleLoadMore() {
    setIsLoadingMore(true);
    setError(null);

    try {
      const response = await fetch(
        `${API_BASE_URL}/pokemon?limit=${PAGE_SIZE}&offset=${pokemons.length}`
      );
      if (!response.ok) {
        throw new Error(`Server responded with status ${response.status}`);
      }
      const data = await response.json();
      setTotalCount(data.count);
      setPokemons((prev) => [...prev, ...data.results]);
    } catch (err) {
      setError(err.message);
    } finally {
      setIsLoadingMore(false);
    }
  }

  function handleRetry() {
    setPokemons([]);
    setRetryKey((k) => k + 1);
  }

  if (isLoading) {
    return (
      <ul className="pokemon-list" aria-label="Loading Pokémon">
        {Array.from({ length: PAGE_SIZE }, (_, i) => (
          <SkeletonCard key={i} />
        ))}
      </ul>
    );
  }

  if (error && pokemons.length === 0) {
    return (
      <div className="error-state">
        <p className="error-state-message">Couldn&apos;t load the list: {error}</p>
        <button className="load-more-button" onClick={handleRetry}>
          Try again
        </button>
      </div>
    );
  }

  const hasMore = pokemons.length < totalCount;

  return (
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

      {hasMore && !isLoadingMore && (
        <div className="load-more-wrapper">
          <button className="load-more-button" onClick={handleLoadMore}>
            Load more Pokémon
          </button>
        </div>
      )}
    </>
  );
}

export default PokemonList;