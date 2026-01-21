import { NextRequest, NextResponse } from 'next/server';
import { getOneRecipe, deleteRecipe, updateRecipe } from '@/lib/api/recipes';

// Get a recipe
export async function GET(
  req: NextRequest,
  context: { params: Promise<{ id: string }> }
) {
  try {
    const { id: uid } = await context.params;
    console.log(`GET /api/recipes/[ ${uid} ]`);

    if (!uid) {
      return new NextResponse('Recipe uid is required', { status: 400 });
    }

    const recipe = await getOneRecipe(uid);

    if (!recipe) {
      return new NextResponse('Recipe not found', { status: 404 });
    }

    return NextResponse.json(recipe, { status: 200 });
  } catch (error) {
    console.error('GET /api/recipes/[id] error:', error);
    return new NextResponse('Failed to fetch recipe', { status: 500 });
  }
}

// Update a recipe
export async function PUT(
  req: NextRequest,
  context: { params: Promise<{ id: string }> }
) {
  try {
    const { id: uid } = await context.params;
    console.log(`PUT /api/recipes/[ ${uid} ]`);

    if (!uid) {
      return new NextResponse('Recipe uid is required', { status: 400 });
    }

    const recipeData = await req.json();
    if (!recipeData.title) {
      return new NextResponse('Title is required', { status: 400 });
    }

    const updated = await updateRecipe(recipeData);
    if (!updated) {
      return new NextResponse('Recipe not found', { status: 404 });
    }

    return NextResponse.json(updated, { status: 200 });
  } catch (error) {
    console.error('PUT /api/recipes/[id] error:', error);
    return new NextResponse('Failed to update recipe', { status: 500 });
  }
}

// Delete a recipe
export async function DELETE(
  req: NextRequest,
  context: { params: Promise<{ id: string }> }
) {
  try {
    const { id } = await context.params;
    console.log(`DELETE /api/recipes/[ ${id} ]`);

    if (!id) {
      return new NextResponse('Recipe id is required', { status: 400 });
    }

    const result = await deleteRecipe(id);
    if (!result) {
      return NextResponse.json({ error: 'Recipe not found or could not be deleted' }, { status: 404 });
    }

    return NextResponse.json({ success: true });
  } catch (error) {
    console.error('DELETE /api/recipes/[id] error:', error);
    return new NextResponse('Failed to delete recipe', { status: 500 });
  }
}
