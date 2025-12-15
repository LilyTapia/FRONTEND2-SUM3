# Recetario · REST + GraphQL (Semana 8 · Sumativa 3)

SPA React para explorar y guardar recetas. El listado se obtiene por REST mock (título, categoría, dificultad, tiempo) y el detalle con ingredientes/pasos llega por GraphQL simulado.

## Cómo correrlo

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
