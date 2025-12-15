import { describe, it, expect } from 'vitest';
import { getRecipeImage } from '../utils/recipeMedia';

describe('getRecipeImage', () => {
  it('devuelve la imagen propia si existe', () => {
    const url = 'https://example.com/custom.jpg';
    expect(getRecipeImage({ image: url })).toBe(url);
  });

  it('usa categoría en español chileno (categoria) si no hay image', () => {
    const url = getRecipeImage({ categoria: 'Vegetariano' });
    expect(url).toContain('photo-1547592166-23ac45744acd');
  });

  it('usa fallback Postre cuando la categoria no está en el catálogo', () => {
    const url = getRecipeImage({ categoria: 'Desconocida' });
    expect(url).toContain('photo-1551024709-8f23befc6f87');
  });

  it('usa fallback por category cuando no hay image ni categoria', () => {
    const url = getRecipeImage({ category: 'Bebida' });
    expect(url).toContain('photo-1446292532430');
  });

  it('retorna fallback por defecto si no hay datos', () => {
    const url = getRecipeImage({});
    expect(url).toContain('photo-1551024709-8f23befc6f87');
  });
});
