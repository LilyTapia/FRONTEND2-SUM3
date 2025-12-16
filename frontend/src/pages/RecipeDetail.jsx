import { useEffect, useMemo, useState } from 'react';
import { Link, useParams } from 'react-router-dom';
import { fetchRecipeDetailGraphQL, fetchRecipeDetailREST } from '../api/recipes';
import { useRecipes } from '../context/RecipeContext';
import { getRecipeImage } from '../utils/recipeMedia';

export default function RecipeDetail() {
  const { id } = useParams();
  const { recipes, isSaved, toggleSaved } = useRecipes();
  const [recipe, setRecipe] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  const baseInfo = useMemo(() => recipes.find((item) => String(item.id) === String(id)), [recipes, id]);

  useEffect(() => {
    // Evita actualizar estado si el componente se desmonta mientras la request sigue viva.
    let active = true;

    const loadDetail = async () => {
      setLoading(true);
      setError('');
      try {
        // Primero intentamos el GraphQL enriquecido; si falla, retrocedemos a la REST/mock.
        const detail = await fetchRecipeDetailGraphQL(id);
        if (active) setRecipe(detail);
      } catch (graphError) {
        console.error('Error GraphQL, intentando REST', graphError);
        try {
          const detail = await fetchRecipeDetailREST(id);
          if (active) setRecipe(detail);
        } catch (restError) {
          console.error('Error REST', restError);
          if (active) setError('No pudimos cargar el detalle de esta receta.');
        }
      } finally {
        if (active) setLoading(false);
      }
    };

    loadDetail();
    return () => {
      active = false;
    };
  }, [id]);

  const detail = recipe || baseInfo;

  if (loading) {
    return (
      <div className="rounded-xl border border-sand-200 bg-white/90 p-5 text-sm text-slate-700 shadow-soft">
        Cargando detalle...
      </div>
    );
  }

  if (error || !detail) {
    return (
      <div className="rounded-xl border border-red-200 bg-red-50 p-5 text-sm shadow-soft">
        <p className="font-semibold text-red-700">{error || 'No encontramos esta receta.'}</p>
        <Link className="mt-3 inline-flex items-center text-brand-700 hover:underline" to="/recetas">
          Volver al recetario
        </Link>
      </div>
    );
  }

  const saved = isSaved(detail.id);
  const heroImage = getRecipeImage(detail);

  return (
    <section className="rounded-3xl bg-white shadow-xl shadow-slate-900/10 ring-1 ring-slate-200">
      <div className="relative h-64 w-full overflow-hidden rounded-t-3xl bg-slate-200 sm:h-96">
        <img src={heroImage} alt={detail.title} className="h-full w-full object-cover" />
        <div className="absolute inset-0 bg-gradient-to-t from-black/40 to-transparent" aria-hidden />
        <Link
          className="absolute left-4 top-4 inline-flex items-center gap-2 rounded-full bg-white/90 px-3 py-2 text-sm font-semibold text-slate-800 shadow"
          to="/recetas"
        >
          ← Volver atrás
        </Link>
        <span className="absolute right-4 top-4 rounded-full bg-white/90 px-3 py-1 text-xs font-semibold uppercase text-brand-800 shadow">
          {detail.category}
        </span>
      </div>

      <div className="space-y-5 px-6 pb-8 pt-6 sm:px-8">
        <div className="flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
          <div>
            <p className="text-sm font-semibold text-brand-600">{detail.difficulty} · {detail.cookTime} min</p>
            <h1 className="text-3xl font-black text-slate-950">{detail.title}</h1>
            <p className="text-sm text-slate-600">Ingredientes e instrucciones obtenidos vía GraphQL mock.</p>
          </div>
          <button
            type="button"
            onClick={() => toggleSaved(detail)}
            className={`inline-flex items-center justify-center gap-2 rounded-full px-5 py-3 text-sm font-semibold transition ${
              saved
                ? 'bg-coral text-white shadow-md shadow-brand-800/30'
                : 'bg-gradient-to-r from-brand-500 via-brand-400 to-brand-600 text-white shadow-md shadow-brand-800/30'
            }`}
          >
            {saved ? 'Quitar de guardadas' : 'Guardar receta'}
          </button>
        </div>

        <div className="grid gap-3 sm:grid-cols-3">
          <div className="rounded-2xl border border-slate-200 bg-white px-4 py-3">
            <span className="text-xs font-semibold uppercase text-slate-500">Tiempo</span>
            <p className="mt-1 text-lg font-semibold text-slate-950">{detail.cookTime} minutos</p>
          </div>
          <div className="rounded-2xl border border-slate-200 bg-white px-4 py-3">
            <span className="text-xs font-semibold uppercase text-slate-500">Porciones</span>
            <p className="mt-1 text-lg font-semibold text-slate-950">{detail.servings || '—'}</p>
          </div>
          <div className="rounded-2xl border border-slate-200 bg-white px-4 py-3">
            <span className="text-xs font-semibold uppercase text-slate-500">Dificultad</span>
            <p className="mt-1 text-sm font-semibold text-slate-900">{detail.difficulty || '—'}</p>
          </div>
        </div>

        <p className="text-base leading-relaxed text-slate-700">
          {detail.shortDescription || 'Esta receta utiliza la API para cargar la descripción completa.'}
        </p>

        <div className="grid gap-4 lg:grid-cols-2">
          <div className="rounded-2xl border border-slate-200 bg-slate-50 px-4 py-4">
            <h2 className="text-lg font-semibold text-slate-900">Ingredientes</h2>
            <ul className="mt-2 space-y-2 text-sm text-slate-700">
              {(detail.ingredients || []).map((item, idx) => (
                <li key={idx} className="flex items-start gap-2">
                  <span className="mt-[6px] h-1.5 w-1.5 rounded-full bg-brand-500" aria-hidden />
                  <span>{item}</span>
                </li>
              ))}
              {(!detail.ingredients || detail.ingredients.length === 0) && (
                <li className="text-sm text-slate-500">Esta receta aún no carga ingredientes.</li>
              )}
            </ul>
          </div>

          <div className="rounded-2xl border border-slate-200 bg-white px-4 py-4">
            <h2 className="text-lg font-semibold text-slate-900">Preparación</h2>
            <ol className="mt-2 space-y-3 text-sm text-slate-700">
              {(detail.steps || []).map((step, idx) => (
                <li key={idx} className="flex gap-3">
                  <span className="mt-1 grid h-6 w-6 place-items-center rounded-full bg-brand-100 text-xs font-bold text-brand-700">
                    {idx + 1}
                  </span>
                  <span>{step}</span>
                </li>
              ))}
              {(!detail.steps || detail.steps.length === 0) && (
                <li className="text-sm text-slate-500">Aún no hay pasos de preparación disponibles.</li>
              )}
            </ol>
          </div>
        </div>
      </div>
    </section>
  );
}
