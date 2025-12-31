/**
 * Archive page
 */
'use client';

import { usePageTitle } from '@/hooks/usePageTitle';

const listStyles = 'grid grid-cols-1 sm:grid-cols-2 gap-2 sm:gap-3 items-start';

const SectionTitle = ({ text }: { text: string }) => (
  <h2 className="mt-3 ml-1 text-xl font-bold text-white" style={{ textShadow: '0 1px 14px #666' }}>{text}</h2>
);

export default function ArchivePage() {
  usePageTitle('Archive');

  return (
    <div className="min-h-screen bg-gradient-to-b from-orange-100 to-orange-300 bg-fixed">
      <div className="max-w-5xl mx-auto -mb-12 p-3 sm:p-6 pb-12 sm:pb-24">
        <SectionTitle text="Archive" />
        <div className={listStyles}>
          <p>Placeholder for the Archive page.</p>
        </div>
      </div>
    </div>
  );
}
