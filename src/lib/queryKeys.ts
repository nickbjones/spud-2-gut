export const queryKeys = {
  recipe: (id: string) => ['recipes', id] as const,
  recipes: ['recipes'] as const,
  tag: (id: string) => ['tags', id] as const,
  tags: ['tags'] as const,
};
