import { RecipeType } from '@/types/recipe';
import { useRef, useState } from 'react';
import CookCounter from './CookCounter';

export default function CookCounterButton({ recipe }: { recipe: RecipeType }) {
  const [count, setCount] = useState<string>(recipe.cookCount || '0');
  const [isUpdating, setIsUpdating] = useState<boolean>(false);
  const timerRef = useRef<NodeJS.Timeout | null>(null);
  const longPressTriggered = useRef(false);

  const updateCount = async (oldCount: string, newCount: string) => {
    setCount(newCount);
    recipe.cookCount = newCount;
    try {
      const res = await fetch(`/api/recipes/${encodeURIComponent(recipe.id)}`, {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(recipe),
      });

      if (!res.ok) {
        throw new Error('Failed to update recipe');
      };

      if (res.ok) {
        setCount(newCount);
      } else {
        setCount(oldCount);
        console.error('Failed to update cook count');
      }
    } catch (err) {
      console.error('Error updating count:', err);
    }
  };

  const startPressTimer = () => {
    if (isUpdating) return;
    longPressTriggered.current = false;

    timerRef.current = setTimeout(() => {
      longPressTriggered.current = true;
      setIsUpdating(true);
      updateCount(count, String(Math.max(0, Number(count) - 1)));
      setTimeout(() => setIsUpdating(false), 150);
    }, 600); // long-press threshold (ms)
  };

  const endPress = () => {
    if (timerRef.current) clearTimeout(timerRef.current);

    // If the user released before threshold → increment
    if (!longPressTriggered.current && !isUpdating) {
      setIsUpdating(true);
      updateCount(count, String(Number(count) + 1));
      setTimeout(() => setIsUpdating(false), 150);
    }
  };

  return (
    <button
      className="cursor-pointer hover:opacity-70 disabled:opacity-50 select-none"
      disabled={isUpdating}
      onTouchStart={startPressTimer}
      onTouchEnd={endPress}
      onTouchCancel={endPress}
      onMouseDown={startPressTimer}
      onMouseUp={endPress}
      onMouseLeave={() => timerRef.current && clearTimeout(timerRef.current)} // only cancels, not triggers
    >
      <CookCounter cookCount={count} />
    </button>
  );
}
