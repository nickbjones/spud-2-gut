import { NextRequest, NextResponse } from 'next/server';
import { getOneTag, deleteTag, updateTag } from '@/lib/api/tags';

// Get a tag
export async function GET(
  req: NextRequest,
  context: { params: Promise<{ id: string }> }
) {
  const { id: uid } = await context.params;
  console.log(`GET /api/tags/[ ${uid} ]`);

  if (!uid) {
    return NextResponse.json({ error: 'Tag uid is required' }, { status: 400 });
  }

  try {
    const tag = await getOneTag(uid);
    if (!tag) {
      return NextResponse.json({ error: 'Tag not found' }, { status: 404 });
    }

    return NextResponse.json(tag, { status: 200 });
  } catch (error) {
    console.error('Error fetching tag:', error);
    return NextResponse.json({ error: 'Failed to fetch tag' }, { status: 500 });
  }
}

// Update a tag
export async function PUT(
  req: NextRequest,
  context: { params: Promise<{ id: string }> }
) {
  const { id: uid } = await context.params;
  console.log(`PUT /api/tags/[ ${uid} ]`);

  if (!uid) {
    return NextResponse.json({ error: 'Tag uid is required' }, { status: 400 });
  }

  try {
    const tagData = await req.json();

    if (!tagData.title) {
      return NextResponse.json({ error: 'Title is required' }, { status: 400 });
    }

    const updated = await updateTag(tagData);
    if (!updated) {
      return NextResponse.json({ error: 'Tag not found' }, { status: 404 });
    }

    return NextResponse.json(updated, { status: 200 });
  } catch (error) {
    console.error('Error updating tag:', error);
    return NextResponse.json({ error: 'Failed to update tag' }, { status: 500 });
  }
}

// Delete a tag
export async function DELETE(
  req: NextRequest,
  context: { params: Promise<{ id: string }> }
) {
  const { id: uid } = await context.params;
  console.log(`DELETE /api/tags/[ ${uid} ]`);

  if (!uid) {
    return NextResponse.json({ error: 'Tag uid is required' }, { status: 400 });
  }

  try {
    // Assuming deleteTag is a function that deletes a tag by ID
    const result = await deleteTag(uid);
    if (!result) {
      return NextResponse.json({ error: 'Tag not found or could not be deleted' }, { status: 404 });
    }

    return NextResponse.json({ message: 'Tag deleted successfully' });
  } catch (error) {
    console.error('Error deleting tag:', error);
    return NextResponse.json({ error: 'Failed to delete tag' }, { status: 500 });
  }
}
