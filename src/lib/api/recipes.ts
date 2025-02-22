import { DynamoDBClient } from '@aws-sdk/client-dynamodb';
import { DynamoDBDocumentClient, ScanCommand, PutCommand } from '@aws-sdk/lib-dynamodb';
import type { Recipe } from '@/types/recipe';
import { recipes } from '@/lib/mocks/mock';

const client = new DynamoDBClient({ region: process.env.AWS_REGION });
const docClient = DynamoDBDocumentClient.from(client);

const AWS_RECIPES_TABLENAME = process.env.NEXT_PUBLIC_AWS_RECIPES_TABLENAME ?? '';



// use?
const USE_MOCK = process.env.NEXT_PUBLIC_USE_MOCK === 'true';
const GET_ALL_RECIPES_ENDPT = process.env.NEXT_PUBLIC_GET_ALL_RECIPES_ENDPT ?? '';
const GET_ONE_RECIPE_ENDPT = process.env.NEXT_PUBLIC_GET_ONE_RECIPE_ENDPT ?? '';



/**
 * A
 */
export async function getAllRecipes<T>(): Promise<Recipe[]> {
  if (USE_MOCK) {
    console.log(`Using mock data for ${GET_ALL_RECIPES_ENDPT}`);
    return Promise.resolve(recipes);
  }

  try {
    const response = await fetch(GET_ALL_RECIPES_ENDPT);
    if (!response.ok) {
      throw new Error(`API error: ${response.statusText}`);
    }
    return await response.json();
  } catch (error) {
    console.error(`Fetch failed for ${GET_ALL_RECIPES_ENDPT}:`, error);
    throw error;
  }
}

export async function getOneRecipe<T>(uid: string): Promise<Recipe | null> {
  if (USE_MOCK) {
    console.log(`Using mock data for ${GET_ONE_RECIPE_ENDPT}`);
    const recipe: Recipe | undefined = recipes.find((p) => p.uid === uid);
    if (!recipe) return null;
    return Promise.resolve(recipe);
  }

  try {
    // const response = await fetch(`https://example.com/api/blog/${uid}`, { cache: 'no-store' });
    const response = await fetch(GET_ONE_RECIPE_ENDPT);
    if (!response.ok) {
      throw new Error(`API error: ${response.statusText}`);
    }
    const recipe: Recipe | undefined = recipes.find((p) => p.uid === uid);
    if (!recipe) return null;
    return await response.json();
  } catch (error) {
    console.error(`Fetch failed for ${GET_ONE_RECIPE_ENDPT}:`, error);
    throw error;
  }
}

export async function getRecipeCount<T>(): Promise<string> {
  return String((await getAllRecipes()).length);
}



/**
 * B
 */
type DynamoDbRecipe = Record<string, any>;

const emptyRecipe: Recipe = {
  id: '',
  uid: '',
  title: '',
  tags: [],
  date: '',
  description: '',
  ingredients: '',
  instructions: '',
  reference: '',
};

function formatDynamoDbRecipe(recipesRaw: DynamoDbRecipe[]): Recipe[] {
  return recipesRaw.map((recipe) => {
    try {
      return {
        id: recipe.id || '',
        uid: recipe.uid || '',
        title: recipe.title || recipe.name, // -- FIX
        tags: Array.isArray(recipe.tags) ? recipe.tags : [],
        date: recipe.date || '',
        description: recipe.description || '',
        ingredients: recipe.ingredients || '',
        instructions: recipe.instructions || '',
        reference: recipe.reference || '',
      };
    } catch (error) {
      console.error('Error parsing recipe ID:', recipe.id, error);
      return emptyRecipe;
    }
  });
}

export async function getAllRecipesFromDynamoDb() {
  try {
    const command = new ScanCommand({ TableName: AWS_RECIPES_TABLENAME });
    const response = await docClient.send(command);
    if (!response.Items) return [];

    const recipesRaw: DynamoDbRecipe[] = response.Items as DynamoDbRecipe[];
    return formatDynamoDbRecipe(recipesRaw);
  } catch (error) {
    console.error('Error fetching recipes:', error);
    return [];
  }
}

export async function createRecipeInDynamoDb(recipe: Recipe) {
  try {
    const command = new PutCommand({
      TableName: AWS_RECIPES_TABLENAME,
      Item: recipe,
    });

    await docClient.send(command);
    return recipe;
  } catch (error) {
    console.error('Error saving recipe:', error);
    throw new Error('Failed to save recipe');
  }
}

