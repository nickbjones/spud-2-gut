import { NextResponse } from 'next/server';
import { getAllRecipesFromDynamoDb } from '@/lib/api/recipes';

export async function GET() {
  try {
    const recipes = await getAllRecipesFromDynamoDb();
    return NextResponse.json(recipes, { status: 200 });
  } catch (error) {
    console.error('API Error:', error);
    return NextResponse.json({ error: 'Failed to fetch recipes' }, { status: 500 });
  }
}
