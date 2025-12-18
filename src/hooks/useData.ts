'use client';

import { useQuery, useQueryClient } from '@tanstack/react-query';

const fetcher = async <T>(url: string): Promise<T> => {
  const res = await fetch(url);
  if (!res.ok) throw new Error('Failed to fetch');
  return res.json();
};

export function useData<T>(url: string, fallbackData?: T) {
  const queryClient = useQueryClient();

  const query = useQuery<T>({
    queryKey: [url],
    queryFn: () => fetcher<T>(url),
    initialData: fallbackData,
    enabled: fallbackData === undefined, // mirrors revalidateOnMount logic
  });

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
