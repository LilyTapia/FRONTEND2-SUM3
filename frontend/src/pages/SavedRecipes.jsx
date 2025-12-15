import { Link } from 'react-router-dom';
import { useRecipes } from '../context/RecipeContext';
import { getRecipeImage } from '../utils/recipeMedia';

export default function SavedRecipes() {
  const { savedRecipes, toggleSaved } = useRecipes();

  return (
    <section className="flex flex-col gap-4">
      <div className="flex flex-col gap-2 sm:flex-row sm:items-center sm:justify-between">
        <div>
          <p className="text-xs font-semibold uppercase tracking-[0.2em] text-brand-600">Tus recetas</p>
          <h2 className="text-3xl font-black text-slate-950">Favoritas guardadas</h2>
          <p className="text-sm text-slate-600">LocalStorage mantiene tu recetario personal en esta demo.</p>
        </div>
        <Link
          to="/recetas"
          className="inline-flex items-center gap-2 rounded-full bg-brand-500 px-4 py-2 text-sm font-semibold text-white shadow-md shadow-brand-800/30 transition hover:-translate-y-0.5"
        >
          Buscar más recetas
        </Link>
      </div>

      {savedRecipes.length === 0 ? (
        <div className="rounded-2xl border border-dashed border-slate-200 bg-white p-6 text-sm text-slate-600 shadow-lg shadow-slate-900/5">
          Aún no tienes recetas guardadas. Agrega tus favoritas desde el detalle de cada preparación.
        </div>
      ) : (
        <div className="space-y-4">
          {savedRecipes.map((recipe) => {
            const image = getRecipeImage(recipe);
            return (
              <article
                key={recipe.id}
                className="flex flex-col gap-4 rounded-3xl bg-white p-4 shadow-lg shadow-slate-900/5 ring-1 ring-slate-200 sm:flex-row sm:items-center"
              >
                <div className="flex items-center gap-3">
                  <div className="h-20 w-20 overflow-hidden rounded-xl bg-slate-200">
                    <img src={image} alt={recipe.title} className="h-full w-full object-cover" />
                  </div>
                  <div>
                    <p className="text-xs font-semibold uppercase text-brand-600">{recipe.difficulty}</p>
                    <h3 className="text-xl font-bold text-slate-950">{recipe.title}</h3>
                    <p className="text-sm text-slate-600">{recipe.category} · {recipe.cookTime} min</p>
                  </div>
                </div>
                <div className="ml-auto flex items-center gap-3">
                  <Link
                    to={`/receta/${recipe.id}`}
                    className="rounded-full bg-gradient-to-r from-brand-500 via-brand-400 to-brand-600 px-4 py-2 text-sm font-semibold text-white shadow-md shadow-brand-900/20 transition hover:-translate-y-0.5"
                  >
                    Ver detalle
                  </Link>
                  <button
                    type="button"
                    onClick={() => toggleSaved(recipe)}
                    className="rounded-full bg-coral px-4 py-2 text-sm font-semibold text-white shadow-md shadow-brand-900/20 transition hover:-translate-y-0.5"
                  >
                    Quitar
                  </button>
                </div>
              </article>
            );
          })}
        </div>
      )}
    </section>
  );
}
