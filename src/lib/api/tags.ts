import type { Tag } from '@/types/tag';
import { tags as mockTags } from '@/lib/mocks/mock';

const useMock = process.env.NEXT_PUBLIC_USE_MOCK === 'true';
const getAllTagsEndpoint = process.env.NEXT_PUBLIC_GET_ALL_TAGS_ENDPT ?? '';
const getOneTagEndpoint = process.env.NEXT_PUBLIC_GET_ONE_TAG_ENDPT ?? '';

export async function getAllTags(): Promise<Tag[]> {
  if (useMock) {
    console.log(`Using mock data for ${getAllTagsEndpoint}`);
    return Promise.resolve(mockTags);
  }

  // temporarily use mock data until the tags are in the db
  console.log(`Using mock data for ${getAllTagsEndpoint}`);
  return Promise.resolve(mockTags);

  // try {
  //   const response = await fetch(getAllTagsEndpoint);
  //   if (!response.ok) {
  //     throw new Error(`API error: ${response.statusText}`);
  //   }
  //   return await response.json();
  // } catch (error) {
  //   console.error(`Fetch failed for ${getAllTagsEndpoint}:`, error);
  //   throw error;
  // }
}

export async function getOneTag(uid: string): Promise<Tag | null> {
  if (useMock) {
    console.log(`Using mock data for ${getOneTagEndpoint}`);
    const tag: Tag | undefined = mockTags.find((p) => p.uid === uid);
    if (!tag) return null;
    return Promise.resolve(tag);
  }

  // temporarily use mock data until the tags are in the db
  console.log(`Using mock data for ${getOneTagEndpoint}`);
  const tag: Tag | undefined = mockTags.find((p) => p.uid === uid);
  if (!tag) return null;
  return Promise.resolve(tag);

  // try {
  //   // const response = await fetch(`https://example.com/api/blog/${uid}`, { cache: 'no-store' });
  //   const response = await fetch(getOneTagEndpoint);
  //   if (!response.ok) {
  //     throw new Error(`API error: ${response.statusText}`);
  //   }
  //   const tag: Tag | undefined = mockTags.find((p) => p.uid === uid);
  //   if (!tag) return null;
  //   return await response.json();
  // } catch (error) {
  //   console.error(`Fetch failed for ${getOneTagEndpoint}:`, error);
  //   throw error;
  // }
}
