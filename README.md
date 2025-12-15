# Colomba Kitchen · Sumativa 3 (Semana 8) · Recetario REST + GraphQL

## Objetivo General
Actividad sumativa de la semana 8: construir una SPA de recetas (HTML/JS/CSS/React) que permita explorar y guardar recetas. El listado proviene de una API REST mock y el detalle desde una API GraphQL mock (ingredientes, preparación, tiempo). Se exige calidad: linting, pruebas unitarias con cobertura ≥70% y pruebas E2E.

## 1. Características implementadas (Semana 8)
### a) Integración de APIs mock
- REST mock: listado de recetas con título, categoría, dificultad y tiempo.
- GraphQL mock: detalle con ingredientes, pasos, porciones y tiempo.
- Fallback inteligente: si falla la API remota, se usan los datos mock locales.

### b) Interfaz de usuario
- SPA React + React Router; filtros por categoría y búsqueda textual.
- Detalle con imagen, dificultad, tiempo, porciones, ingredientes y pasos.
- Guardado de recetas en localStorage (botón Guardar/Quitar).

### c) Calidad y pruebas
- Linting: ESLint.
- Unitarias/integración: Vitest (Jest-like) + React Testing Library + MSW (mocks de backend). Cobertura actual 100% (Stmts/Funcs/Lines/Branches).
- E2E: Cypress con 4 flujos principales (navegación, filtros, guardado).

## 2. Arquitectura (frontend)
- Estado global en `RecipeContext` (recetas, loading/error, guardados, stats).
- Consumo de API en `src/api/recipes.js` con fallback al catálogo mock.
- Enrutamiento declarativo para Home, Recetario, Detalle y Favoritas.
- Utilidades de medios (`recipeMedia`) para manejar imágenes por categoría.

## 3. Estructura del proyecto
```
backend/
  index.js                 # REST + GraphQL mock (Express + Apollo Server)

frontend/
  src/api/recipes.js       # Cliente REST/GraphQL con fallback mock
  src/context/RecipeContext.jsx
  src/pages/               # Home, AllRecipes, RecipeDetail, SavedRecipes
  src/components/          # Navbar, RecipeCard
  src/utils/recipeMedia.js
  src/mocks/               # MSW handlers/server
  src/__tests__/           # Vitest + RTL + MSW
  cypress/                 # E2E specs (recipes.cy.js)
  vite.config.js           # base /FRONTEND2-SUM3/ para gh-pages
```

## 4. Instrucciones de ejecución (local)
1. Backend (puerto 4000):
   ```bash
   cd backend
   npm install
   npm start
   ```
   - REST: http://localhost:4000/api/recipes
   - REST detalle: http://localhost:4000/api/recipes/:id
   - GraphQL: http://localhost:4000/graphql

2. Frontend (puerto 5173):
   ```bash
   cd frontend
   npm install
   npm run dev
   ```
   Opcional: `VITE_API_URL=http://localhost:4000` si usas el backend; si no, se usan mocks locales.

## 5. Pruebas
- Unitarias/integración + cobertura: `cd frontend && npm test`
- E2E (levanta primero `npm run dev` en otra terminal): `cd frontend && npm run cypress:run`
- Lint: `cd frontend && npm run lint`

## 6. Despliegue (GitHub Pages)
Base configurada en `/FRONTEND2-SUM3/`. Para publicar:
```bash
cd frontend
npm run build
npm run deploy   # gh-pages -d dist -b gh-pages
```
Luego en GitHub: Settings → Pages → Branch `gh-pages`, carpeta `/`.  
URL esperada: `https://lilytapia.github.io/FRONTEND2-SUM3/`

## Autor
Liliana Tapia · Asignatura: Frontend II - DUOC UC

## Cómo correrlo (local)

1. Backend (puerto 4000):
   ```bash
   cd backend
   npm install
   npm start
   ```
   - REST: http://localhost:4000/api/recipes y `/api/recipes/:id`
   - GraphQL (playground): http://localhost:4000/graphql

2. Frontend (puerto 5173):
   ```bash
   cd frontend
   npm install
   npm run dev
   ```
   Puedes definir `VITE_API_URL` si el backend corre en otra URL.

## Query de ejemplo (GraphQL)
```graphql
query Receta($id: ID!) {
  recipe(id: $id) {
    id
    title
    category
    difficulty
    cookTime
    servings
    shortDescription
    ingredients
    steps
    image
  }
}
```

## Estructura
- `backend/`: servidor Express con endpoints REST y esquema GraphQL usando Apollo Server.
  - `index.js`: datos mock de recetas + rutas REST `/api/recipes` y `/api/recipes/:id` + endpoint `/graphql`.
- `frontend/`: app React con React Router; listado via REST y detalle via GraphQL.
  - `src/api/recipes.js`: cliente REST/GraphQL con fallback al catálogo mock interno.
  - `src/context/RecipeContext.jsx`: estado global (recetas, loading/error, guardados en localStorage, stats).
  - `src/pages/`: Home, AllRecipes (filtros REST), RecipeDetail (GraphQL), SavedRecipes (favoritos).
  - `src/components/RecipeCard.jsx`, `src/components/Navbar.jsx`: UI reutilizable.
  - Estilos con Tailwind CSS (`tailwind.config.js`, `postcss.config.js`) y tipografías Sora/Work Sans.
