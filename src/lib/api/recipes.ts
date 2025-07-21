import { DynamoDBClient } from '@aws-sdk/client-dynamodb';
import { DynamoDBDocumentClient, ScanCommand, PutCommand } from '@aws-sdk/lib-dynamodb';
import type { Recipe } from '@/types/recipe';
// import { recipes } from '@/lib/mocks/mock';

const client = new DynamoDBClient({ region: process.env.AWS_REGION });
const docClient = DynamoDBDocumentClient.from(client);

const AWS_RECIPES_TABLENAME = process.env.NEXT_PUBLIC_AWS_RECIPES_TABLENAME ?? '';

// use?
// const USE_MOCK = process.env.NEXT_PUBLIC_USE_MOCK === 'true';
// const GET_ALL_RECIPES_ENDPT = process.env.NEXT_PUBLIC_GET_ALL_RECIPES_ENDPT ?? '';
// const GET_ONE_RECIPE_ENDPT = process.env.NEXT_PUBLIC_GET_ONE_RECIPE_ENDPT ?? '';

export type DynamoDbRecipe = {
  id: string,
  uid: string,
  title: string,
  tags: string[],
  date: string,
  description: string,
  ingredients: string,
  instructions: string,
  reference: string,
};

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

function formatDynamoDbRecipe(recipeRaw: DynamoDbRecipe): Recipe {
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
    };
  } catch (error) {
    console.error('Error parsing recipe ID:', recipeRaw.id, error);
    return emptyRecipe;
  }
}

function formatDynamoDbRecipes(recipesRaw: DynamoDbRecipe[]): Recipe[] {
  return recipesRaw.map((recipeRaw) => {
    return formatDynamoDbRecipe(recipeRaw);
  });
}

export async function getAllRecipes() {
  try {
    // QueryCommand is more efficient for fetching items with a specific partition key
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
    const response = await docClient.send(command);

    if (!response.Items) return [];

    const recipesRaw: DynamoDbRecipe[] = response.Items as DynamoDbRecipe[];
    return formatDynamoDbRecipes(recipesRaw);
  } catch (error) {
    console.error('Error fetching recipes:', error);
    return [];
  }
}

// temporary fix (fetch ALL recipes, then find the correct one)
export async function getOneRecipe(uid: string): Promise<Recipe | undefined> {
  try {
    const allRecipes = await getAllRecipes();
    const recipe: Recipe | undefined = allRecipes.find((p) => p.uid === uid);
    return recipe;
  } catch (error) {
    console.error('API Error:', error);
    return undefined;
  }  
}

export async function createRecipe(recipe: Recipe) {
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

import { DeleteCommand } from '@aws-sdk/lib-dynamodb';

export async function deleteRecipe(id: string) {
  try {
    const command = new DeleteCommand({
      TableName: AWS_RECIPES_TABLENAME,
      Key: { id },
    });

    await docClient.send(command);
    return true;
  } catch (error) {
    console.error('Error deleting recipe:', error);
    throw new Error('Failed to delete recipe');
  }
}

export async function updateRecipe(recipe: Recipe) {
  try {
    const command = new PutCommand({
      TableName: AWS_RECIPES_TABLENAME,
      Item: recipe,
    });

    await docClient.send(command);
    return recipe;
  } catch (error) {
    console.error('Error updating recipe:', error);
    throw new Error('Failed to update recipe');
  }
}
