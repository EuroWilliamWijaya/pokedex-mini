import { useState, useEffect, useRef } from "react";
import { useNavigate } from "react-router-dom";
import { API_BASE_URL } from "../config.js";
import { cachedFetch } from "../utils.js";

function SearchForm() {
  const [query, setQuery] = useState("");
  const [allNames, setAllNames] = useState([]);
  const [suggestions, setSuggestions] = useState([]);
  const [isOpen, setIsOpen] = useState(false);
  const [highlightedIndex, setHighlightedIndex] = useState(-1);
  const [error, setError] = useState(null);
  
  const navigate = useNavigate();
  const wrapperRef = useRef(null);

  // Fetch full list on mount and cache it via cachedFetch
  useEffect(() => {
    cachedFetch(`${API_BASE_URL}/pokemon?limit=2000`)
      .then((data) => setAllNames(data.results.map((p) => p.name)))
      .catch(() => {
        /* silently fail, autocomplete just won't show */
      });
  }, []);

  // Debounce search logic
  useEffect(() => {
    const timer = setTimeout(() => {
      const trimmed = query.trim().toLowerCase();
      if (!trimmed) {
        setSuggestions([]);
        setIsOpen(false);
        return;
      }

      const matches = allNames
        .filter((name) => name.includes(trimmed))
        .slice(0, 6); // Up to 6 matching names
      setSuggestions(matches);
      setIsOpen(true);
      setHighlightedIndex(-1);
    }, 250);

    return () => clearTimeout(timer);
  }, [query, allNames]);

  // Close dropdown when clicking outside
  useEffect(() => {
    function handleClickOutside(event) {
      if (wrapperRef.current && !wrapperRef.current.contains(event.target)) {
        setIsOpen(false);
      }
    }
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  function handleNavigate(name) {
    if (!name) return;
    setError(null);
    setIsOpen(false);
    setQuery("");
    navigate(`/pokemon/${name}`);
  }

  function handleSubmit(event) {
    event.preventDefault();
    const trimmed = query.trim().toLowerCase();
    
    if (!trimmed) {
      setError("Type a Pokémon name first.");
      return;
    }
    
    if (highlightedIndex >= 0 && highlightedIndex < suggestions.length) {
      handleNavigate(suggestions[highlightedIndex]);
    } else {
      // Navigate to exact query; DetailPage will handle 404 if it doesn't exist
      handleNavigate(trimmed);
    }
  }

  function handleKeyDown(e) {
    if (!isOpen) return;

    if (e.key === "ArrowDown") {
      e.preventDefault();
      setHighlightedIndex((prev) => Math.min(prev + 1, suggestions.length - 1));
    } else if (e.key === "ArrowUp") {
      e.preventDefault();
      setHighlightedIndex((prev) => Math.max(prev - 1, -1));
    } else if (e.key === "Escape") {
      setIsOpen(false);
    }
  }

  return (
    <div className="search" ref={wrapperRef}>
      <form onSubmit={handleSubmit} className="search-form">
        <input
          type="text"
          value={query}
          onChange={(event) => setQuery(event.target.value)}
          onKeyDown={handleKeyDown}
          onFocus={() => {
            if (query.trim()) setIsOpen(true);
          }}
          placeholder="Search a Pokémon by name…"
          className="search-input"
          role="combobox"
          aria-expanded={isOpen}
          aria-autocomplete="list"
          aria-controls="search-suggestions"
        />
        <button type="submit" className="search-button">
          Search
        </button>
      </form>

      {isOpen && (
        <ul className="search-suggestions" id="search-suggestions" role="listbox">
          {suggestions.length > 0 ? (
            suggestions.map((name, index) => (
              <li
                key={name}
                role="option"
                aria-selected={index === highlightedIndex}
                className={`search-suggestion-item ${
                  index === highlightedIndex ? "highlighted" : ""
                }`}
                onClick={() => handleNavigate(name)}
                onMouseEnter={() => setHighlightedIndex(index)}
              >
                {name}
              </li>
            ))
          ) : (
            <li className="search-suggestion-empty">No Pokémon found.</li>
          )}
        </ul>
      )}

      {error && (
        <p className="status-error" style={{ marginTop: "var(--space-sm)" }}>
          {error}
        </p>
      )}
    </div>
  );
}

export default SearchForm;