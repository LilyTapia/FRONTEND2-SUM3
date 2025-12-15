import { describe, it, expect, vi, beforeEach } from 'vitest';
import { http, HttpResponse } from 'msw';
import mockRecipes from '../api/mockRecipes';
import { server } from '../mocks/server';

const API_URL = 'http://localhost:4000';

describe('API de recetas (REST/GraphQL)', () => {
  beforeEach(() => {
    vi.resetModules();
  });

  it('usa el endpoint REST cuando VITE_API_URL está definido', async () => {
    vi.stubEnv('VITE_API_URL', API_URL);
    const { fetchRecipesREST } = await import('../api/recipes');

    const data = await fetchRecipesREST();

    expect(data).toHaveLength(mockRecipes.length);
    expect(data[0].title).toBe(mockRecipes[0].title);
  });

  it('vuelve al catálogo mock si el REST responde error', async () => {
    vi.stubEnv('VITE_API_URL', API_URL);
    server.use(http.get(`${API_URL}/api/recipes`, () => HttpResponse.json({ message: 'fail' }, { status: 500 })));
    const { fetchRecipesREST } = await import('../api/recipes');

    const data = await fetchRecipesREST();

    expect(data.some((item) => item.id === mockRecipes[0].id)).toBe(true);
  });

  it('usa el mock local si no hay API_URL configurada', async () => {
    vi.stubEnv('VITE_API_URL', '');
    const { fetchRecipesREST } = await import('../api/recipes');

    const data = await fetchRecipesREST();

    expect(data).toHaveLength(mockRecipes.length);
  });

  it('obtiene detalle por GraphQL cuando está disponible', async () => {
    vi.stubEnv('VITE_API_URL', API_URL);
    const { fetchRecipeDetailGraphQL } = await import('../api/recipes');

    const recipe = await fetchRecipeDetailGraphQL('2');

    expect(recipe?.id).toBe('2');
    expect(recipe?.steps?.length).toBeGreaterThan(0);
  });

  it('hace fallback a REST cuando GraphQL falla', async () => {
    vi.stubEnv('VITE_API_URL', API_URL);
    server.use(
      http.post(`${API_URL}/graphql`, () =>
        HttpResponse.json({ errors: [{ message: 'explota' }] }, { status: 500 }),
      ),
    );
    const { fetchRecipeDetailGraphQL } = await import('../api/recipes');

    const recipe = await fetchRecipeDetailGraphQL('1');

    expect(recipe?.title).toBe(mockRecipes[0].title);
  });

  it('lanza error si no encuentra la receta en mock ni backend', async () => {
    vi.stubEnv('VITE_API_URL', '');
    const { fetchRecipeDetailREST, fetchRecipeDetailGraphQL } = await import('../api/recipes');

    await expect(fetchRecipeDetailREST('999')).rejects.toThrow('Receta no encontrada');
    await expect(fetchRecipeDetailGraphQL('999')).rejects.toThrow('No se pudo cargar el detalle');
  });

  it('cubre ramas 404 de handlers REST/GraphQL', async () => {
    vi.stubEnv('VITE_API_URL', API_URL);
    const { fetchRecipeDetailREST, fetchRecipeDetailGraphQL } = await import('../api/recipes');

    await expect(fetchRecipeDetailREST('999')).rejects.toThrow();
    await expect(fetchRecipeDetailGraphQL('999')).rejects.toThrow();
  });

  it('usa REST detalle con API_URL cuando existe la receta', async () => {
    vi.stubEnv('VITE_API_URL', API_URL);
    const { fetchRecipeDetailREST } = await import('../api/recipes');

    const recipe = await fetchRecipeDetailREST('1');

    expect(recipe.id).toBe('1');
    expect(recipe.title).toBe(mockRecipes[0].title);
  });

  it('devuelve el mock cuando no hay API_URL pero la receta existe', async () => {
    vi.stubEnv('VITE_API_URL', '');
    const { fetchRecipeDetailREST } = await import('../api/recipes');

    const recipe = await fetchRecipeDetailREST('1');

    expect(recipe.title).toBe(mockRecipes[0].title);
  });

  it('hace fallback a mock cuando falla el detalle REST remoto', async () => {
    vi.stubEnv('VITE_API_URL', API_URL);
    server.use(
      http.get(`${API_URL}/api/recipes/:id`, () =>
        HttpResponse.json({ message: 'down' }, { status: 500 }),
      ),
    );
    const { fetchRecipeDetailREST } = await import('../api/recipes');

    const recipe = await fetchRecipeDetailREST('2');

    expect(recipe.title).toBe(mockRecipes[1].title);
  });

  it('lanza error de GraphQL cuando viene errors aunque el status sea 200 y cae al mock', async () => {
    vi.stubEnv('VITE_API_URL', API_URL);
    server.use(
      http.post(`${API_URL}/graphql`, () =>
        HttpResponse.json({ errors: [{ message: 'denied' }] }, { status: 200 }),
      ),
    );
    const { fetchRecipeDetailGraphQL } = await import('../api/recipes');

    const recipe = await fetchRecipeDetailGraphQL('3');

    expect(recipe.title).toBe(mockRecipes[2].title);
  });

  it('usa el mensaje por defecto cuando GraphQL responde 500 sin errors', async () => {
    vi.stubEnv('VITE_API_URL', API_URL);
    server.use(
      http.post(`${API_URL}/graphql`, () =>
        HttpResponse.json({}, { status: 500 }),
      ),
    );
    const { fetchRecipeDetailGraphQL } = await import('../api/recipes');

    const recipe = await fetchRecipeDetailGraphQL('4');

    expect(recipe.title).toBe(mockRecipes[3].title);
  });
});
