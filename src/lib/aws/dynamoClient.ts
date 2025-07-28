import { DynamoDBClient } from '@aws-sdk/client-dynamodb';

function getDynamoDbClient() {
  const region = 'ap-northeast-1';

  if (process.env.NODE_ENV === 'development') {
    const accessKeyId = process.env.AWS_ACCESS_KEY_ID;
    const secretAccessKey = process.env.AWS_SECRET_ACCESS_KEY;

    if (!accessKeyId || !secretAccessKey) {
      throw new Error('Missing AWS credentials in development environment');
    }

    return new DynamoDBClient({
      region,
      credentials: {
        accessKeyId,
        secretAccessKey,
      },
    });
  }

  // In production, use default provider chain (e.g. for Vercel or IAM roles)
  return new DynamoDBClient({ region });
}

export const dynamoDbClient = getDynamoDbClient();
