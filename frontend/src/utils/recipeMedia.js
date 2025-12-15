const categoryImages = {
  Postre: 'https://images.unsplash.com/photo-1551024709-8f23befc6f87?auto=format&fit=crop&w=1200&q=80',
  'Plato principal': 'https://images.unsplash.com/photo-1504674900247-0877df9cc836?auto=format&fit=crop&w=1200&q=80',
  Entrada: 'https://images.unsplash.com/photo-1604908177773-0ac1c9d1e941?auto=format&fit=crop&w=1200&q=80',
  Vegetariano: 'https://images.unsplash.com/photo-1547592166-23ac45744acd?auto=format&fit=crop&w=1200&q=80',
  Panadería: 'https://images.unsplash.com/photo-1542838132-92c53300491e?auto=format&fit=crop&w=1200&q=80',
  Bebida: 'https://images.unsplash.com/photo-1446292532430-3e76f6ab6444?auto=format&fit=crop&w=1200&q=80',
};

export function getRecipeImage(recipe) {
  if (recipe?.image) return recipe.image;
  if (recipe?.categoria) return categoryImages[recipe.categoria] || categoryImages.Postre;
  return categoryImages[recipe?.category] || categoryImages.Postre;
}
