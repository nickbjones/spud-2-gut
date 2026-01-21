import { NextResponse } from 'next/server';
import { getAllTags, createTag } from '@/lib/api/tags';

// Get all tags
export async function GET() {
  try {
    console.log('GET /api/tags');
    const tags = await getAllTags();
    return NextResponse.json(tags, { status: 200 });
  } catch (error) {
    console.error('API Error:', error);
    return NextResponse.json({ error: 'Failed to fetch tags' }, { status: 500 });
  }
}

// Create a new tag
export async function POST(req: Request) {
  try {
    console.log('POST /api/tags');
    const tag = await req.json();
    const newTag = await createTag(tag);
    return NextResponse.json(newTag, { status: 201 });
  } catch (error) {
    console.error('API Error:', error);
    return NextResponse.json({ error: 'Failed to create tag' }, { status: 500 });
  }
}
