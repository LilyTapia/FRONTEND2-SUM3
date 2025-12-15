import { describe, it, expect, vi } from 'vitest';
import { MemoryRouter, Route, Routes } from 'react-router-dom';
import { render, screen, waitFor } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import RecipeDetail from '../pages/RecipeDetail';
import { RecipeProvider } from '../context/RecipeContext';

describe('Página RecipeDetail', () => {
  const renderDetail = (id = '5') =>
    render(
      <RecipeProvider>
        <MemoryRouter initialEntries={[`/receta/${id}`]}>
          <Routes>
            <Route path="/receta/:id" element={<RecipeDetail />} />
          </Routes>
        </MemoryRouter>
      </RecipeProvider>,
    );

  it('carga el detalle y muestra ingredientes/pasos', async () => {
    renderDetail('3');

    await waitFor(() => expect(screen.getByRole('heading', { level: 1 })).toBeInTheDocument());

    expect(screen.getByText(/Ensalada mediterránea/i)).toBeInTheDocument();
    expect(screen.getByRole('heading', { name: /Ingredientes/i })).toBeInTheDocument();
    expect(screen.getByRole('heading', { name: /Preparación/i })).toBeInTheDocument();
  });

  it('permite guardar y quitar la receta', async () => {
    renderDetail('5');

    const button = await screen.findByRole('button', { name: /Guardar receta/i });
    await userEvent.click(button);
    expect(button).toHaveTextContent(/Quitar de guardadas/i);

    await userEvent.click(button);
    expect(button).toHaveTextContent(/Guardar receta/i);
  });

  it('muestra estado de error cuando falla REST y GraphQL', async () => {
    const api = await import('../api/recipes');
    const graphSpy = vi.spyOn(api, 'fetchRecipeDetailGraphQL').mockRejectedValue(new Error('gql fail'));
    const restSpy = vi.spyOn(api, 'fetchRecipeDetailREST').mockRejectedValue(new Error('rest fail'));

    renderDetail('999');

    const errorMsg = await screen.findByText(/No pudimos cargar el detalle/i);
    expect(errorMsg).toBeInTheDocument();
    expect(graphSpy).toHaveBeenCalled();
    expect(restSpy).toHaveBeenCalled();
  });

  it('hace fallback a REST cuando falla GraphQL y allí sí responde', async () => {
    const api = await import('../api/recipes');
    vi.spyOn(api, 'fetchRecipeDetailGraphQL').mockRejectedValue(new Error('gql fail'));
    vi.spyOn(api, 'fetchRecipeDetailREST').mockResolvedValue({ id: '2', title: 'Mock REST detail' });

    renderDetail('2');

    expect(await screen.findByText(/Mock REST detail/i)).toBeInTheDocument();
  });

  it('limpia el efecto al desmontar y evita setState tras unmount', async () => {
    const api = await import('../api/recipes');
    let resolveGql;
    const gqlPromise = new Promise((resolve) => {
      resolveGql = resolve;
    });
    const gqlSpy = vi.spyOn(api, 'fetchRecipeDetailGraphQL').mockReturnValue(gqlPromise);
    const restSpy = vi.spyOn(api, 'fetchRecipeDetailREST').mockResolvedValue({ id: '7', title: 'REST' });

    const result = renderDetail('7');

    await waitFor(() => expect(gqlSpy).toHaveBeenCalled());
    result.unmount();

    resolveGql({ id: '7', title: 'GraphQL tardío' });
    await Promise.resolve();

    expect(restSpy).not.toHaveBeenCalled();
  });

  it('no setea receta si REST responde después de desmontar', async () => {
    const api = await import('../api/recipes');
    let rejectGql;
    const gqlPromise = new Promise((_, reject) => {
      rejectGql = reject;
    });
    vi.spyOn(api, 'fetchRecipeDetailGraphQL').mockReturnValue(gqlPromise);
    let resolveRest;
    const restPromise = new Promise((resolve) => {
      resolveRest = resolve;
    });
    const restSpy = vi.spyOn(api, 'fetchRecipeDetailREST').mockReturnValue(restPromise);

    const result = renderDetail('4');

    rejectGql(new Error('gql fail'));
    await waitFor(() => expect(restSpy).toHaveBeenCalled());
    result.unmount();

    resolveRest({ id: '4', title: 'rest tardío' });
    await Promise.resolve();

    expect(restSpy).toHaveBeenCalled();
  });

  it('no setea error si REST falla luego de desmontar', async () => {
    const api = await import('../api/recipes');
    let rejectGql;
    const gqlPromise = new Promise((_, reject) => {
      rejectGql = reject;
    });
    vi.spyOn(api, 'fetchRecipeDetailGraphQL').mockReturnValue(gqlPromise);
    let rejectRest;
    const restPromise = new Promise((_, reject) => {
      rejectRest = reject;
    });
    const restSpy = vi.spyOn(api, 'fetchRecipeDetailREST').mockReturnValue(restPromise);

    const result = renderDetail('6');

    rejectGql(new Error('gql fail'));
    await waitFor(() => expect(restSpy).toHaveBeenCalled());
    result.unmount();

    rejectRest(new Error('rest fail'));
    await Promise.resolve();

    expect(restSpy).toHaveBeenCalled();
  });

  it('muestra mensaje por defecto cuando no hay detalle ni error explícito', async () => {
    const api = await import('../api/recipes');
    vi.spyOn(api, 'fetchRecipeDetailGraphQL').mockResolvedValue(undefined);
    vi.spyOn(api, 'fetchRecipeDetailREST').mockResolvedValue(undefined);

    renderDetail('999');

    const message = await screen.findByText(/No encontramos esta receta/i);
    expect(message).toBeInTheDocument();
  });
});
