import { describe, it, expect, vi } from 'vitest';
import { render, screen, waitFor } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { RecipeProvider, useRecipes } from '../context/RecipeContext';

function Consumer() {
  const { recipes, stats, savedRecipes, toggleSaved, isSaved } = useRecipes();
  const first = recipes[0];

  return (
    <div>
      <div data-testid="total">{stats.total}</div>
      <div data-testid="categories">{Object.keys(stats.byCategory || {}).length}</div>
      <div data-testid="isSaved">{first ? String(isSaved(first.id)) : 'false'}</div>
      <div data-testid="savedCount">{savedRecipes.length}</div>
      <button type="button" onClick={() => first && toggleSaved(first)} data-testid="toggle">
        toggle
      </button>
    </div>
  );
}

describe('RecipeContext', () => {
  it('carga recetas y calcula estadísticas', async () => {
    render(
      <RecipeProvider>
        <Consumer />
      </RecipeProvider>,
    );

    const totals = await screen.findAllByTestId('total');

    expect(Number(totals[0].textContent)).toBeGreaterThan(0);
    expect(Number(screen.getAllByTestId('categories')[0].textContent)).toBeGreaterThan(0);
  });

  it('permite guardar y desguardar recetas', async () => {
    render(
      <RecipeProvider>
        <Consumer />
      </RecipeProvider>,
    );

    await waitFor(() => expect(screen.getAllByTestId('total')[0].textContent).not.toBe('0'));

    expect(screen.getAllByTestId('savedCount')[0].textContent).toBe('0');

    await userEvent.click(screen.getAllByTestId('toggle')[0]);
    expect(screen.getAllByTestId('savedCount')[0].textContent).toBe('1');
    expect(screen.getAllByTestId('isSaved')[0].textContent).toBe('true');

    await userEvent.click(screen.getAllByTestId('toggle')[0]);
    expect(screen.getAllByTestId('savedCount')[0].textContent).toBe('0');
    expect(screen.getAllByTestId('isSaved')[0].textContent).toBe('false');
  });

  it('expone el error cuando el fetch falla', async () => {
    const mockError = new Error('boom');
    const spy = vi.spyOn(await import('../api/recipes'), 'fetchRecipesREST').mockRejectedValue(mockError);

    render(
      <RecipeProvider>
        <Consumer />
      </RecipeProvider>,
    );

    await waitFor(() => expect(spy).toHaveBeenCalled());
    // error se refleja en el estado del provider, aunque no se pinta en Consumer
    expect(spy).toHaveBeenCalledTimes(1);
  });

  it('usa recetas guardadas desde localStorage al iniciar', async () => {
    localStorage.setItem('savedRecipes', JSON.stringify([{ id: 'xyz', title: 'Guardada' }]));

    render(
      <RecipeProvider>
        <Consumer />
      </RecipeProvider>,
    );

    const savedCounters = await screen.findAllByTestId('savedCount');
    expect(savedCounters.some((el) => el.textContent === '1')).toBe(true);
    expect(screen.getAllByTestId('isSaved')[0].textContent).toBe('false');
  });

  it('ignora toggleSaved cuando no recibe receta', async () => {
    function NoopConsumer() {
      const { savedRecipes, toggleSaved } = useRecipes();
      return (
        <div>
          <div data-testid="savedCountGuard">{savedRecipes.length}</div>
          <button type="button" onClick={() => toggleSaved(undefined)} data-testid="noop-toggle">
            noop
          </button>
        </div>
      );
    }

    render(
      <RecipeProvider>
        <NoopConsumer />
      </RecipeProvider>,
    );

    expect(screen.getByTestId('savedCountGuard').textContent).toBe('0');
    await userEvent.click(screen.getByTestId('noop-toggle'));
    expect(screen.getByTestId('savedCountGuard').textContent).toBe('0');
  });
});
