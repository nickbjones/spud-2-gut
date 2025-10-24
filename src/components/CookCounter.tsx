import { useState } from 'react';

type CookCountButtonProps = {
  recipeId: string;
  initialCount: number;
};

export default function CookCountButton({ recipeId, initialCount }: CookCountButtonProps) {
  const [count, setCount] = useState(initialCount);
  const [isUpdating, setIsUpdating] = useState(false);

  const handleClick = async () => {
    setCount((c) => c + 1);
    setIsUpdating(false);

    // if (isUpdating) return;
    // setIsUpdating(true);

    // try {
    //   const res = await fetch(`/api/recipes/${recipeId}/cook-count`, {
    //     method: 'POST',
    //   });

    //   if (res.ok) {
    //     setCount((c) => c + 1);
    //   } else {
    //     console.error('Failed to update cook count');
    //   }
    // } catch (err) {
    //   console.error('Error updating cook count:', err);
    // } finally {
    //   setIsUpdating(false);
    // }
  };

  return (
    <button
      onClick={handleClick}
      disabled={isUpdating}
      className="cursor-pointer hover:opacity-70"
      id={recipeId} // remove later
    >
      🍳<span className="pl-[2] font-bold text-orange-700">{count}</span>
    </button>
  );
}
