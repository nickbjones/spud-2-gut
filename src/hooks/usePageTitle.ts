'use client';

import { useEffect } from 'react';

export function usePageTitle(title?: string) {
  useEffect(() => {
    document.title = title ? `${title} - Spud2Gut` : 'Spud2Gut';
  }, [title]);
}
