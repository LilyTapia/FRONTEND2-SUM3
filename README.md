# Recetario · REST + GraphQL (Semana 8 · Sumativa 3)

## Objetivo
Desarrollar una SPA de recetas (HTML/JS/CSS/React) que permita explorar y guardar recetas, consumiendo una API REST mock para el listado (título, dificultad, categoría, tiempo) y una API GraphQL mock para el detalle (ingredientes, método, tiempo). La actividad exige calidad de código: linting, pruebas unitarias con cobertura ≥70% (Stmts/Funcs/Lines) y pruebas E2E.

## Requisitos de la actividad
1) App de recetas: listar recetas (REST mock), ver detalle individual (GraphQL mock), filtrar y guardar recetas.  
2) Pruebas unitarias/integración: Vitest (Jest-like) + React Testing Library + MSW para mock de backend. Cobertura mínima 70% (actual: 100%).  
3) Pruebas E2E: Cypress con al menos 4 flujos de usuario (navegación, filtros, guardado).  
4) Linting: ESLint configurado.

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
