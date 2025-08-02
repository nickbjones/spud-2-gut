export default function Uid({ uid = '' }: { uid?: string }) {
  return (
    <p className="text-sm mt-6 mb-3">
      <span className="text-gray-600 font-medium mr-2">UID:</span>
      <span className="text-gray-400">{uid}</span>
    </p>
  );
}
