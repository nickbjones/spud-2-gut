import { LRUCache } from 'lru-cache';
import type { RecipeType } from '@/types/recipe';
import type { TagType } from '@/types/tag';

export const cache = new LRUCache<string, RecipeType[] | TagType[]>({
  max: 100,
  ttl: 0, // manual invalidation only
});
