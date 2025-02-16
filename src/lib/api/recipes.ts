import type { Recipe } from '@/types/recipe';
import { recipes } from '@/lib/mocks/mock';

const useMock = process.env.NEXT_PUBLIC_USE_MOCK === 'true';
const getAllRecipesEndpoint = process.env.NEXT_PUBLIC_GET_ALL_RECIPES_ENDPT ?? '';
const getOneRecipeEndpoint = process.env.NEXT_PUBLIC_GET_ONE_RECIPE_ENDPT ?? '';

export async function getAllRecipes<T>(): Promise<Recipe[]> {
  if (useMock) {
    console.log(`Using mock data for ${getAllRecipesEndpoint}`);
    return Promise.resolve(recipes);
  }

  try {
    const response = await fetch(getAllRecipesEndpoint);
    if (!response.ok) {
      throw new Error(`API error: ${response.statusText}`);
    }
    return await response.json();
  } catch (error) {
    console.error(`Fetch failed for ${getAllRecipesEndpoint}:`, error);
    throw error;
  }
}

export async function getOneRecipe<T>(uid: string): Promise<Recipe | null> {
  if (useMock) {
    console.log(`Using mock data for ${getOneRecipeEndpoint}`);
    const recipe: Recipe | undefined = recipes.find((p) => p.uid === uid);
    if (!recipe) return null;
    return Promise.resolve(recipe);
  }

  try {
    // const response = await fetch(`https://example.com/api/blog/${uid}`, { cache: 'no-store' });
    const response = await fetch(getOneRecipeEndpoint);
    if (!response.ok) {
      throw new Error(`API error: ${response.statusText}`);
    }
    const recipe: Recipe | undefined = recipes.find((p) => p.uid === uid);
    if (!recipe) return null;
    return await response.json();
  } catch (error) {
    console.error(`Fetch failed for ${getOneRecipeEndpoint}:`, error);
    throw error;
  }
}

export async function getRecipeCount<T>(): Promise<string> {
  return String((await getAllRecipes()).length);
}
