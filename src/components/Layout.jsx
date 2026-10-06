import { Outlet, Link } from "react-router-dom";
import ThemeToggle from "./ThemeToggle.jsx";

function Layout() {
  return (
    <div className="app">
      <header className="app-header">
        <div className="header-brand">
          <Link to="/" className="app-title-link">
            <h1>PokéDex Mini</h1>
          </Link>
          <p className="header-tagline">Browse, search &amp; explore Pokémon</p>
        </div>
        <ThemeToggle />
      </header>

      <main>
        <Outlet />
      </main>

      <footer className="app-footer">
        Data provided by{" "}
        <a href="https://pokeapi.co/" target="_blank" rel="noopener noreferrer">
          PokéAPI
        </a>
      </footer>
    </div>
  );
}

export default Layout;