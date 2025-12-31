'use client';

import { useQueryClient } from '@tanstack/react-query';

export const useRefreshAllCache = () => {
  const queryClient = useQueryClient();

  const refreshAll = () => {
    console.log('Refreshing all cached queries');
    // Invalidate all queries so they refetch
    queryClient.invalidateQueries({ queryKey: [] });
  };

  return refreshAll;
};
