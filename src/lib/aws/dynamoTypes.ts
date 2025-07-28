export type DynamoDbRecipe = {
  id: string,
  uid: string,
  title: string,
  tags: string[],
  date: string,
  description: string,
  ingredients: string,
  instructions: string,
  reference: string,
};

export type DynamoDbTag = {
  id: string,
  uid: string,
  title: string,
  description: string,
};
