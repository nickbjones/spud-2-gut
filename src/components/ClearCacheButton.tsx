'use client';

import React, { useState } from 'react';
import { useRefreshAllCache } from '@/hooks/useRefreshCache';

export const ClearCacheButton: React.FC = () => {
  const [disabled, setDisabled] = useState(false);
  const refreshAll = useRefreshAllCache();

  const handleClick = () => {
    refreshAll();
    setDisabled(true);
    setTimeout(() => setDisabled(false), 3000); // Re-enable after 3s
  };

  return (
    <>
      <p className="mt-8 mb-2 text-gray-400">Refresh application in-memory data.</p>
      <button
        onClick={handleClick}
        disabled={disabled}
        style={{
          padding: '8px 12px',
          borderRadius: 6,
          border: '1px solid #ccc',
          backgroundColor: disabled ? '#eee' : '#fafafa',
          cursor: disabled ? 'not-allowed' : 'pointer',
          transition: 'background-color 0.2s ease',
        }}
        >
        {disabled ? 'Refreshing…' : 'Clear Cache'}
      </button>
    </>
  );
};
