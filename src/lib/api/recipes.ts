import { DynamoDBDocumentClient, ScanCommand, PutCommand, DeleteCommand } from '@aws-sdk/lib-dynamodb';
import type { RecipeType } from '@/types/recipe';
import { dynamoDbClient } from '@/lib/aws/dynamoClient';

const docClient = DynamoDBDocumentClient.from(dynamoDbClient);
const AWS_RECIPES_TABLENAME = process.env.NEXT_PUBLIC_AWS_RECIPES_TABLENAME ?? '';

import { cache } from '../cache';
const CACHE_KEY = 'allRecipes';

const emptyRecipe: RecipeType = {
  id: '',
  uid: '',
  title: '',
  tags: [],
  date: '',
  description: '',
  ingredients: '',
  instructions: '',
  reference: '',
  isPinned: false,
  cookCount: '',
};

function formatDynamoDbRecipe(recipeRaw: RecipeType): RecipeType {
  try {
    return {
      id: recipeRaw.id || '',
      uid: recipeRaw.uid || '',
      title: recipeRaw.title || '', // || recipeRaw.name, // -- FIX
      tags: Array.isArray(recipeRaw.tags) ? recipeRaw.tags : [],
      date: recipeRaw.date || '',
      description: recipeRaw.description || '',
      ingredients: recipeRaw.ingredients || '',
      instructions: recipeRaw.instructions || '',
      reference: recipeRaw.reference || '',
      isPinned: recipeRaw.isPinned || false,
      cookCount: recipeRaw.cookCount || '',
    };
  } catch (error) {
    console.error('Error parsing recipe ID:', recipeRaw.id, error);
    return emptyRecipe;
  }
}

function formatDynamoDbRecipes(recipesRaw: RecipeType[]): RecipeType[] {
  return recipesRaw.map((recipeRaw) => {
    return formatDynamoDbRecipe(recipeRaw);
  });
}

// Need to use ScanCommand instead of QueryCommand because I'm a dumbass and didn't set a PK on the DB.
// QueryCommand is more efficient for fetching items with a specific partition key,
// but in this case it's probably fine because we should only be fetching O(100) items.
export async function getAllRecipes(): Promise<RecipeType[]> {
  const cached = cache.get(CACHE_KEY); // get cache
  if (cached) return cached;
  console.log('[api/recipes::getAllRecipes] REFETCHING recipes');

  const command = new ScanCommand({
    TableName: AWS_RECIPES_TABLENAME,
    FilterExpression: 'begins_with(#id, :prefix)',
    ExpressionAttributeNames: {
      '#id': 'id',
    },
    ExpressionAttributeValues: {
      ':prefix': 'RECIPE#',
    },
  });

  try {
    const { Items } = await docClient.send(command);
    if (!Items || Items.length === 0) return [];

    const recipesRaw = Items as RecipeType[];
    const formattedRecipeData = formatDynamoDbRecipes(recipesRaw);
    cache.set(CACHE_KEY, formattedRecipeData); // set cache
    return formattedRecipeData;
  } catch (error) {
    console.error('Error fetching recipes:', error);
    return [];
  }
}

// Would be better to use GetCommand instead of calling getAllRecipes(), but I'm a dumbass and didn't set a PK on the DB.
// It's not possible to add a PK, so the DB will have to be rebuilt, which is too much effort.
// The better solution would be to remove uid from the db and query by PK, for example:
// instead of: "/recipes/taco-rice" mapping to "RECIPE#022" and uid "taco-rice"
// better: "/recipes/022" to map to "RECIPE#022" (no uid)
export async function getOneRecipe(uid: string): Promise<RecipeType | undefined> {
  try {
    const allRecipes = await getAllRecipes();
    const recipe: RecipeType | undefined = allRecipes.find((p) => p.uid === uid);
    return recipe;
  } catch (error) {
    console.error('API Error:', error);
    return undefined;
  }  
}

export async function createRecipe(recipe: RecipeType) {
  try {
    const command = new PutCommand({
      TableName: AWS_RECIPES_TABLENAME,
      Item: recipe,
    });

    await docClient.send(command);
    cache.delete(CACHE_KEY); // invalidate cache
    return recipe;
  } catch (error) {
    console.error('Error saving recipe:', error);
    throw new Error('Failed to save recipe');
  }
}

export async function updateRecipe(recipe: RecipeType) {
  try {
    const command = new PutCommand({
      TableName: AWS_RECIPES_TABLENAME,
      Item: recipe,
    });

    await docClient.send(command);
    cache.delete(CACHE_KEY); // invalidate cache
    return recipe;
  } catch (error) {
    console.error('Error updating recipe:', error);
    throw new Error('Failed to update recipe');
  }
}

export async function deleteRecipe(id: string) {
  try {
    const command = new DeleteCommand({
      TableName: AWS_RECIPES_TABLENAME,
      Key: { id },
    });

    await docClient.send(command);
    cache.delete(CACHE_KEY); // invalidate cache
    return true;
  } catch (error) {
    console.error('Error deleting recipe:', error);
    throw new Error('Failed to delete recipe');
  }
}
