import { graphql, http, HttpResponse } from 'msw';
import mockRecipes from '../api/mockRecipes';

const apiBase = 'http://localhost:4000';

export const handlers = [
  http.get(`${apiBase}/api/recipes`, () => {
    const list = mockRecipes.map(({ id, title, category, difficulty, cookTime, image, shortDescription }) => ({
      id,
      title,
      category,
      difficulty,
      cookTime,
      image,
      shortDescription,
    }));
    return HttpResponse.json(list);
  }),

  http.get(`${apiBase}/api/recipes/:id`, ({ params }) => {
    const recipe = mockRecipes.find((item) => item.id === params.id);
    if (!recipe) {
      return HttpResponse.json({ message: 'Receta no encontrada' }, { status: 404 });
    }
    return HttpResponse.json(recipe);
  }),

  graphql
    .link(`${apiBase}/graphql`)
    .query('Recipe', ({ variables }) => {
      const recipe = mockRecipes.find((item) => item.id === variables.id);
      if (!recipe) {
        return HttpResponse.json({ errors: [{ message: 'Receta no encontrada' }] }, { status: 404 });
      }
      return HttpResponse.json({ data: { recipe } });
    }),
];
