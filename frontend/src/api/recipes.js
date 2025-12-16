import mockRecipes from './mockRecipes';

const API_URL = (import.meta.env.VITE_API_URL || '').replace(/\/$/, '');

const getMockList = () =>
  mockRecipes.map(({ id, title, category, difficulty, cookTime, image, shortDescription }) => ({
    id,
    title,
    category,
    difficulty,
    cookTime,
    image,
    shortDescription,
  }));

export async function fetchRecipesREST() {
  // Si no hay backend configurado, trabajamos 100% contra el catálogo mock.
  if (!API_URL) {
    return getMockList();
  }

  try {
    const response = await fetch(`${API_URL}/api/recipes`);
    if (!response.ok) {
      throw new Error('No se pudieron cargar las recetas');
    }
    return response.json();
  } catch (err) {
    console.warn('Fallo API REST remota, usando catálogo mock', err);
    return getMockList();
  }
}

export async function fetchRecipeDetailREST(id) {
  const mock = mockRecipes.find((item) => String(item.id) === String(id));

  if (!API_URL) {
    if (mock) return mock;
    throw new Error('Receta no encontrada');
  }

  try {
    const response = await fetch(`${API_URL}/api/recipes/${id}`);
    if (!response.ok) {
      throw new Error('Receta no encontrada');
    }
    return response.json();
  } catch (err) {
    console.warn('Fallo API REST remota, usando catálogo mock', err);
    if (mock) return mock;
    throw new Error('No se pudo cargar la receta');
  }
}

export async function fetchRecipeDetailGraphQL(id) {
  const mock = mockRecipes.find((item) => String(item.id) === String(id));

  if (!API_URL) {
    if (mock) return mock;
    throw new Error('No se pudo cargar el detalle');
  }

  const query = `
    query Recipe($id: ID!) {
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
  `;

  try {
    const response = await fetch(`${API_URL}/graphql`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ query, variables: { id } }),
    });

    const result = await response.json();
    if (!response.ok || result.errors) {
      throw new Error(result.errors?.[0]?.message || 'No se pudo cargar el detalle');
    }

    return result.data.recipe;
  } catch (err) {
    console.warn('Fallo GraphQL remoto, usando catálogo mock', err);
    if (mock) return mock;
    throw new Error('No se pudo cargar el detalle');
  }
}
