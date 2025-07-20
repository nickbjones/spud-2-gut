import { NextRequest, NextResponse } from 'next/server';
import { getOneTag, deleteTag } from '@/lib/api/tags';

export async function GET(req: NextRequest, { params }: { params: Promise<{ id: string }> }) {
  const id = (await params).id;
  console.log(`GET /api/tags/[ ${id} ]`);

  if (!id) {
    return NextResponse.json({ error: 'Tag ID is required' }, { status: 400 });
  }

  try {
    const tag = await getOneTag(id);
    if (!tag) {
      return NextResponse.json({ error: 'Tag not found' }, { status: 404 });
    }

    return NextResponse.json(tag, { status: 200 });
  } catch (error) {
    console.error('Error fetching tag:', error);
    return NextResponse.json({ error: 'Failed to fetch tag' }, { status: 500 });
  }
}

export async function DELETE(req: NextRequest, { params }: { params: Promise<{ id: string }> }) {
  const id = (await params).id;
  console.log(`DELETE /api/tags/[ ${id} ]`);

  if (!id) {
    return NextResponse.json({ error: 'Tag ID is required' }, { status: 400 });
  }

  try {
    // Assuming deleteTag is a function that deletes a tag by ID
    const result = await deleteTag(id);
    if (!result) {
      return NextResponse.json({ error: 'Tag not found or could not be deleted' }, { status: 404 });
    }

    return NextResponse.json({ message: 'Tag deleted successfully' });
  } catch (error) {
    console.error('Error deleting tag:', error);
    return NextResponse.json({ error: 'Failed to delete tag' }, { status: 500 });
  }
}
