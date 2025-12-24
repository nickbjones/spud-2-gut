export const queryKeys = {
  recipes: ['recipes'] as const,
  recipe: (id: string) => ['recipes', id] as const,
};
