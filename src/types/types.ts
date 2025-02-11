export type Recipe = {
  id: string; // Indexed from 0
  uid: string; // Ex: 'mashed-potatoes'
  title: string; // Ex: 'Mashed Potatoes'
  tags: string[];
  date: string; // ISO string format (YYYY-MM-DD)
  description: string; // Markdown
  ingredients: string; // Markdown
  instructions: string; // Markdown
  reference: string;
};

export type Tag = {
  id: string; // Indexed from 0
  uid: string; // Ex: 'spicy'
  title: string; // Ex: 'Spicy'
  description: string; // Markdown
};

type FormData = {
  id: string;
  uid: string;
  title: string;
  tags: string[];
  date: string;
  description: string;
  ingredients: string;
  instructions: string;
  reference: string;
};
