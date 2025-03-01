import { NextRequest, NextResponse } from 'next/server';
import { getOneTag } from '@/lib/api/tags';

export async function GET(req: NextRequest, { params }: { params: Promise<{ id: string }> }) {
  const id = (await params).id;

  if (!id) {
    return NextResponse.json({ error: 'Recipe ID is required' }, { status: 400 });
  }

  try {
    const recipe = await getOneTag(id);
    if (!recipe) {
      return NextResponse.json({ error: 'Recipe not found' }, { status: 404 });
    }

    return NextResponse.json(recipe, { status: 200 });
  } catch (error) {
    console.error('Error fetching recipe:', error);
    return NextResponse.json({ error: 'Failed to fetch recipe' }, { status: 500 });
  }
}
