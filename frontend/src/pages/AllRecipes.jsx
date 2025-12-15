import { useMemo, useState } from 'react';
import { Link } from 'react-router-dom';
import RecipeCard from '../components/RecipeCard';
import { useRecipes } from '../context/RecipeContext';

export default function AllRecipes() {
  const { recipes, loading, error } = useRecipes();
  const [search, setSearch] = useState('');
  const [category, setCategory] = useState('Todas');

  const categories = useMemo(() => {
    const list = new Set(recipes.map((recipe) => recipe.category));
    return ['Todas', ...list];
  }, [recipes]);

  const filtered = useMemo(() => {
    return recipes.filter((recipe) => {
      const matchesCategory = category === 'Todas' || recipe.category === category;
      const text = `${recipe.title} ${recipe.shortDescription} ${recipe.difficulty}`.toLowerCase();
      const matchesSearch = text.includes(search.trim().toLowerCase());
      return matchesCategory && matchesSearch;
    });
  }, [recipes, category, search]);

  return (
    <div className="flex flex-col gap-6">
      <div className="rounded-3xl bg-white p-6 text-center shadow-lg shadow-slate-900/5">
        <p className="text-xs font-semibold uppercase tracking-[0.3em] text-brand-600">Recetario API REST</p>
        <h1 className="mt-2 text-3xl font-black text-slate-950">Explora por categoría y dificultad</h1>
        <p className="mt-2 text-sm text-slate-600">Listado consumido desde la API REST mock; el detalle se complementa con GraphQL.</p>

        <div className="mt-4 flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-center">
          <div className="flex flex-wrap justify-center gap-2">
            {categories.map((item) => (
              <button
                key={item}
                className={`rounded-full px-4 py-2 text-xs font-semibold transition ${
                  item === category
                    ? 'bg-brand-500 text-white shadow-md shadow-brand-800/30'
                    : 'border border-slate-200 bg-white text-slate-700 hover:border-brand-200'
                }`}
                onClick={() => setCategory(item)}
                type="button"
              >
                {item}
              </button>
            ))}
          </div>
          <div className="w-full sm:max-w-xs">
            <input
              type="search"
              placeholder="Buscar por nombre o dificultad"
              className="w-full rounded-xl border border-slate-200 bg-white px-4 py-2 text-sm text-slate-900 placeholder:text-slate-400 outline-none transition focus:border-brand-400 focus:ring-2 focus:ring-brand-100"
              value={search}
              onChange={(e) => setSearch(e.target.value)}
            />
          </div>
        </div>

        <Link
          to="/favoritas"
          className="mt-4 inline-flex items-center gap-2 rounded-full bg-gradient-to-r from-brand-500 via-brand-400 to-brand-600 px-4 py-2 text-sm font-semibold text-white shadow-md shadow-brand-900/20 transition hover:-translate-y-0.5"
        >
          Ver recetas guardadas →
        </Link>
      </div>

      {loading && <p className="text-sm text-slate-600">Cargando recetas desde la API...</p>}
      {error && (
        <p className="rounded-xl border border-red-200 bg-red-50 px-4 py-2 text-sm font-semibold text-red-700">{error}</p>
      )}

      {!loading && !error && (
        <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
          {filtered.map((recipe) => (
            <RecipeCard key={recipe.id} recipe={recipe} />
          ))}
          {filtered.length === 0 && (
            <p className="col-span-full rounded-xl border border-sand-200 bg-white px-4 py-3 text-sm text-slate-600">
              No hay recetas que coincidan con tus filtros.
            </p>
          )}
        </div>
      )}
    </div>
  );
}
