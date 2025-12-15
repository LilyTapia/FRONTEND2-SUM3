import { describe, it, expect, vi } from 'vitest';
import { MemoryRouter, Route, Routes } from 'react-router-dom';
import { render, screen, waitFor, within } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import AllRecipes from '../pages/AllRecipes';
import { RecipeProvider } from '../context/RecipeContext';

describe('Página AllRecipes', () => {
  const setup = () =>
    render(
      <RecipeProvider>
        <MemoryRouter initialEntries={['/recetas']}>
          <Routes>
            <Route
              path="/recetas"
              element={
                <div data-testid="page">
                  <AllRecipes />
                </div>
              }
            />
          </Routes>
        </MemoryRouter>
      </RecipeProvider>,
    );

  it('muestra listado y permite filtrar por texto', async () => {
    setup();
    const page = (await screen.findAllByTestId('page'))[0];
    const scoped = within(page);

    await waitFor(() => expect(scoped.getAllByText(/Explora por categoría/i)[0]).toBeInTheDocument());

    const search = scoped.getByPlaceholderText(/Buscar por nombre o dificultad/i);
    await userEvent.type(search, 'curry');

    expect(scoped.getByText(/Curry cremoso de garbanzos/i)).toBeInTheDocument();
    expect(scoped.queryByText(/Tiramisú clásico/i)).not.toBeInTheDocument();
  });

  it('filtra por categoría seleccionada', async () => {
    setup();
    const pages = await screen.findAllByTestId('page');
    const pageWithData = pages.find((node) => within(node).queryByRole('heading', { level: 3 })) || pages[0];
    const scoped = within(pageWithData);

    await waitFor(() => expect(scoped.getAllByRole('heading', { level: 3 }).length).toBeGreaterThan(0));

    const postreButton = scoped.getAllByRole('button', { name: 'Postre' })[0];
    await userEvent.click(postreButton);

    await waitFor(() => {
      const titles = scoped.queryAllByRole('heading', { level: 3 }).map((el) => el.textContent);
      expect(titles.every((title) => ['Tiramisú clásico', 'Brownies húmedos de chocolate'].includes(title))).toBe(true);
    });
  });

  it('muestra mensaje de error cuando el contexto reporta error', async () => {
    vi.resetModules();
    vi.doMock('../context/RecipeContext', async () => {
      const actual = await vi.importActual('../context/RecipeContext');
      return {
        ...actual,
        useRecipes: () => ({ recipes: [], loading: false, error: 'Fallo API' }),
      };
    });
    const { default: AllRecipesWithMock } = await import('../pages/AllRecipes');

    render(
      <MemoryRouter initialEntries={['/recetas']}>
        <AllRecipesWithMock />
      </MemoryRouter>,
    );

    expect(screen.getByText(/Fallo API/i)).toBeInTheDocument();
    vi.resetModules();
  });
});
