import { Link, NavLink } from 'react-router-dom';
import { useRecipes } from '../context/RecipeContext';

const baseLink =
  'relative px-3 py-2 text-sm font-semibold text-white/80 transition hover:text-white after:absolute after:left-3 after:-bottom-1 after:h-[2px] after:w-4 after:scale-x-0 after:bg-white after:transition after:duration-200 hover:after:scale-x-100';
const activeLink = `${baseLink} text-white after:scale-x-100`;

function Navbar() {
  const { savedRecipes } = useRecipes();

  return (
    <header className="sticky top-0 z-20 border-b border-brand-400/30 bg-gradient-to-r from-brand-500 via-brand-600 to-brand-800 shadow-lg shadow-brand-800/30">
      <div className="mx-auto flex max-w-6xl flex-wrap items-center gap-3 px-4 py-4 md:px-6">
        <Link to="/" className="group inline-flex items-center gap-3 text-white">
          <span className="grid h-10 w-10 place-items-center rounded-2xl bg-white/15 text-sm font-black uppercase">
            RC
          </span>
          <div>
            <p className="text-xs font-semibold uppercase tracking-[0.18em] text-white/80">Recetario creativo</p>
            <p className="text-lg font-black leading-tight">Colomba Kitchen</p>
          </div>
        </Link>

        <nav className="flex flex-1 items-center justify-center gap-3 text-center">
          <NavLink to="/" className={({ isActive }) => (isActive ? activeLink : baseLink)}>
            Inicio
          </NavLink>
          <NavLink to="/recetas" className={({ isActive }) => (isActive ? activeLink : baseLink)}>
            Recetas
          </NavLink>
        </nav>

        <div className="ml-auto flex items-center gap-2">
          <NavLink
            to="/favoritas"
            className={({ isActive }) =>
              `inline-flex items-center gap-2 rounded-full bg-gradient-to-r from-brand-300 via-brand-400 to-brand-600 px-4 py-2 text-sm font-semibold text-slate-900 shadow-md shadow-brand-900/30 transition hover:-translate-y-0.5 ${
                isActive ? 'ring-2 ring-white/60' : ''
              }`
            }
          >
            Guardadas
            <span className="grid h-6 w-6 place-items-center rounded-full bg-brand-800 text-xs font-bold text-white">
              {savedRecipes.length}
            </span>
          </NavLink>
        </div>
      </div>
    </header>
  );
}

export default Navbar;
