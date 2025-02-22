import { NextResponse } from 'next/server';
import { getAllRecipes, createRecipe } from '@/lib/api/recipes';

export async function GET() {
  try {
    const recipes = await getAllRecipes();
    return NextResponse.json(recipes, { status: 200 });
  } catch (error) {
    console.error('API Error:', error);
    return NextResponse.json({ error: 'Failed to fetch recipes' }, { status: 500 });
  }
}

export async function POST(req: Request) {
  try {
    const recipe = await req.json();
    const newRecipe = await createRecipe(recipe);
    return NextResponse.json(newRecipe, { status: 201 });
  } catch (error) {
    console.error('API Error:', error);
    return NextResponse.json({ error: 'Failed to create recipe' }, { status: 500 });
  }
}
