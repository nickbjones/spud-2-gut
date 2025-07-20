import { DynamoDBClient } from '@aws-sdk/client-dynamodb';
import { DynamoDBDocumentClient, ScanCommand, PutCommand, DeleteCommand } from '@aws-sdk/lib-dynamodb';
import type { Tag } from '@/types/tag';
// import { tags as mockTags } from '@/lib/mocks/mock';

const client = new DynamoDBClient({ region: process.env.AWS_REGION });
const docClient = DynamoDBDocumentClient.from(client);

// const useMock = process.env.NEXT_PUBLIC_USE_MOCK === 'true';
const AWS_RECIPES_TABLENAME = process.env.NEXT_PUBLIC_AWS_RECIPES_TABLENAME ?? '';

export type DynamoDbTag = {
  id: string,
  uid: string,
  title: string,
  description: string,
};

const emptyTag: Tag = {
  id: '',
  uid: '',
  title: '',
  description: '',
};

function formatDynamoDbTag(tagRaw: DynamoDbTag): Tag {
  try {
    return {
      id: tagRaw.id || '',
      uid: tagRaw.uid || '',
      title: tagRaw.title || '', // || tagRaw.name, // -- FIX
      description: tagRaw.description || '',
    };
  } catch (error) {
    console.error('Error parsing tag ID:', tagRaw.id, error);
    return emptyTag;
  }
}

function formatDynamoDbTags(tagsRaw: DynamoDbTag[]): Tag[] {
  return tagsRaw.map((tagRaw) => {
    return formatDynamoDbTag(tagRaw);
  });
}


/**
 * Fetches all tags from the DynamoDB table.
 */
export async function getAllTags(): Promise<Tag[]> {
  try {
    // QueryCommand is more efficient for fetching items with a specific partition key
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
    const response = await docClient.send(command);

    if (!response.Items) return [];

    const tagsRaw: DynamoDbTag[] = response.Items as DynamoDbTag[];
    return formatDynamoDbTags(tagsRaw);
  } catch (error) {
    console.error('Error fetching tags:', error);
    return [];
  }
}

// temporary fix (fetch ALL tags, then find the correct one)
export async function getOneTag(uid: string): Promise<Tag | undefined> {
  console.log('getOneTag', uid);
  try {
    const allTags = await getAllTags();
    const tag: Tag | undefined = allTags.find((p) => p.uid === uid);
    return tag;
  } catch (error) {
    console.error('API Error:', error);
    return undefined;
  }  
}

export async function createTag(tag: Tag) {
  console.log('createTag', tag);
  try {
    const command = new PutCommand({
      TableName: AWS_RECIPES_TABLENAME,
      Item: tag,
    });

    await docClient.send(command);
    return tag;
  } catch (error) {
    console.error('Error saving tag:', error);
    throw new Error('Failed to save tag');
  }
}

export async function deleteTag(id: string) {
  console.log('deleteTag', { id });
  try {
    const command = new DeleteCommand({
      TableName: AWS_RECIPES_TABLENAME,
      Key: { id },
    });

    await docClient.send(command);
    return true;
  } catch (error) {
    console.error('Error deleting tag:', error);
    throw new Error('Failed to delete tag');
  }
}

export async function updateTag(tag: Tag) {
  console.log('updateTag', tag);
  try {
    const command = new PutCommand({
      TableName: AWS_RECIPES_TABLENAME,
      Item: tag,
    });

    await docClient.send(command);
    return tag;
  } catch (error) {
    console.error('Error updating tag:', error);
    throw new Error('Failed to update tag');
  }
}
