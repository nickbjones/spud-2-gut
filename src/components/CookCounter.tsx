export default function CookCounter({ cookCount }: { cookCount: string }) {
  const getColorClass = (count: string) => {
    const numCount = Number(count);
    if (numCount === 0) return 'text-gray-400';
    if (numCount === 1) return 'text-orange-300';
    if (numCount >= 2 && numCount <= 5) return 'text-orange-400';
    if (numCount >= 6 && numCount <= 9) return 'text-orange-500';
    return 'text-red-500';
  };

  return (
    <span className="pl-2 text-nowrap">
      🍳<span className={`font-bold ${getColorClass(cookCount)}`}>{cookCount}</span>
    </span>
  );
}
