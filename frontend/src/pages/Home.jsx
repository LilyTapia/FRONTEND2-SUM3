import { Link } from 'react-router-dom';
import RecipeCard from '../components/RecipeCard';
import { useRecipes } from '../context/RecipeContext';

function Pill({ label, value }) {
  return (
    <div className="flex flex-col rounded-2xl border border-white/30 bg-white/20 p-4 text-white shadow-inner backdrop-blur">
      <span className="text-xs font-semibold uppercase">{label}</span>
      <span className="text-xl font-black leading-tight sm:text-2xl">{value}</span>
    </div>
  );
}

export default function Home() {
  const { recipes, loading, stats } = useRecipes();
  const featured = [...recipes].slice(0, 3);
  const topCategory = Object.entries(stats.byCategory || {})
    .sort(([, a], [, b]) => b - a)
    .map(([key]) => key)
    .slice(0, 2)
    .join(' · ');
  const topDifficulty = Object.entries(stats.byDifficulty || {})
    .sort(([, a], [, b]) => b - a)
    .map(([key]) => key)
    .slice(0, 1)
    .join('');

  return (
    <div className="flex flex-col gap-6">
      <section className="relative overflow-hidden rounded-3xl bg-gradient-to-r from-brand-500 via-brand-600 to-brand-800 px-5 pb-10 pt-7 shadow-xl shadow-brand-900/30 sm:px-6 md:px-10">
        <div className="absolute left-10 top-[-120px] h-64 w-64 rounded-full bg-white/10 blur-3xl" aria-hidden />
        <div className="absolute right-[-30px] top-[-60px] h-52 w-52 rounded-full bg-brand-200/40 blur-3xl" aria-hidden />

        <div className="relative mx-auto flex max-w-3xl flex-col items-center gap-6 text-center">
          <h1 className="text-[1.8rem] font-black leading-[1.1] text-white sm:text-3xl md:text-4xl lg:text-5xl">
            Recetario creativo con REST + GraphQL mock.
          </h1>
          <p className="max-w-2xl text-base text-white/80">
            Explora recetas por categoría, dificultad y tiempo de cocción. El listado llega desde la API REST mock y el
            detalle con ingredientes e instrucciones se consulta por GraphQL simulado.
          </p>
          <Link
            to="/recetas"
            className="inline-flex items-center gap-2 rounded-full border border-brand-100 bg-white px-5 py-3 text-sm font-semibold text-brand-800 shadow-lg shadow-brand-900/40 transition hover:-translate-y-0.5"
          >
            Explorar recetas
          </Link>
        </div>
      </section>

      <section className="grid gap-3 sm:grid-cols-2 lg:grid-cols-4">
        <Pill label="Recetas activas" value={stats.total || '—'} />
        <Pill label="Categorías" value={Object.keys(stats.byCategory || {}).length || '—'} />
        <Pill label="Top categoría" value={topCategory || '—'} />
        <Pill label="Dificultad más común" value={topDifficulty || '—'} />
      </section>

      <section className="flex flex-col gap-3">
        <div className="flex flex-col gap-2 sm:flex-row sm:items-center sm:justify-between">
          <div>
            <p className="text-xs font-semibold uppercase tracking-[0.2em] text-brand-700">Recetas destacadas</p>
            <h2 className="text-2xl font-black text-slate-950">Selección rápida</h2>
            <p className="text-sm text-slate-600">
              Estas opciones se cargan desde el mock REST; vuelve a recargar para refrescar la lista.
            </p>
          </div>
          <Link to="/recetas" className="text-sm font-semibold text-brand-700 hover:text-brand-800">
            Ir a filtros avanzados →
          </Link>
        </div>

        {loading && <p className="text-sm text-slate-600">Sincronizando con el backend...</p>}

        {!loading && (
          <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
            {featured.map((recipe) => (
              <RecipeCard key={recipe.id} recipe={recipe} compact />
            ))}
            {featured.length === 0 && (
              <p className="col-span-full rounded-xl border border-sand-200 bg-white px-4 py-3 text-sm text-slate-600">
                Aún no hay recetas cargadas.
              </p>
            )}
          </div>
        )}
      </section>
    </div>
  );
}
