'use client';

import { useQuery, useQueryClient } from '@tanstack/react-query';

const fetcher = async <T>(url: string, signal?: AbortSignal): Promise<T> => {
  const res = await fetch(url, { signal });
  if (!res.ok) throw new Error(`Failed to fetch ${url}: ${res.status} ${res.statusText}`);
  return res.json();
};

export function useData<T>(url: string, fallbackData?: T) {
  const queryClient = useQueryClient();

  const query = useQuery<T>({
    queryKey: [url],
    queryFn: ({ signal }) => fetcher<T>(url, signal),
    initialData: fallbackData,
    enabled: true, // always fetch new data; control revalidation elsewhere
  });

  // Manually updates the cache for the given URL and triggers revalidation.
  const mutate = (data?: T) => {
    queryClient.setQueryData([url], data);
    return queryClient.invalidateQueries({ queryKey: [url] });
  };

  return {
    data: query.data,
    error: query.error,
    isLoading: query.isLoading,
    mutate,
  };
}
