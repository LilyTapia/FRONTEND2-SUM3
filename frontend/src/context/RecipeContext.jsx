import { createContext, useContext, useEffect, useMemo, useState } from 'react';
import { fetchRecipesREST } from '../api/recipes';

const RecipeContext = createContext();

// eslint-disable-next-line react-refresh/only-export-components
export function useRecipes() {
  return useContext(RecipeContext);
}

export function RecipeProvider({ children }) {
  const [recipes, setRecipes] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [savedRecipes, setSavedRecipes] = useState(() => {
    // Se persisten las guardadas para mantenerlas tras recargas
    const stored = localStorage.getItem('savedRecipes');
    return stored ? JSON.parse(stored) : [];
  });

  useEffect(() => {
    localStorage.setItem('savedRecipes', JSON.stringify(savedRecipes));
  }, [savedRecipes]);

  useEffect(() => {
    fetchRecipesREST()
      .then((data) => setRecipes(data))
      .catch((err) => setError(err.message))
      .finally(() => setLoading(false));
  }, []);

  const isSaved = (id) => savedRecipes.some((item) => String(item.id) === String(id));

  const toggleSaved = (recipe) => {
    if (!recipe) return;
    setSavedRecipes((prev) => {
      if (prev.some((item) => String(item.id) === String(recipe.id))) {
        return prev.filter((item) => String(item.id) !== String(recipe.id));
      }
      return [...prev, recipe];
    });
  };

  const stats = useMemo(() => {
    const byCategory = recipes.reduce((acc, recipe) => {
      acc[recipe.category] = (acc[recipe.category] || 0) + 1;
      return acc;
    }, {});
    const byDifficulty = recipes.reduce((acc, recipe) => {
      acc[recipe.difficulty] = (acc[recipe.difficulty] || 0) + 1;
      return acc;
    }, {});
    return { total: recipes.length, byCategory, byDifficulty };
  }, [recipes]);

  const value = {
    recipes,
    loading,
    error,
    savedRecipes,
    isSaved,
    toggleSaved,
    stats,
  };

  return <RecipeContext.Provider value={value}>{children}</RecipeContext.Provider>;
}
