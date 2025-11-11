import { LRUCache } from 'lru-cache';

export const cache = new LRUCache<string, any>({
  max: 100,
  ttl: 0, // manual invalidation only
});
