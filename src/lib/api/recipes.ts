import { DynamoDBDocumentClient, ScanCommand, PutCommand, DeleteCommand } from '@aws-sdk/lib-dynamodb';
import type { RecipeType } from '@/types/recipe';
import { dynamoDbClient } from '@/lib/aws/dynamoClient';
import { DynamoDbRecipe } from '../aws/dynamoTypes';

const docClient = DynamoDBDocumentClient.from(dynamoDbClient);
const AWS_RECIPES_TABLENAME = process.env.NEXT_PUBLIC_AWS_RECIPES_TABLENAME ?? '';

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
};

function formatDynamoDbRecipe(recipeRaw: DynamoDbRecipe): RecipeType {
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

function formatDynamoDbRecipes(recipesRaw: DynamoDbRecipe[]): RecipeType[] {
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

export async function getOneRecipe(uid: string): Promise<RecipeType | undefined> {
  // temporary fix (fetch ALL recipes, then find the correct one)
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
    return recipe;
  } catch (error) {
    console.error('Error saving recipe:', error);
    throw new Error('Failed to save recipe');
  }
}

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

export async function updateRecipe(recipe: RecipeType) {
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
