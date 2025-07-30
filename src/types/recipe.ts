export type RecipeType = {
  id: string; // Indexed from 0
  uid: string; // Ex: 'mashed-potatoes'
  title: string; // Ex: 'Mashed Potatoes'
  description: string; // Markdown
  ingredients: string; // Markdown
  instructions: string; // Markdown
  reference: string;
  tags: string[];
  date: string; // ISO string format (YYYY-MM-DD)
};
