'use client';

import useSWR from 'swr';

const fetcher = (url: string) => fetch(url).then(res => {
  if (!res.ok) throw new Error('Failed to fetch');
  return res.json();
});

export function useData<T>(url: string, fallbackData?: T) {
  const {
    data,
    error,
    isLoading,
    mutate,
  } = useSWR<T>(url, fetcher, {
    fallbackData,
    revalidateOnMount: fallbackData === undefined, // avoid refetch if fallback is used
  });

  return {
    data,
    error,
    isLoading,
    mutate,
  };
}
