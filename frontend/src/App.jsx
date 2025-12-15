import { Route, Routes } from 'react-router-dom';
import './App.css';
import Navbar from './components/Navbar';
import AllRecipes from './pages/AllRecipes';
import RecipeDetail from './pages/RecipeDetail';
import Home from './pages/Home';
import SavedRecipes from './pages/SavedRecipes';

function App() {
  return (
    <div className="min-h-screen bg-slate-100">
      <Navbar />
      <main className="mx-auto max-w-6xl px-4 pb-12 pt-6 md:px-6">
        <Routes>
          <Route path="/" element={<Home />} />
          <Route path="/recetas" element={<AllRecipes />} />
          <Route path="/receta/:id" element={<RecipeDetail />} />
          <Route path="/favoritas" element={<SavedRecipes />} />
        </Routes>
      </main>
      <footer className="border-t border-sand-200 bg-white/80">
        <div className="mx-auto flex max-w-6xl flex-wrap items-center justify-between gap-2 px-4 py-4 text-xs text-slate-600 md:px-6">
          <span>Frontend II · Sumativa 3 · REST + GraphQL</span>
          <span className="text-brand-700">Recetas mock locales (o API en VITE_API_URL)</span>
        </div>
      </footer>
    </div>
  );
}

export default App;
