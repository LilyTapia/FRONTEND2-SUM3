# Colomba Kitchen · Recetario (Semana 8 · Sumativa 3)

SPA en React + Vite + Tailwind que usa un backend mock (REST y GraphQL) para listar recetas y ver su detalle con ingredientes y pasos. Incluye guardado local de recetas (localStorage) y UI responsive.

## Estructura
- `frontend/src/api/recipes.js`: llamadas REST/GraphQL con fallback al mock local (`src/api/mockRecipes.js`).
- `frontend/src/context/RecipeContext.jsx`: estado global (recetas, loading/error, guardados en localStorage, stats).
- `frontend/src/components/`: Navbar, RecipeCard.
- `frontend/src/pages/`: Home, AllRecipes (filtros), RecipeDetail, SavedRecipes.
- `frontend/src/utils/recipeMedia.js`: fallback de imágenes por categoría.
- `frontend/src/mocks/`: MSW (handlers/server) para pruebas.
- `frontend/cypress/`: pruebas E2E.

## Requisitos previos
- Node 18+.

## Instalación
```bash
cd frontend
npm install
```

## Ejecución en desarrollo
```bash
cd frontend
npm run dev
```
Frontend en `http://localhost:5173` (usa datos mock si no hay backend real).

## Variables de entorno (opcional)
- `VITE_API_URL`: URL base del backend (sin slash final). Si no se define o falla la llamada, el frontend usa el catálogo mock embebido.

## Scripts útiles
- `npm run dev` (desarrollo)
- `npm run build` / `npm run preview`
- `npm run lint`
- `npm test` (Vitest + RTL + cobertura)
- `npm run cypress:run` / `npm run cypress:open` (E2E)

## Pruebas
- Unitarias/integración: Vitest + React Testing Library + MSW, cobertura 100% (Stmts/Funcs/Lines/Branches).
- E2E: Cypress con 4 flujos principales (navegación, filtros, guardado de receta).

## Funcionalidad clave
- Recetario (`/recetas`): filtros por categoría y búsqueda por nombre/dificultad (REST mock).
- Detalle (`/receta/:id`): GraphQL mock con fallback REST; muestra tiempo, dificultad, porciones, ingredientes y pasos.
- Guardados (`/favoritas`): persistencia en localStorage.

## Despliegue (GitHub Pages)
Configuración con `base: '/FRONTEND2-SUM2/'` en `vite.config.js`. Para publicar:
```bash
cd frontend
# opcional: export VITE_API_URL si tienes backend real
npm run build
npx gh-pages -d dist -b gh-pages
```
Sin `VITE_API_URL`, la versión publicada usa los datos mock internos.
