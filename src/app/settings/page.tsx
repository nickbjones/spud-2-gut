/**
 * Archive page
 */
'use client';

import { ClearCacheButton } from '@/components/ClearCacheButton';

export default function SettingsPage() {
  return (
    <div className="max-w-5xl mx-auto -mb-12 p-3 sm:p-6 pb-12 sm:pb-24">
      <h1 className="text-xl font-bold mb-3">Application settings</h1>
      <ClearCacheButton />
    </div>
  );
}
