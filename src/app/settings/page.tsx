/**
 * Settings page
 */
'use client';

import { ClearCacheButton } from '@/components/ClearCacheButton';

const commitSha = process.env.NEXT_PUBLIC_VERCEL_GIT_COMMIT_SHA?.slice(0, 7);
const buildTime = process.env.NEXT_PUBLIC_BUILD_TIME
  ? new Date(process.env.NEXT_PUBLIC_BUILD_TIME).toLocaleString()
  : 'local';

export default function SettingsPage() {
  return (
    <div className="max-w-5xl mx-auto -mb-12 p-3 sm:p-6 pb-12 sm:pb-24">
      <h1 className="text-xl font-bold mb-3">Application settings</h1>
      <p>Last build: {buildTime} ({commitSha ? ` commitSha: ${commitSha}` : 'localhost'})</p>
      <ClearCacheButton />
    </div>
  );
}
