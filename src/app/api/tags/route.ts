import { NextResponse } from 'next/server';
import { getAllTags } from '@/lib/api/tags';

export async function GET() {
  try {
    const tags = await getAllTags();
    return NextResponse.json(tags, { status: 200 });
  } catch (error) {
    console.error('API Error:', error);
    return NextResponse.json({ error: 'Failed to fetch tags' }, { status: 500 });
  }
}
