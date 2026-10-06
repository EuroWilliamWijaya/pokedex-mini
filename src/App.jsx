import { HashRouter, Routes, Route } from "react-router-dom";
import ThemeProvider from "./contexts/ThemeContext.jsx";
import FavoritesProvider from "./contexts/FavoritesContext.jsx";
import Layout from "./components/Layout.jsx";
import ListPage from "./pages/ListPage.jsx";
import DetailPage from "./pages/DetailPage.jsx";
import NotFoundPage from "./pages/NotFoundPage.jsx";

function App() {
  return (
    <ThemeProvider>
      <FavoritesProvider>
        <HashRouter>
          <Routes>
            <Route element={<Layout />}>
              <Route path="/" element={<ListPage />} />
              <Route path="/pokemon/:name" element={<DetailPage />} />
              <Route path="*" element={<NotFoundPage />} />
            </Route>
          </Routes>
        </HashRouter>
      </FavoritesProvider>
    </ThemeProvider>
  );
}

export default App;