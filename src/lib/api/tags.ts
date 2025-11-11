import { DynamoDBDocumentClient, ScanCommand, PutCommand, DeleteCommand } from '@aws-sdk/lib-dynamodb';
import type { TagType } from '@/types/tag';
import { dynamoDbClient } from '@/lib/aws/dynamoClient';

const docClient = DynamoDBDocumentClient.from(dynamoDbClient);
const AWS_RECIPES_TABLENAME = process.env.NEXT_PUBLIC_AWS_RECIPES_TABLENAME ?? '';

import { cache } from '../cache';
const CACHE_KEY = 'allTags';

const emptyTag: TagType = {
  id: '',
  uid: '',
  title: '',
  date: '',
};

function formatDynamoDbTag(tagRaw: TagType): TagType {
  try {
    return {
      id: tagRaw.id || '',
      uid: tagRaw.uid || '',
      title: tagRaw.title || '', // || tagRaw.name, // -- FIX
      description: tagRaw.description || '',
      date: tagRaw.date || '',
      color: tagRaw.color || '',
    };
  } catch (error) {
    console.error('Error parsing tag ID:', tagRaw.id, error);
    return emptyTag;
  }
}

function formatDynamoDbTags(tagsRaw: TagType[]): TagType[] {
  return tagsRaw.map((tagRaw) => {
    return formatDynamoDbTag(tagRaw);
  });
}

// Need to use ScanCommand instead of QueryCommand because I'm a dumbass and didn't set a PK on the DB.
// QueryCommand is more efficient for fetching items with a specific partition key,
// but in this case it's probably fine because we should only be fetching O(100) items.
export async function getAllTags(): Promise<TagType[]> {
  const cached = cache.get(CACHE_KEY); // get cache
  if (cached) return cached;
  console.log('[api/tags::getAllTags] REFETCHING tags');

  const command = new ScanCommand({
    TableName: AWS_RECIPES_TABLENAME,
    FilterExpression: 'begins_with(#id, :prefix)',
    ExpressionAttributeNames: {
      '#id': 'id',
    },
    ExpressionAttributeValues: {
      ':prefix': 'TAG#',
    },
  });

  try {
    const { Items } = await docClient.send(command);
    if (!Items || Items.length === 0) return [];

    const tagsRaw = Items as TagType[];
    const formattedTagData = formatDynamoDbTags(tagsRaw);
    cache.set(CACHE_KEY, formattedTagData); // set cache
    return formattedTagData;
  } catch (error) {
    console.error('Error fetching tags:', error);
    return [];
  }
}

// Would be better to use GetCommand instead of calling getAllTags(), but I'm a dumbass and didn't set a PK on the DB.
// It's not possible to add a PK, so the DB will have to be rebuilt, which is too much effort.
// The better solution would be to remove uid from the db and query by PK, for example:
// instead of: "/tags/savory" mapping to "TAG#014" and uid "savory"
// better: "/tags/014" to map to "TAG#014" (no uid)
export async function getOneTag(uid: string): Promise<TagType | undefined> {
  try {
    const allTags = await getAllTags();
    const tag: TagType | undefined = allTags.find((p) => p.uid === uid);
    return tag;
  } catch (error) {
    console.error('API Error:', error);
    return undefined;
  }  
}

export async function createTag(tag: TagType) {
  try {
    const command = new PutCommand({
      TableName: AWS_RECIPES_TABLENAME,
      Item: tag,
    });

    await docClient.send(command);
    cache.delete(CACHE_KEY); // invalidate cache
    return tag;
  } catch (error) {
    console.error('Error saving tag:', error);
    throw new Error('Failed to save tag');
  }
}

export async function updateTag(tag: TagType) {
  try {
    const command = new PutCommand({
      TableName: AWS_RECIPES_TABLENAME,
      Item: tag,
    });

    await docClient.send(command);
    cache.delete(CACHE_KEY); // invalidate cache
    return tag;
  } catch (error) {
    console.error('Error updating tag:', error);
    throw new Error('Failed to update tag');
  }
}

export async function deleteTag(id: string) {
  try {
    const command = new DeleteCommand({
      TableName: AWS_RECIPES_TABLENAME,
      Key: { id },
    });

    await docClient.send(command);
    cache.delete(CACHE_KEY); // invalidate cache
    return true;
  } catch (error) {
    console.error('Error deleting tag:', error);
    throw new Error('Failed to delete tag');
  }
}
